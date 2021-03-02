/*
 * Generated by PEG.js 0.10.0.
 *
 * http://pegjs.org/
 */

"use strict";

function peg$subclass(child, parent) {
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor();
}

function peg$SyntaxError(message, expected, found, location) {
  this.message  = message;
  this.expected = expected;
  this.found    = found;
  this.location = location;
  this.name     = "SyntaxError";

  if (typeof Error.captureStackTrace === "function") {
    Error.captureStackTrace(this, peg$SyntaxError);
  }
}

peg$subclass(peg$SyntaxError, Error);

peg$SyntaxError.buildMessage = function(expected, found) {
  var DESCRIBE_EXPECTATION_FNS = {
        literal: function(expectation) {
          return "\"" + literalEscape(expectation.text) + "\"";
        },

        "class": function(expectation) {
          var escapedParts = "",
              i;

          for (i = 0; i < expectation.parts.length; i++) {
            escapedParts += expectation.parts[i] instanceof Array
              ? classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1])
              : classEscape(expectation.parts[i]);
          }

          return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
        },

        any: function(expectation) {
          return "any character";
        },

        end: function(expectation) {
          return "end of input";
        },

        other: function(expectation) {
          return expectation.description;
        }
      };

  function hex(ch) {
    return ch.charCodeAt(0).toString(16).toUpperCase();
  }

  function literalEscape(s) {
    return s
      .replace(/\\/g, '\\\\')
      .replace(/"/g,  '\\"')
      .replace(/\0/g, '\\0')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
      .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
  }

  function classEscape(s) {
    return s
      .replace(/\\/g, '\\\\')
      .replace(/\]/g, '\\]')
      .replace(/\^/g, '\\^')
      .replace(/-/g,  '\\-')
      .replace(/\0/g, '\\0')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
      .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
  }

  function describeExpectation(expectation) {
    return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
  }

  function describeExpected(expected) {
    var descriptions = new Array(expected.length),
        i, j;

    for (i = 0; i < expected.length; i++) {
      descriptions[i] = describeExpectation(expected[i]);
    }

    descriptions.sort();

    if (descriptions.length > 0) {
      for (i = 1, j = 1; i < descriptions.length; i++) {
        if (descriptions[i - 1] !== descriptions[i]) {
          descriptions[j] = descriptions[i];
          j++;
        }
      }
      descriptions.length = j;
    }

    switch (descriptions.length) {
      case 1:
        return descriptions[0];

      case 2:
        return descriptions[0] + " or " + descriptions[1];

      default:
        return descriptions.slice(0, -1).join(", ")
          + ", or "
          + descriptions[descriptions.length - 1];
    }
  }

  function describeFound(found) {
    return found ? "\"" + literalEscape(found) + "\"" : "end of input";
  }

  return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
};

