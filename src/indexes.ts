import si from "search-index";
import path from "path";
import fs from "fs";
import leveldown from 'leveldown';
import levelup from "levelup";

type SearchIndexT = ReturnType<typeof si>;

const indexes: { [indexName: string]: SearchIndexT } = {};

export const getIndex = (
  indexName: string,
  storePath: string
): ReturnType<typeof si> => {
  const index = indexes[indexName];
  const basePath = path.join(storePath, ".algolite");

  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath);
  }

  if (!index) {
    const indexPath = path.join(basePath, indexName);
    // const ldown = leveldown(indexPath);
    // const lup = levelup(ldown, { valueEncoding: "json" });

    indexes[indexName] = si({ db: indexPath });
  }

  return indexes[indexName];
};

export const existIndex = (indexName: string, storePath: string): boolean => {
  const basePath = path.join(storePath, ".algolite", indexName);

  return fs.existsSync(basePath);
};
