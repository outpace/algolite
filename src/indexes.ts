import si from "search-index";
import path from "path";
import fs from "fs";
import level from "level";

type SearchIndexT = ReturnType<typeof si>;

const indexes: {[indexName: string]: SearchIndexT } = {};

module.exports.getIndex = (indexName: string, storePath: string): ReturnType<typeof si> => {
  const index = indexes[indexName];
  const basePath = path.join(storePath, ".algolite");
  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath);
  }

  if (!index) {
    indexes[indexName] = si({
      store: level(path.join(basePath, indexName), { valueEncoding: "json" }),
    });
  }

  return indexes[indexName];
};

module.exports.existIndex = (indexName: string, storePath: string): boolean => {
  const basePath = path.join(storePath, ".algolite", indexName);

  return fs.existsSync(basePath);
};
