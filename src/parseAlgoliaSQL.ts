import { Token } from "./indexes";

const parser = require("../algoliaDSLParser");

interface RuleT {
  token: any;
  key: any;
  value: any;
  left: RuleT;
  right: RuleT;
}

const isNotUndefined = <T>(value: T | undefined): value is T => {
  if (value === undefined) {
    return false;
  }

  return true;
};

const buildSearchExpression = (rule: RuleT): Token => {
  const { token, key, value, left, right } = rule;

  if (token === "MATCH") {
    return `${key}:${value.value}`;
  } else if (token === "OR") {
    const expressions = [
      buildSearchExpression(left),
      buildSearchExpression(right),
    ].filter(isNotUndefined);

    if (expressions.length === 0) {
      return undefined;
    }

    return { OR: expressions };
  } else if (token === "AND") {
    const expressions = [
      buildSearchExpression(left),
      buildSearchExpression(right),
    ].filter(isNotUndefined);

    if (expressions.length === 0) {
      return undefined;
    }

    return { AND: expressions };
  }

  return undefined;
};

export default (sql: string | string[]): Token => {
  const ast = parser.parse(sql);

  return buildSearchExpression(ast);
};
