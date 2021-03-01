import { Token } from "./indexes";

const parser = require("../algoliaDSLParser");

type Value = string | number | boolean | null;

interface RuleT {
  token: any;
  key: any;
  value: RuleT | Value;
  left: RuleT;
  right: RuleT;
}

const isNotUndefined = <T>(value: T | undefined): value is T => {
  if (value === undefined) {
    return false;
  }

  return true;
};

const isValue = (value: unknown): value is Value => {
  const type = typeof value;

  if (
    value === null ||
    type === "string" ||
    type === "number" ||
    type === "boolean"
  ) {
    return true;
  }

  return false;
};

const buildMatch = (key: string, value: RuleT | Value): Token => {
  if (!isValue(value)) {
    throw new Error("Expected right side of match to be a simple value");
  }

  if (value === null) {
    return undefined;
  } else if (typeof value !== "string") {
    value = value.toString();
  }
  return { FIELD: key, VALUE: value };
};

const buildOr = (left: RuleT, right: RuleT): Token => {
  const expressions = [
    buildSearchExpression(left),
    buildSearchExpression(right),
  ].filter(isNotUndefined);

  switch (expressions.length) {
    case 0:
      return undefined;
    case 1:
      return expressions[0];
    default:
      return { OR: expressions };
  }
};

const buildAnd = (left: RuleT, right: RuleT): Token => {
  const expressions = [left, right]
    .map(buildSearchExpression)
    .filter(isNotUndefined);

  switch (expressions.length) {
    case 0:
      return undefined;
    case 1:
      return expressions[0];
    default:
      return { AND: expressions };
  }
};

const buildNot = (value: any): Token => {
  const expression = buildSearchExpression(value);

  if (expression === undefined) {
    return undefined;
  }

  // @ts-ignore you have to have a NOT around the EXCLUDE/INCLUDE but the types don't think so
  return { NOT: { EXCLUDE: expression, INCLUDE: { FIELD: "_all" } } };
};

const buildEquals = (key: string, value: RuleT | Value): Token => {
  return buildMatch(key, value);
};
const buildGt = (key: string, value: RuleT | Value): Token => {
  if (!isValue(value)) {
    throw new Error("Expected right side of > to be a simple value");
  }

  if (value === null) {
    return undefined;
  }

  if (typeof value === "boolean") {
    // this feels a bit nonsensical but the API supports it...
    value = value.toString();
  } else if (typeof value === "number") {
    // all we have is GTE and these are whole numbers so we have to increment for this to work
    value = value + 1;
  }

  // GTE will be wrong when the value is a string but string comparisons in this way
  // are weird in the first place and there's no good way in js to get the next lexicographical
  // string.

  // @ts-ignore LTE is not actually required
  return { FIELD: key, VALUE: { GTE: value } };
};

const buildGte = (key: string, value: RuleT | Value): Token => {
  if (!isValue(value)) {
    throw new Error("Expected right side of >= to be a simple value");
  }

  if (value === null) {
    return undefined;
  }

  if (typeof value === "boolean") {
    // this feels a bit nonsensical but the API supports it...
    value = value.toString();
  }

  // @ts-ignore LTE is not actually required
  return { FIELD: key, VALUE: { GTE: value } };
};
const buildSearchExpression = (rule: RuleT): Token => {
  const { token, key, value, left, right } = rule;

  switch (token) {
    case "MATCH":
      return buildMatch(key, value);
    case "OR":
      return buildOr(left, right);
    case "AND":
      return buildAnd(left, right);
    case "NOT":
      return buildNot(value);
    case "EQUALS":
      return buildEquals(key, value);
    case "GT":
      return buildGt(key, value);
    case "GTE":
      return buildGte(key, value);
    default:
      return undefined;
  }
};

export default (sql: string | string[]): Token => {
  const ast = parser.parse(sql);

  return buildSearchExpression(ast);
};
