import express from "express";
import querystring from "querystring";
import { v4 } from "uuid";

import {
  parseSearch,
  parseAlgoliaSQL,
  parseFilters,
} from "./src/parseAlgoliaSQL";
import { getIndex, existIndex, Token } from "./src/indexes";

const createServer = (options: { path?: string }) => {
  const path = options.path || process.cwd();
  const app = express();

  app.use(express.json());

  app.post("/1/indexes/:indexName/query", async (request, response) => {
    const {
      body,
      params: { indexName },
    } = request;
    const { params: queryParams } = body;

    const db = await getIndex(indexName, path);

    const { query, filters } = querystring.parse(queryParams);

    const search = parseSearch({ query, filters });

    const { RESULT: result } = await db.QUERY(search, { DOCUMENTS: true });

    // this is going to be return an array of AlgoliaHitType
    const hits = [...result].map((obj) => {
      // @ts-ignore we really do want it under objectID for algolia purposes
      obj.objectID = obj._id;
      // @ts-ignore and indeed we really do want this key gone
      delete obj._id;
      return obj;
    });

    return response.json({
      hits,
      params: queryParams || "",
      query: query || "",
    });
  });

  app.post("/1/indexes/:indexName", async (req, res) => {
    const {
      body,
      params: { indexName },
    } = req;
    const _id = v4();

    const db = await getIndex(indexName, path);
    await db.PUT([
      {
        _id,
        _all: "all",
        ...body,
      },
    ]);

    return res.status(201).json({
      createdAt: new Date().toISOString(),
      taskID: "algolite-task-id",
      objectID: _id,
    });
  });

  app.put("/1/indexes/:indexName/:objectID", async (req, res) => {
    const {
      body,
      params: { indexName },
    } = req;
    const { objectID } = req.params;

    const db = await getIndex(indexName, path);
    try {
      await db.DELETE([objectID]);
    } catch (error) {
      if (!error.notFound) {
        return res.status(500).end();
      }
    }

    await db.PUT([
      {
        _id: objectID,
        _all: "all",
        ...body,
      },
      { storeVectors: true },
    ]);

    return res.status(201).json({
      updatedAt: new Date().toISOString(),
      taskID: "algolite-task-id",
      objectID,
    });
  });

  app.delete("/1/indexes/:indexName/:objectID", async (req, res) => {
    const { objectID, indexName } = req.params;

    const db = await getIndex(indexName, path);
    try {
      await db.DELETE([objectID]);
    } catch (error) {
      if (!error.notFound) {
        res.status(500).end();
      }
    }

    return res.status(200).json({
      deletedAt: new Date().toISOString(),
      taskID: "algolite-task-id",
      objectID,
    });
  });

  app.post("/1/indexes/:indexName/deleteByQuery", async (req, res) => {
    const {
      body,
      params: { indexName },
    } = req;
    const { params: queryParams } = body;

    const { facetFilters } = querystring.parse(queryParams);

    const db = await getIndex(indexName, path);

    const search = parseFilters(facetFilters);

    if (search === undefined) {
      return res.status(400).json({
        message:
          "DeleteByQuery endpoint only supports tagFilters, facetFilters, numericFilters and geoQuery condition",
        status: 400,
      });
    }

    const { RESULT: result } = await db.QUERY(search);

    const ids = [...result].map((obj): string => obj._id);
    await db.INDEX.DELETE(ids);

    return res.status(201).json({
      updatedAt: new Date().toISOString(),
      taskID: "algolite-task-id",
    });
  });

  app.post("/1/indexes/:indexName/clear", async (req, res) => {
    const { indexName } = req.params;

    if (!existIndex(indexName, path)) {
      return res.status(400).end();
    }

    const db = await getIndex(indexName, path);

    // get the index, then delete everything in it
    const result = await db.INDEX.GET("");
    const ids = [...result].map((obj) => obj._id);
    await db.INDEX.DELETE(ids);

    return res.status(200).json({
      taskID: "algolite-task-id",
    });
  });

  return app;
};

module.exports = createServer;
