import { Token } from './indexes';

const parser = require("../algoliaDSLParser");

interface RuleT {
  token: any;
  key: any;
  value: any;
  left: RuleT;
  right: RuleT;
}

type SearchExpressionT = string | { OR: [SearchExpressionT, SearchExpressionT] } | { AND: [SearchExpressionT, SearchExpressionT] };

const buildSearchExpression = (rule: RuleT): Token => {
  const { token, key, value, left, right } = rule;

  if (token === "MATCH") {
    return `${key}:${value.value}`;
  } else if (token === "OR") {
    const leftExpression = buildSearchExpression(left);
    const rightExpression = buildSearchExpression(right);

    return { OR: [leftExpression, rightExpression]};
  } else if (token === "AND") {
    const leftExpression = buildSearchExpression(left);
    const rightExpression = buildSearchExpression(right);

    return { AND: [leftExpression, rightExpression]};
  }

  return '';
};

export default (sql: string | string[]) => {
  const ast = parser.parse(sql);

  return buildSearchExpression(ast);
};
