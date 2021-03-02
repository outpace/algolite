import querystring from "querystring";

import express from "express";

import { Database } from "./src/database";

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
    const { query, filters } = querystring.parse(queryParams);

    const db = await Database.get(indexName, path);
    const result = await db.searchObjects({ query, filters });

    return response.json(result);
  });

  app.post("/1/indexes/:indexName", async (req, res) => {
    const {
      body,
      params: { indexName },
    } = req;

    const db = await Database.get(indexName, path);
    const result = await db.saveObject(body);
    return res.status(201).json(result);
  });

  app.put("/1/indexes/:indexName/:objectID", async (req, res) => {
    const {
      body,
      params: { indexName },
    } = req;
    const { objectID } = req.params;

    const db = await Database.get(indexName, path);
    const result = await db.updateObject({ ...body, objectID });

    return res.status(201).json(result);
  });

  app.delete("/1/indexes/:indexName/:objectID", async (req, res) => {
    const { objectID, indexName } = req.params;

    const db = await Database.get(indexName, path);
    const result = await db.deleteObject(objectID);

    return res.status(200).json(result);
  });

  app.post("/1/indexes/:indexName/deleteByQuery", async (req, res) => {
    const {
      body,
      params: { indexName },
    } = req;
    const { params: queryParams } = body;

    const { facetFilters } = querystring.parse(queryParams);

    const db = await Database.get(indexName, path);
    const result = await db.deleteObjectsByQuery(facetFilters);

    return res.status(201).json(result);
  });

  app.post("/1/indexes/:indexName/clear", async (req, res) => {
    const { indexName } = req.params;

    const db = await Database.get(indexName, path);
    const result = await db.clear();

    return res.status(200).json(result);
  });

  return app;
};

module.exports = createServer;
