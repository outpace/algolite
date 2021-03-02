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

type SaveableObject = { [attribyte: string]: any };

class Database {
  static databases: { [indexPath: string]: Database } = {};

  indexName: string;
  storePath: string;
  indexPath: string;
  index: SearchIndex;

  private constructor(
    indexName: string,
    storePath: string,
    indexPath: string,
    index: SearchIndex
  ) {
    this.indexName = indexName;
    this.storePath = storePath;
    this.indexPath = indexPath;
    this.index = index;
  }

  static async get(indexName: string, storePath: string): Promise<Database> {
    const basePath = path.join(storePath);
    const indexPath = path.join(basePath, indexName);

    if (!fs.existsSync(basePath)) {
      fs.mkdirSync(basePath);
    }

    let database = this.databases[indexPath];

    if (!database) {
      // @ts-ignore this is simply wrong
      const index = await si({ db: leveldown(indexPath) });
      database = new Database(indexName, storePath, indexPath, index);
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
    idsOnly?: boolean;
  }): Promise<{
    hits: Hit[];
    query: string | string[] | undefined;
    parsed_query: Token;
    params: string | string[] | undefined;
  }> {
    const { query, filters, idsOnly } = criteria;

    const search = parseSearch({ query, filters });

    const { RESULT: result } = await this.index.QUERY(search, {
      DOCUMENTS: !idsOnly,
    });

    // this is going to be return an array of AlgoliaHitType
    const hits: Hit[] = [];
    for (const obj of result) {
      let hit: Hit;

      if ("_doc" in obj) {
        hit = { ...obj._doc[0], objectID: obj._id };
      } else {
        hit = { objectID: obj._id };
      }

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
    const objectID = rawObject["objectID"] || v4();
    const object: SaveableObject = {
      ...rawObject,
      _all: "all",
      objectID: objectID,
      _id: objectID,
    };

    await this.index.PUT([object], {
      storeVectors: true,
      storeRawDocs: true,
      doNotIndexField: [],
    });

    return {
      createdAt: new Date().toISOString(),
      taskID: "algolite-task-id",
      objectID: objectID,
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
      idsOnly: true,
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
}

export { Database };
