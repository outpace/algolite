import { Token } from "./indexes";

const parser = require("../algoliaDSLParser");

type Value = string | number | boolean | null;

interface RuleT {
  token: any;
  key: any;
  value: RuleT;
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

const buildNot = (value: any): Token => {
  const expression = buildSearchExpression(value);

  if (expression === undefined) {
    return undefined;
  }

  // @ts-ignore you have to have a NOT around the EXCLUDE/INCLUDE but the types don't think so
  return { NOT: { EXCLUDE: expression, INCLUDE: { FIELD: "_all" } } };
};

const buildMatch = (key: string, value: RuleT): Token => {
  const expression = buildSearchExpression(value);

  if (!isValue(expression)) {
    throw new Error(
      `Expected right side of match to be a simple value, got: ${typeof expression}`
    );
  }

  return { FIELD: key, VALUE: expression };
};

const buildEquals = (key: string, value: RuleT): Token => {
  return buildMatch(key, value);
};

const buildGt = (key: string, value: RuleT): Token => {
  if (value === null || value.value === null) {
    return undefined;
  }

  // GTE will be wrong when the value is a string but string comparisons in this way
  // are weird in the first place and there's no good way in js to get the next lexicographical
  // string.

  if (typeof value.value === "number") {
    // all we have is GTE and these are whole numbers so we have to increment for this to work

    // @ts-ignore LTE is not actually required
    return { FIELD: key, VALUE: { GTE: value.value + 1 } };
  }

  const expression = buildSearchExpression(value);

  if (!isValue(expression)) {
    throw new Error("Expected right side of > to be a simple value");
  }

  // @ts-ignore LTE is not actually required
  return { FIELD: key, VALUE: { GTE: expression } };
};

const buildGte = (key: string, value: RuleT): Token => {
  if (value === null || value.value === null) {
    return undefined;
  }

  // GTE will be wrong when the value is a string but string comparisons in this way
  // are weird in the first place and there's no good way in js to get the previous lexicographical
  // string.

  const expression = buildSearchExpression(value);

  if (!isValue(expression)) {
    throw new Error("Expected right side of >= to be a simple value");
  }

  // @ts-ignore LTE is not actually required
  return { FIELD: key, VALUE: { GTE: expression } };
};

const buildLt = (key: string, value: RuleT): Token => {
  if (value === null || value.value === null) {
    return undefined;
  }

  const expression = buildSearchExpression(value);

  if (!isValue(expression)) {
    throw new Error("Expected right side of < to be a simple value");
  }

  // LTE will be wrong when the value is a string but string comparisons in this way
  // are weird in the first place and there's no good way in js to get the previous lexicographical
  // string.

  if (typeof value.value === "number") {
    // all we have is LTE and these are whole numbers so we have to decrement for this to work

    // @ts-ignore GTE is not actually required
    return { FIELD: key, VALUE: { LTE: value.value - 1 } };
  }

  // @ts-ignore GTE is not actually required
  return { FIELD: key, VALUE: { LTE: expression } };
};

const buildLte = (key: string, value: RuleT): Token => {
  if (value === null) {
    return undefined;
  }

  const expression = buildSearchExpression(value);

  if (!isValue(expression)) {
    throw new Error("Expected right side of <= to be a simple value");
  }

  // @ts-ignore GTE is not actually required
  return { FIELD: key, VALUE: { LTE: expression } };
};

const buildString = (value: RuleT | Value): string => {
  if (typeof value !== "string") {
    throw new Error("Expected value to be a string");
  }

  return value;
};

const buildNumber = (value: RuleT | Value): string => {
  if (typeof value !== "number") {
    throw new Error("Expected value to be a number");
  }

  return value.toString();
};

const buildBoolean = (value: RuleT | Value): string => {
  if (typeof value !== "boolean") {
    throw new Error("Expected value to be a boolean");
  }

  return value.toString();
};

const buildNull = (value: RuleT | Value): string => {
  if (value !== null) {
    throw new Error("Expected value to be null");
  }

  return "null";
};

const buildSearchExpression = (rule: RuleT): Token => {
  const { token, key, value, left, right } = rule;

  switch (token) {
    case "AND":
      return buildAnd(left, right);
    case "OR":
      return buildOr(left, right);
    case "NOT":
      return buildNot(value);
    case "MATCH":
      return buildMatch(key, value);
    case "EQUALS":
      return buildEquals(key, value);
    case "GT":
      return buildGt(key, value);
    case "GTE":
      return buildGte(key, value);
    case "LT":
      return buildLt(key, value);
    case "LTE":
      return buildLte(key, value);
    case "STRING":
      return buildString(value);
    case "NUMBER":
      return buildNumber(value);
    case "BOOLEAN":
      return buildBoolean(value);
    case "NULL":
      return buildNull(value);
    default:
      return undefined;
  }
};

const parseAlgoliaSQL = (sql: string | string[]): Token => {
  const ast = parser.parse(sql);

  return buildSearchExpression(ast);
};

const parseFilters = (
  filters: string | string[] | undefined
): Token | undefined => {
  if (filters === undefined) {
    return undefined;
  }

  if (Array.isArray(filters)) {
    filters = filters
      .map((f) => f.trim())
      .filter((f) => f !== "")
      .map((f) => `(${f})`)
      .join(" OR ");
  }

  return parseAlgoliaSQL(filters);
};

const parseQuery = (query: string | string[] | undefined): Token => {
  if (query === undefined) {
    return undefined;
  }

  if (Array.isArray(query)) {
    query = query
      .map((q) => q.trim())
      .filter((q) => q !== "")
      .join(" ");
  }

  return query ? query : { FIELD: "_all" };
};

const parseSearch = (search: {
  query?: string | string[] | undefined;
  filters?: string | string[] | undefined;
}): Token => {
  const { query, filters } = search;

  let searches: NonNullable<Token>[] = [];

  const parsedQuery = parseQuery(query);

  if (parsedQuery !== undefined) {
    searches.push(parsedQuery);
  }

  const parsedFilters = parseFilters(filters);

  if (parsedFilters !== undefined) {
    searches.push(parsedFilters);
  }

  let parsedSearch: Token;

  switch (searches.length) {
    case 0:
      parsedSearch = { FIELD: "_all" };
      break;
    case 1:
      parsedSearch = searches[0];
      break;
    case 2:
      parsedSearch = { AND: searches };
      break;
  }

  return parsedSearch;
};

export { parseAlgoliaSQL, parseQuery, parseFilters, parseSearch };
