"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var express = require("express");
var querystring = require("querystring");
var parseAlgoliaSQL = require("./src/parseAlgoliaSQL");
var _a = require("./src/indexes"), getIndex = _a.getIndex, existIndex = _a.existIndex;
var v4 = require("uuid").v4;
var createServer = function (options) {
    var path = options.path || process.cwd();
    var app = express();
    app.use(express.json());
    app.post("/1/indexes/:indexName/query", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var body, indexName, queryParams, db, _a, query, filters, searchExp, result, hits;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    body = req.body, indexName = req.params.indexName;
                    queryParams = body.params;
                    db = getIndex(indexName, path);
                    _a = querystring.parse(queryParams), query = _a.query, filters = _a.filters;
                    searchExp = [];
                    if (query !== undefined) {
                        searchExp.push(!query ? "*" : query);
                    }
                    if (filters) {
                        searchExp.push(parseAlgoliaSQL(db, filters));
                    }
                    return [4 /*yield*/, db.SEARCH.apply(db, searchExp)];
                case 1:
                    result = _b.sent();
                    hits = result.map(function (item) {
                        var obj = item.obj;
                        obj.objectID = obj._id;
                        delete obj._id;
                        return obj;
                    });
                    return [2 /*return*/, res.json({
                            hits: hits,
                            params: queryParams || "",
                            query: query || "",
                        })];
            }
        });
    }); });
    app.post("/1/indexes/:indexName", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var body, indexName, _id, db;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = req.body, indexName = req.params.indexName;
                    _id = v4();
                    db = getIndex(indexName, path);
                    return [4 /*yield*/, db.PUT([
                            __assign({ _id: _id }, body),
                        ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/, res.status(201).json({
                            createdAt: new Date().toISOString(),
                            taskID: "algolite-task-id",
                            objectID: _id,
                        })];
            }
        });
    }); });
    app.put("/1/indexes/:indexName/:objectID", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var body, indexName, objectID, db, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = req.body, indexName = req.params.indexName;
                    objectID = req.params.objectID;
                    db = getIndex(indexName, path);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, db.DELETE([objectID])];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    if (!error_1.notFound) {
                        return [2 /*return*/, res.status(500).end()];
                    }
                    return [3 /*break*/, 4];
                case 4: return [4 /*yield*/, db.PUT([
                        __assign({ _id: objectID }, body),
                    ])];
                case 5:
                    _a.sent();
                    return [2 /*return*/, res.status(201).json({
                            updatedAt: new Date().toISOString(),
                            taskID: "algolite-task-id",
                            objectID: objectID,
                        })];
            }
        });
    }); });
    app.delete("/1/indexes/:indexName/:objectID", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, objectID, indexName, db, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.params, objectID = _a.objectID, indexName = _a.indexName;
                    db = getIndex(indexName, path);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, db.DELETE([objectID])];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _b.sent();
                    if (!error_2.notFound) {
                        res.status(500).end();
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, res.status(200).json({
                        deletedAt: new Date().toISOString(),
                        taskID: "algolite-task-id",
                        objectID: objectID,
                    })];
            }
        });
    }); });
    app.post("/1/indexes/:indexName/deleteByQuery", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var body, indexName, queryParams, facetFilters, db, searchExp, result, ids;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = req.body, indexName = req.params.indexName;
                    queryParams = body.params;
                    facetFilters = querystring.parse(queryParams).facetFilters;
                    db = getIndex(indexName, path);
                    searchExp = [];
                    if (facetFilters) {
                        searchExp.push(parseAlgoliaSQL(db, facetFilters));
                    }
                    if (searchExp.length === 0) {
                        return [2 /*return*/, res.status(400).json({
                                message: "DeleteByQuery endpoint only supports tagFilters, facetFilters, numericFilters and geoQuery condition",
                                status: 400,
                            })];
                    }
                    return [4 /*yield*/, db.SEARCH.apply(db, searchExp)];
                case 1:
                    result = _a.sent();
                    ids = result.map(function (obj) { return obj._id; });
                    return [4 /*yield*/, db.INDEX.DELETE(ids)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, res.status(201).json({
                            updatedAt: new Date().toISOString(),
                            taskID: "algolite-task-id",
                        })];
            }
        });
    }); });
    app.post("/1/indexes/:indexName/clear", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var indexName, db, result, ids;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    indexName = req.params.indexName;
                    if (!existIndex(indexName, path)) {
                        return [2 /*return*/, res.status(400).end()];
                    }
                    db = getIndex(indexName, path);
                    return [4 /*yield*/, db.INDEX.GET("")];
                case 1:
                    result = _a.sent();
                    ids = result.map(function (obj) { return obj._id; });
                    return [4 /*yield*/, db.INDEX.DELETE(ids)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, res.status(200).json({
                            taskID: "algolite-task-id",
                        })];
            }
        });
    }); });
    return app;
};
module.exports = createServer;
