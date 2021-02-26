"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var search_index_1 = __importDefault(require("search-index"));
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var level_1 = __importDefault(require("level"));
var indexes = {};
module.exports.getIndex = function (indexName, storePath) {
    var index = indexes[indexName];
    var basePath = path_1.default.join(storePath, ".algolite");
    if (!fs_1.default.existsSync(basePath)) {
        fs_1.default.mkdirSync(basePath);
    }
    if (!index) {
        indexes[indexName] = search_index_1.default({
            store: level_1.default(path_1.default.join(basePath, indexName), { valueEncoding: "json" }),
        });
    }
    return indexes[indexName];
};
module.exports.existIndex = function (indexName, storePath) {
    var basePath = path_1.default.join(storePath, ".algolite", indexName);
    return fs_1.default.existsSync(basePath);
};