function peg$parse(input, options) {
  options = options !== void 0 ? options : {};

  var peg$FAILED = {},

      peg$startRuleFunctions = { start: peg$parsestart },
      peg$startRuleFunction  = peg$parsestart,

      peg$c0 = function(b) { return b; },
      peg$c1 = "(",
      peg$c2 = peg$literalExpectation("(", false),
      peg$c3 = ")",
      peg$c4 = peg$literalExpectation(")", false),
      peg$c5 = function(statement) { return statement },
      peg$c6 = "AND",
      peg$c7 = peg$literalExpectation("AND", false),
      peg$c8 = function(head, tail) {
          return {
            token: 'AND',
            left: head,
            right: tail
          }
        },
      peg$c9 = "OR",
      peg$c10 = peg$literalExpectation("OR", false),
      peg$c11 = function(head, tail) {
          return {
            token: 'OR',
            left: head,
            right: tail
          }
        },
      peg$c12 = "NOT",
      peg$c13 = peg$literalExpectation("NOT", false),
      peg$c14 = function(value) {
          return {
            token: 'NOT',
            value: value
          }
        },
      peg$c15 = ":",
      peg$c16 = peg$literalExpectation(":", false),
      peg$c17 = function(key, value) {
          return {
            token: 'MATCH',
            key: key,
            value: value
          }
        },
      peg$c18 = "=",
      peg$c19 = peg$literalExpectation("=", false),
      peg$c20 = function(key, value) {
          return {
            token: 'EQUALS',
            key: key,
            value: value
          }
        },
      peg$c21 = ">",
      peg$c22 = peg$literalExpectation(">", false),
      peg$c23 = function(key, value) {
          return {
            token: 'GT',
            key: key,
            value: value
          }
        },
      peg$c24 = ">=",
      peg$c25 = peg$literalExpectation(">=", false),
      peg$c26 = function(key, value) {
          return {
            token: 'GTE',
            key: key,
            value: value
          }
        },
      peg$c27 = "<",
      peg$c28 = peg$literalExpectation("<", false),
      peg$c29 = function(key, value) {
          return {
            token: 'LT',
            key: key,
            value: value
          }
        },
      peg$c30 = "<=",
      peg$c31 = peg$literalExpectation("<=", false),
      peg$c32 = function(key, value) {
          return {
            token: 'LTE',
            key: key,
            value: value
          }
        },
      peg$c33 = peg$otherExpectation("value"),
      peg$c34 = peg$otherExpectation("string"),
      peg$c35 = "\"",
      peg$c36 = peg$literalExpectation("\"", false),
      peg$c37 = function(word) { return { token: 'STRING', value: word  } },
      peg$c38 = "'",
      peg$c39 = peg$literalExpectation("'", false),
      peg$c40 = peg$otherExpectation("number"),
      peg$c41 = /^[0-9]/,
      peg$c42 = peg$classExpectation([["0", "9"]], false, false),
      peg$c43 = function(value) {
          return { token: 'NUMBER', value: parseInt(value.join('')) }
        },
      peg$c44 = peg$otherExpectation("boolean"),
      peg$c45 = "true",
      peg$c46 = peg$literalExpectation("true", false),
      peg$c47 = "false",
      peg$c48 = peg$literalExpectation("false", false),
      peg$c49 = function(value) {
          return {
            token: 'BOOLEAN',
            value: value
          }
        },
      peg$c50 = peg$otherExpectation("null"),
      peg$c51 = "null",
      peg$c52 = peg$literalExpectation("null", false),
      peg$c53 = function(value) {
          return {
            token: 'NULL',
            value: null
          }
        },
      peg$c54 = peg$otherExpectation("word"),
      peg$c55 = function(w) { return  w.join('') },
      peg$c56 = peg$otherExpectation("special"),
      peg$c57 = /^[^ ()"']/,
      peg$c58 = peg$classExpectation([" ", "(", ")", "\"", "'"], true, false),
      peg$c59 = function(w) { return w.join('') },
      peg$c60 = /^[.a-zA-Z0-9_]/,
      peg$c61 = peg$classExpectation([".", ["a", "z"], ["A", "Z"], ["0", "9"], "_"], false, false),
      peg$c62 = peg$otherExpectation("space"),
      peg$c63 = " ",
      peg$c64 = peg$literalExpectation(" ", false),
      peg$c65 = function(s) {
          return {
            token: 'SPACE',
            value: ' '
          }
        },

      peg$currPos          = 0,
      peg$savedPos         = 0,
      peg$posDetailsCache  = [{ line: 1, column: 1 }],
      peg$maxFailPos       = 0,
      peg$maxFailExpected  = [],
      peg$silentFails      = 0,

      peg$result;

  if ("startRule" in options) {
    if (!(options.startRule in peg$startRuleFunctions)) {
      throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
    }

    peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
  }

  function text() {
    return input.substring(peg$savedPos, peg$currPos);
  }

  function location() {
    return peg$computeLocation(peg$savedPos, peg$currPos);
  }

  function expected(description, location) {
    location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

    throw peg$buildStructuredError(
      [peg$otherExpectation(description)],
      input.substring(peg$savedPos, peg$currPos),
      location
    );
  }

  function error(message, location) {
    location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

    throw peg$buildSimpleError(message, location);
  }

  function peg$literalExpectation(text, ignoreCase) {
    return { type: "literal", text: text, ignoreCase: ignoreCase };
  }

  function peg$classExpectation(parts, inverted, ignoreCase) {
    return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };
  }

  function peg$anyExpectation() {
    return { type: "any" };
  }

  function peg$endExpectation() {
    return { type: "end" };
  }

  function peg$otherExpectation(description) {
    return { type: "other", description: description };
  }

  function peg$computePosDetails(pos) {
    var details = peg$posDetailsCache[pos], p;

    if (details) {
      return details;
    } else {
      p = pos - 1;
      while (!peg$posDetailsCache[p]) {
        p--;
      }

      details = peg$posDetailsCache[p];
      details = {
        line:   details.line,
        column: details.column
      };

      while (p < pos) {
        if (input.charCodeAt(p) === 10) {
          details.line++;
          details.column = 1;
        } else {
          details.column++;
        }

        p++;
      }

      peg$posDetailsCache[pos] = details;
      return details;
    }
  }

  function peg$computeLocation(startPos, endPos) {
    var startPosDetails = peg$computePosDetails(startPos),
        endPosDetails   = peg$computePosDetails(endPos);

    return {
      start: {
        offset: startPos,
        line:   startPosDetails.line,
        column: startPosDetails.column
      },
      end: {
        offset: endPos,
        line:   endPosDetails.line,
        column: endPosDetails.column
      }
    };
  }

  function peg$fail(expected) {
    if (peg$currPos < peg$maxFailPos) { return; }

    if (peg$currPos > peg$maxFailPos) {
      peg$maxFailPos = peg$currPos;
      peg$maxFailExpected = [];
    }

    peg$maxFailExpected.push(expected);
  }

  function peg$buildSimpleError(message, location) {
    return new peg$SyntaxError(message, null, null, location);
  }

  function peg$buildStructuredError(expected, found, location) {
    return new peg$SyntaxError(
      peg$SyntaxError.buildMessage(expected, found),
      expected,
      found,
      location
    );
  }

  function peg$parsestart() {
    var s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    s1 = [];
    s2 = peg$parseSpace();
    while (s2 !== peg$FAILED) {
      s1.push(s2);
      s2 = peg$parseSpace();
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseblock();
      if (s2 !== peg$FAILED) {
        s3 = [];
        s4 = peg$parseSpace();
        while (s4 !== peg$FAILED) {
          s3.push(s4);
          s4 = peg$parseSpace();
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c0(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseblock() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$parseStatement();
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 40) {
        s1 = peg$c1;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c2); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseSpace();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parseSpace();
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parseStatement();
          if (s3 !== peg$FAILED) {
            s4 = [];
            s5 = peg$parseSpace();
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              s5 = peg$parseSpace();
            }
            if (s4 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 41) {
                s5 = peg$c3;
                peg$currPos++;
              } else {
                s5 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c4); }
              }
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c5(s3);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    }

    return s0;
  }

  function peg$parseStatement() {
    var s0;

    s0 = peg$parseStatementAND();
    if (s0 === peg$FAILED) {
      s0 = peg$parseStatementOR();
      if (s0 === peg$FAILED) {
        s0 = peg$parseStatementNOT();
        if (s0 === peg$FAILED) {
          s0 = peg$parseExpression();
        }
      }
    }

    return s0;
  }

  function peg$parseStatementAND() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    s1 = peg$parseExpression();
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$parseSpace();
      if (s3 !== peg$FAILED) {
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parseSpace();
        }
      } else {
        s2 = peg$FAILED;
      }
      if (s2 !== peg$FAILED) {
        if (input.substr(peg$currPos, 3) === peg$c6) {
          s3 = peg$c6;
          peg$currPos += 3;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c7); }
        }
        if (s3 !== peg$FAILED) {
          s4 = [];
          s5 = peg$parseSpace();
          if (s5 !== peg$FAILED) {
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              s5 = peg$parseSpace();
            }
          } else {
            s4 = peg$FAILED;
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parseStatement();
            if (s5 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c8(s1, s5);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseStatementOR() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    s1 = peg$parseExpression();
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$parseSpace();
      if (s3 !== peg$FAILED) {
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parseSpace();
        }
      } else {
        s2 = peg$FAILED;
      }
      if (s2 !== peg$FAILED) {
        if (input.substr(peg$currPos, 2) === peg$c9) {
          s3 = peg$c9;
          peg$currPos += 2;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c10); }
        }
        if (s3 !== peg$FAILED) {
          s4 = [];
          s5 = peg$parseSpace();
          if (s5 !== peg$FAILED) {
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              s5 = peg$parseSpace();
            }
          } else {
            s4 = peg$FAILED;
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parseStatement();
            if (s5 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c11(s1, s5);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseStatementNOT() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 3) === peg$c12) {
      s1 = peg$c12;
      peg$currPos += 3;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c13); }
    }
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$parseSpace();
      if (s3 !== peg$FAILED) {
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parseSpace();
        }
      } else {
        s2 = peg$FAILED;
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parseStatement();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c14(s3);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseExpressionMatch() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = peg$parseWord();
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 58) {
        s2 = peg$c15;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c16); }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parseValue();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c17(s1, s3);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseExpressionEquals() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    s1 = peg$parseWord();
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$parseSpace();
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$parseSpace();
      }
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 61) {
          s3 = peg$c18;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c19); }
        }
        if (s3 !== peg$FAILED) {
          s4 = [];
          s5 = peg$parseSpace();
          while (s5 !== peg$FAILED) {
            s4.push(s5);
            s5 = peg$parseSpace();
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parseValue();
            if (s5 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c20(s1, s5);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseExpressionGt() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    s1 = peg$parseWord();
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$parseSpace();
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$parseSpace();
      }
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 62) {
          s3 = peg$c21;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c22); }
        }
        if (s3 !== peg$FAILED) {
          s4 = [];
          s5 = peg$parseSpace();
          while (s5 !== peg$FAILED) {
            s4.push(s5);
            s5 = peg$parseSpace();
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parseValue();
            if (s5 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c23(s1, s5);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseExpressionGte() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    s1 = peg$parseWord();
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$parseSpace();
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$parseSpace();
      }
      if (s2 !== peg$FAILED) {
        if (input.substr(peg$currPos, 2) === peg$c24) {
          s3 = peg$c24;
          peg$currPos += 2;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c25); }
        }
        if (s3 !== peg$FAILED) {
          s4 = [];
          s5 = peg$parseSpace();
          while (s5 !== peg$FAILED) {
            s4.push(s5);
            s5 = peg$parseSpace();
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parseValue();
            if (s5 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c26(s1, s5);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseExpressionLt() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    s1 = peg$parseWord();
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$parseSpace();
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$parseSpace();
      }
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 60) {
          s3 = peg$c27;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c28); }
        }
        if (s3 !== peg$FAILED) {
          s4 = [];
          s5 = peg$parseSpace();
          while (s5 !== peg$FAILED) {
            s4.push(s5);
            s5 = peg$parseSpace();
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parseValue();
            if (s5 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c29(s1, s5);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseExpressionLte() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    s1 = peg$parseWord();
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$parseSpace();
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$parseSpace();
      }
      if (s2 !== peg$FAILED) {
        if (input.substr(peg$currPos, 2) === peg$c30) {
          s3 = peg$c30;
          peg$currPos += 2;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c31); }
        }
        if (s3 !== peg$FAILED) {
          s4 = [];
          s5 = peg$parseSpace();
          while (s5 !== peg$FAILED) {
            s4.push(s5);
            s5 = peg$parseSpace();
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parseValue();
            if (s5 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c32(s1, s5);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseExpression() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$parseExpressionMatch();
    if (s0 === peg$FAILED) {
      s0 = peg$parseExpressionGte();
      if (s0 === peg$FAILED) {
        s0 = peg$parseExpressionGt();
        if (s0 === peg$FAILED) {
          s0 = peg$parseExpressionLte();
          if (s0 === peg$FAILED) {
            s0 = peg$parseExpressionLt();
            if (s0 === peg$FAILED) {
              s0 = peg$parseExpressionEquals();
              if (s0 === peg$FAILED) {
                s0 = peg$currPos;
                if (input.charCodeAt(peg$currPos) === 40) {
                  s1 = peg$c1;
                  peg$currPos++;
                } else {
                  s1 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c2); }
                }
                if (s1 !== peg$FAILED) {
                  s2 = [];
                  s3 = peg$parseSpace();
                  while (s3 !== peg$FAILED) {
                    s2.push(s3);
                    s3 = peg$parseSpace();
                  }
                  if (s2 !== peg$FAILED) {
                    s3 = peg$parseStatement();
                    if (s3 !== peg$FAILED) {
                      s4 = [];
                      s5 = peg$parseSpace();
                      while (s5 !== peg$FAILED) {
                        s4.push(s5);
                        s5 = peg$parseSpace();
                      }
                      if (s4 !== peg$FAILED) {
                        if (input.charCodeAt(peg$currPos) === 41) {
                          s5 = peg$c3;
                          peg$currPos++;
                        } else {
                          s5 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c4); }
                        }
                        if (s5 !== peg$FAILED) {
                          peg$savedPos = s0;
                          s1 = peg$c5(s3);
                          s0 = s1;
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                      } else {
                        peg$currPos = s0;
                        s0 = peg$FAILED;
                      }
                    } else {
                      peg$currPos = s0;
                      s0 = peg$FAILED;
                    }
                  } else {
                    peg$currPos = s0;
                    s0 = peg$FAILED;
                  }
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              }
            }
          }
        }
      }
    }

    return s0;
  }

  function peg$parseValue() {
    var s0, s1;

    peg$silentFails++;
    s0 = peg$parseNumber();
    if (s0 === peg$FAILED) {
      s0 = peg$parseBoolean();
      if (s0 === peg$FAILED) {
        s0 = peg$parseNull();
        if (s0 === peg$FAILED) {
          s0 = peg$parseString();
        }
      }
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c33); }
    }

    return s0;
  }

  function peg$parseString() {
    var s0, s1, s2, s3;

    peg$silentFails++;
    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 34) {
      s1 = peg$c35;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c36); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseSpecial();
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 34) {
          s3 = peg$c35;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c36); }
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c37(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 39) {
        s1 = peg$c38;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c39); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseSpecial();
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 39) {
            s3 = peg$c38;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c39); }
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c37(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parseSpecial();
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c37(s1);
        }
        s0 = s1;
      }
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c34); }
    }

    return s0;
  }

  function peg$parseNumber() {
    var s0, s1, s2;

    peg$silentFails++;
    s0 = peg$currPos;
    s1 = [];
    if (peg$c41.test(input.charAt(peg$currPos))) {
      s2 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c42); }
    }
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        if (peg$c41.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c42); }
        }
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c43(s1);
    }
    s0 = s1;
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c40); }
    }

    return s0;
  }

  function peg$parseBoolean() {
    var s0, s1;

    peg$silentFails++;
    s0 = peg$currPos;
    if (input.substr(peg$currPos, 4) === peg$c45) {
      s1 = peg$c45;
      peg$currPos += 4;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c46); }
    }
    if (s1 === peg$FAILED) {
      if (input.substr(peg$currPos, 5) === peg$c47) {
        s1 = peg$c47;
        peg$currPos += 5;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c48); }
      }
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c49(s1);
    }
    s0 = s1;
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c44); }
    }

    return s0;
  }

  function peg$parseNull() {
    var s0, s1;

    peg$silentFails++;
    s0 = peg$currPos;
    if (input.substr(peg$currPos, 4) === peg$c51) {
      s1 = peg$c51;
      peg$currPos += 4;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c52); }
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c53(s1);
    }
    s0 = s1;
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c50); }
    }

    return s0;
  }

  function peg$parseWord() {
    var s0, s1, s2;

    peg$silentFails++;
    s0 = peg$currPos;
    s1 = [];
    s2 = peg$parseLetter();
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parseLetter();
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c55(s1);
    }
    s0 = s1;
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c54); }
    }

    return s0;
  }

  function peg$parseSpecial() {
    var s0, s1, s2;

    peg$silentFails++;
    s0 = peg$currPos;
    s1 = [];
    if (peg$c57.test(input.charAt(peg$currPos))) {
      s2 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c58); }
    }
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        if (peg$c57.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c58); }
        }
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c59(s1);
    }
    s0 = s1;
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c56); }
    }

    return s0;
  }

  function peg$parseLetter() {
    var s0;

    if (peg$c60.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c61); }
    }

    return s0;
  }

  function peg$parseSpace() {
    var s0, s1, s2;

    peg$silentFails++;
    s0 = peg$currPos;
    s1 = [];
    if (input.charCodeAt(peg$currPos) === 32) {
      s2 = peg$c63;
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c64); }
    }
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        if (input.charCodeAt(peg$currPos) === 32) {
          s2 = peg$c63;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c64); }
        }
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c65(s1);
    }
    s0 = s1;
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c62); }
    }

    return s0;
  }

  peg$result = peg$startRuleFunction();

  if (peg$result !== peg$FAILED && peg$currPos === input.length) {
    return peg$result;
  } else {
    if (peg$result !== peg$FAILED && peg$currPos < input.length) {
      peg$fail(peg$endExpectation());
    }

    throw peg$buildStructuredError(
      peg$maxFailExpected,
      peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
      peg$maxFailPos < input.length
        ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
        : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
    );
  }
}

module.exports = {
  SyntaxError: peg$SyntaxError,
  parse:       peg$parse
};
