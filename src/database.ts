import fs from "fs";
import path from "path";

import si from "search-index";
import { v4 } from "uuid";

import { parseSearch } from "./parseAlgoliaQueries";

import leveldown from "leveldown";

type SearchIndexPromise = ReturnType<typeof si>;
type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
type SearchIndex = ThenArg<SearchIndexPromise>;
export type Token = Parameters<ThenArg<SearchIndexPromise>["MIN"]>[0];

type Hit = {
  [attribute: string]: any;
} & {
  objectID: string;
};

type SaveableObject = { [attribyte: string]: any } & { objectID?: string };

class Database {
  static databases: { [indexPath: string]: Database } = {};

  indexName: string;
  storePath: string;
  indexPath: string;
  index: SearchIndex;
  store: ReturnType<typeof leveldown>;

  private constructor(
    indexName: string,
    storePath: string,
    indexPath: string,
    index: SearchIndex,
    store: ReturnType<typeof leveldown>
  ) {
    this.indexName = indexName;
    this.storePath = storePath;
    this.indexPath = indexPath;
    this.index = index;
    this.store = store;
  }

  static async purgeAll(): Promise<void> {
    for (const [indexPath, database] of Object.entries(this.databases)) {
      await database.purge();
    }
  }

  static async get(indexName: string, storePath: string): Promise<Database> {
    const basePath = path.resolve(storePath);
    const indexPath = path.join(basePath, indexName);

    if (!fs.existsSync(basePath)) {
      fs.mkdirSync(basePath);
    }

    let database = this.databases[indexPath];

    if (!database) {
      const store = leveldown(indexPath);
      const index = await si({
        // @ts-ignore this is simply wrong
        db: store,
        caseSensitive: true,
      });
      database = new Database(indexName, storePath, indexPath, index, store);
      this.databases[indexPath] = database;
    }

    return database;
  }

  static exists(indexName: string, storePath: string): boolean {
    const indexPath = path.join(storePath, indexName);

    return fs.existsSync(indexPath);
  }

  async searchObjects(criteria: {
    query?: string | string[] | undefined;
    filters?: string | string[] | undefined;
  }): Promise<{
    hits: Hit[];
    query: string | string[] | undefined;
    parsed_query: Token;
    params: string | string[] | undefined;
  }> {
    const { query, filters } = criteria;

    const search = parseSearch({ query, filters });

    const { RESULT: result } = await this.index.QUERY(search, {
      DOCUMENTS: true,
    });

    const hits: Hit[] = [];

    for (const obj of result) {
      let hit: Hit = {
        // @ts-ignore we pass DOCUMENTS: true so this key will be here
        ...obj._doc,
        _id: obj._id,
      };

      hits.push(hit);
    }

    return {
      hits: hits,
      query: query,
      params: filters,
      parsed_query: search,
    };
  }

  async saveObject(
    rawObject: SaveableObject
  ): Promise<{
    createdAt: string;
    taskID: string;
    objectID: string;
  }> {
    let objectID: string;
    objectID = rawObject["objectID"] || v4();
    objectID = objectID.toString();
    objectID = objectID.replace(/-/g, "");

    const object: SaveableObject = {
      ...rawObject,
      objectID,
      _all: "all",
    };

    await this.index.PUT([object], {
      storeVectors: true,
      storeRawDocs: true,
      doNotIndexField: [],
    });

    return {
      createdAt: new Date().toISOString(),
      taskID: "algolite-task-id",
      objectID,
    };
  }

  async updateObject(
    rawObject: SaveableObject
  ): Promise<{
    updatedAt: string;
    taskID: string;
    objectID: string;
  }> {
    const saveResult = await this.saveObject(rawObject);

    return {
      updatedAt: saveResult.createdAt,
      taskID: saveResult.taskID,
      objectID: saveResult.objectID,
    };
  }

  async deleteObject(
    objectID: string
  ): Promise<{
    deletedAt: string;
    taskID: string;
    objectID: string;
  }> {
    const result = await this.deleteObjects([objectID]);

    return { ...result, objectID };
  }

  async deleteObjects(
    objectIDs: string[]
  ): Promise<{
    deletedAt: string;
    taskID: string;
  }> {
    if (objectIDs.length) {
      await this.index.DELETE(objectIDs);
    }

    return {
      deletedAt: new Date().toISOString(),
      taskID: "algolite-task-id",
    };
  }

  async deleteObjectsByQuery(
    rawFilters: string | string[] | undefined
  ): Promise<{
    deletedAt: string;
    taskID: string;
  }> {
    const searchResults = await this.searchObjects({
      filters: rawFilters,
    });
    const objectIDs = searchResults.hits.map((h) => h.objectID);
    const deleteResults = await this.deleteObjects(objectIDs);
    return deleteResults;
  }

  async clear(): Promise<{
    updatedAt: string;
    taskID: string;
  }> {
    // @ts-ignore the types are out of date on this one, there is a flush function
    await this.index.FLUSH();

    return {
      updatedAt: new Date().toISOString(),
      taskID: "algolite-task-id",
    };
  }

  async close(): Promise<void> {
    await new Promise((resolve) => this.store.close(resolve));
    delete Database.databases[this.indexPath];
  }

  async purge(): Promise<void> {
    await this.close();
    this.removeFiles();
  }

  private removeFiles() {
    let files: fs.Dirent[];
    files = fs.readdirSync(this.indexPath, { withFileTypes: true });
    files = files.filter((f) => f.isFile());

    for (const file of files) {
      const filePath = path.join(this.indexPath, file.name);

      if (
        file.name.match(/^[0-9]{6}.(ldb|log)$/) ||
        file.name.match(/^CURRENT$/) ||
        file.name.match(/^LOCK$/) ||
        file.name.match(/^LOG(\.old)?$/) ||
        file.name.match(/^MANIFEST-[0-9]{6}$/)
      ) {
        fs.unlinkSync(filePath);
      }
    }

    const remainingFiles = fs.readdirSync(this.indexPath);

    if (remainingFiles.length > 0) {
      console.warn("Could not remove all database files!", {
        remainingFiles,
        indexPath: this.indexPath,
      });
    } else {
      fs.rmdirSync(this.indexPath);
    }
  }
}

export { Database };
