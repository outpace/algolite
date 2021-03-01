import si from "search-index";
import path from "path";
import fs from "fs";

type SearchIndexT = ReturnType<typeof si>;
type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
export type Token = Parameters<ThenArg<SearchIndexT>["MIN"]>[0];

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
    indexes[indexName] = si({ db: indexPath });
  }

  return indexes[indexName];
};

export const existIndex = (indexName: string, storePath: string): boolean => {
  const basePath = path.join(storePath, ".algolite", indexName);

  return fs.existsSync(basePath);
};
