"use strict";
var parser = require("../algoliaDSLParser");
var buildSearchExpression = function (rule, db) {
    var OR = db.OR, AND = db.AND;
    var token = rule.token, key = rule.key, value = rule.value, left = rule.left, right = rule.right;
    if (token === "MATCH") {
        return key + ":" + value.value;
    }
    else if (token === "OR") {
        var leftExpression = buildSearchExpression(left, db);
        var rightExpression = buildSearchExpression(right, db);
        return OR(leftExpression, rightExpression);
    }
    else if (token === "AND") {
        var leftExpression = buildSearchExpression(left, db);
        var rightExpression = buildSearchExpression(right, db);
        return AND(leftExpression, rightExpression);
    }
};
module.exports = function (db, sql) {
    var ast = parser.parse(sql);
    return buildSearchExpression(ast, db);
};
