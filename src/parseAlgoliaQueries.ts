import { Token } from "./indexes";

const parser = require("../algoliaDSLParser");

type Leaf = string | number | boolean | null;

interface Node {
  token: any;
  key: any;
  value: Node | Leaf;
  left: Node;
  right: Node;
}

const isNotUndefined = <T>(value: T | undefined): value is T => {
  if (value === undefined) {
    return false;
  }

  return true;
};

const isLeaf = (value: unknown): value is Leaf => {
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

const leafNodeToString = (node: Node): string => {
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

const buildAndToken = (left: Node, right: Node): Token => {
  const expressions = [left, right].map(nodeToToken).filter(isNotUndefined);

  switch (expressions.length) {
    case 0:
      return undefined;
    case 1:
      return expressions[0];
    default:
      return { AND: expressions };
  }
};

const buildOrToken = (left: Node, right: Node): Token => {
  const expressions = [nodeToToken(left), nodeToToken(right)].filter(
    isNotUndefined
  );

  switch (expressions.length) {
    case 0:
      return undefined;
    case 1:
      return expressions[0];
    default:
      return { OR: expressions };
  }
};

const buildNotToken = (nodeOrLeaf: Node | Leaf): Token => {
  if (isLeaf(nodeOrLeaf)) {
    throw new Error("Expected a Node and not a Leaf");
  }

  const token = nodeToToken(nodeOrLeaf);

  if (token === undefined) {
    return undefined;
  }

  // @ts-ignore you have to have a NOT around the EXCLUDE/INCLUDE but the types don't think so
  return { NOT: { EXCLUDE: token, INCLUDE: { FIELD: "_all" } } };
};

const buildMatchToken = (key: string, nodeOrLeaf: Node | Leaf): Token => {
  if (isLeaf(nodeOrLeaf)) {
    throw new Error("Expected a Node and not a Leaf");
  }

  const leaf = leafNodeToString(nodeOrLeaf);

  return { FIELD: key, VALUE: leaf };
};

const buildEqualsToken = (key: string, nodeOrLeaf: Node | Leaf): Token => {
  return buildMatchToken(key, nodeOrLeaf);
};

const buildGtToken = (key: string, nodeOrLeaf: Node | Leaf): Token => {
  if (isLeaf(nodeOrLeaf)) {
    throw new Error("Expected a Node and not a Leaf");
  }

  // GTE will be wrong when the value is a string but string comparisons in this way
  // are weird in the first place and there's no good way in js to get the next lexicographical
  // string.

  if (nodeOrLeaf.token === "NUMBER" && typeof nodeOrLeaf.value === "number") {
    // all we have is GTE and these are whole numbers so we have to increment for this to work

    const leaf = (nodeOrLeaf.value + 1).toString();

    // @ts-ignore LTE is not actually required and value is definitely a number
    return { FIELD: key, VALUE: { GTE: leaf } };
  }

  const leaf = leafNodeToString(nodeOrLeaf);

  // @ts-ignore LTE is not actually required
  return { FIELD: key, VALUE: { GTE: leaf } };
};

const buildGteToken = (key: string, nodeOrLeaf: Node | Leaf): Token => {
  if (isLeaf(nodeOrLeaf)) {
    throw new Error("Expected a Node and not a Leaf");
  }

  // GTE will be wrong when the value is a string but string comparisons in this way
  // are weird in the first place and there's no good way in js to get the previous lexicographical
  // string.

  const leaf = leafNodeToString(nodeOrLeaf);

  // @ts-ignore LTE is not actually required
  return { FIELD: key, VALUE: { GTE: leaf } };
};

const buildLtToken = (key: string, nodeOrLeaf: Node | Leaf): Token => {
  if (isLeaf(nodeOrLeaf)) {
    throw new Error("Expected a Node and not a Leaf");
  }

  // LTE will be wrong when the value is a string but string comparisons in this way
  // are weird in the first place and there's no good way in js to get the previous lexicographical
  // string.

  if (nodeOrLeaf.token === "NUMBER" && typeof nodeOrLeaf.value === "number") {
    // all we have is LTE and these are whole numbers so we have to decrement for this to work

    const leaf = (nodeOrLeaf.value - 1).toString();

    // @ts-ignore GTE is not actually required
    return { FIELD: key, VALUE: { LTE: leaf } };
  }

  const leaf = leafNodeToString(nodeOrLeaf);

  // @ts-ignore GTE is not actually required
  return { FIELD: key, VALUE: { LTE: leaf } };
};

const buildLteToken = (key: string, nodeOrLeaf: Node | Leaf): Token => {
  if (isLeaf(nodeOrLeaf)) {
    throw new Error("Expected a Node and not a Leaf");
  }

  const leaf = leafNodeToString(nodeOrLeaf);

  // @ts-ignore GTE is not actually required
  return { FIELD: key, VALUE: { LTE: leaf } };
};

const buildString = (nodeOrLeaf: Node | Leaf): string => {
  if (typeof nodeOrLeaf === "string") {
    return nodeOrLeaf;
  } else {
    throw new Error("Expected value to be a string, got: " + typeof nodeOrLeaf);
  }
};

const buildNumber = (nodeOrLeaf: Node | Leaf): string => {
  if (typeof nodeOrLeaf === "number") {
    return nodeOrLeaf.toString();
  } else {
    throw new Error("Expected value to be a number, got: " + typeof nodeOrLeaf);
  }
};

const buildBoolean = (nodeOrLeaf: Node | Leaf): string => {
  if (typeof nodeOrLeaf === "boolean") {
    return nodeOrLeaf.toString();
  } else {
    throw new Error(
      "Expected value to be a boolean, got: " + typeof nodeOrLeaf
    );
  }
};

const buildNull = (nodeOrLeaf: Node | Leaf): string => {
  if (nodeOrLeaf === null) {
    return "null";
  } else {
    throw new Error("Expected value to be null, got: " + typeof nodeOrLeaf);
  }
};

const nodeToToken = (node: Node): Token => {
  const { token, key, value, left, right } = node;

  switch (token) {
    case "AND":
      return buildAndToken(left, right);
    case "OR":
      return buildOrToken(left, right);
    case "NOT":
      return buildNotToken(value);
    case "MATCH":
      return buildMatchToken(key, value);
    case "EQUALS":
      return buildEqualsToken(key, value);
    case "GT":
      return buildGtToken(key, value);
    case "GTE":
      return buildGteToken(key, value);
    case "LT":
      return buildLtToken(key, value);
    case "LTE":
      return buildLteToken(key, value);
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

  return nodeToToken(ast);
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
