const parser = require("../algoliaDSLParser");

interface RuleT {
  token: any;
  key: any;
  value: any;
  left: RuleT;
  right: RuleT;
}

type DbT = {
  OR: any;
  AND: any;
};

const buildSearchExpression = (rule: RuleT, db: DbT) => {
  const { OR, AND } = db;
  const { token, key, value, left, right } = rule;

  if (token === "MATCH") {
    return `${key}:${value.value}`;
  } else if (token === "OR") {
    const leftExpression = buildSearchExpression(left, db);
    const rightExpression = buildSearchExpression(right, db);

    return OR(leftExpression, rightExpression);
  } else if (token === "AND") {
    const leftExpression = buildSearchExpression(left, db);
    const rightExpression = buildSearchExpression(right, db);

    return AND(leftExpression, rightExpression);
  }
};

export default (db, sql: string | string[]) => {
  const ast = parser.parse(sql);

  return buildSearchExpression(ast, db);
};
