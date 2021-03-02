import { Token } from "./indexes";

const parser = require("../algoliaDSLParser");

type Value = string | number | boolean | null;

interface Node {
  token: any;
  key: any;
  value: Node | Value;
  left: Node;
  right: Node;
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

const valueNodeToString = (node: Node): string => {
  const value = node.value;

  switch (typeof value) {
    case "string":
      return value;
    case "boolean":
    case "number":
      return value.toString();
    default:
      if (value === null) {
        return "null";
      } else {
        throw new Error("Unexpected node value type: " + typeof value);
      }
  }
};

const buildAnd = (left: Node, right: Node): Token => {
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

const buildOr = (left: Node, right: Node): Token => {
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

const buildMatch = (key: string, value: Node | Value): Token => {
  if (isValue(value)) {
    throw new Error("Expected a Node and not a Value");
  }

  const valueAsString = valueNodeToString(value);

  return { FIELD: key, VALUE: valueAsString };
};

const buildEquals = (key: string, value: Node | Value): Token => {
  return buildMatch(key, value);
};

const buildGt = (key: string, nodeOrValue: Node | Value): Token => {
  if (isValue(nodeOrValue)) {
    throw new Error("Expected a Node and not a Value");
  }

  // GTE will be wrong when the value is a string but string comparisons in this way
  // are weird in the first place and there's no good way in js to get the next lexicographical
  // string.

  if (nodeOrValue.token === "NUMBER" && typeof nodeOrValue.value === "number") {
    // all we have is GTE and these are whole numbers so we have to increment for this to work

    const value = (nodeOrValue.value + 1).toString();

    // @ts-ignore LTE is not actually required and value is definitely a number
    return { FIELD: key, VALUE: { GTE: value } };
  }

  const valueAsString = valueNodeToString(nodeOrValue);

  // @ts-ignore LTE is not actually required
  return { FIELD: key, VALUE: { GTE: valueAsString } };
};

const buildGte = (key: string, nodeOrValue: Node | Value): Token => {
  if (isValue(nodeOrValue)) {
    throw new Error("Expected a Node and not a Value");
  }

  // GTE will be wrong when the value is a string but string comparisons in this way
  // are weird in the first place and there's no good way in js to get the previous lexicographical
  // string.

  const valueAsString = valueNodeToString(nodeOrValue);

  // @ts-ignore LTE is not actually required
  return { FIELD: key, VALUE: { GTE: valueAsString } };
};

const buildLt = (key: string, nodeOrValue: Node | Value): Token => {
  if (isValue(nodeOrValue)) {
    throw new Error("Expected a Node and not a Value");
  }

  // LTE will be wrong when the value is a string but string comparisons in this way
  // are weird in the first place and there's no good way in js to get the previous lexicographical
  // string.

  if (nodeOrValue.token === "NUMBER" && typeof nodeOrValue.value === "number") {
    // all we have is LTE and these are whole numbers so we have to decrement for this to work

    const value = (nodeOrValue.value - 1).toString();

    // @ts-ignore GTE is not actually required
    return { FIELD: key, VALUE: { LTE: value } };
  }

  const value = valueNodeToString(nodeOrValue);

  // @ts-ignore GTE is not actually required
  return { FIELD: key, VALUE: { LTE: value } };
};

const buildLte = (key: string, nodeOrValue: Node | Value): Token => {
  if (isValue(nodeOrValue)) {
    throw new Error("Expected a Node and not a Value");
  }

  const value = valueNodeToString(nodeOrValue);

  // @ts-ignore GTE is not actually required
  return { FIELD: key, VALUE: { LTE: value } };
};

const buildString = (nodeOrValue: Node | Value): string => {
  if (typeof nodeOrValue === "string") {
    return nodeOrValue;
  } else {
    throw new Error("Expected value to be a string");
  }
};

const buildNumber = (nodeOrValue: Node | Value): string => {
  if (typeof nodeOrValue === "number") {
    return nodeOrValue.toString();
  } else {
    throw new Error("Expected value to be a number");
  }
};

const buildBoolean = (nodeOrValue: Node | Value): string => {
  if (typeof nodeOrValue === "boolean") {
    return nodeOrValue.toString();
  } else {
    throw new Error("Expected value to be a boolean");
  }
};

const buildNull = (nodeOrValue: Node | Value): string => {
  if (nodeOrValue === null) {
    return "null";
  } else {
    throw new Error("Expected value to be null");
  }
};

const buildSearchExpression = (node: Node): Token => {
  const { token, key, value, left, right } = node;

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
