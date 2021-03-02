import { parseAlgoliaSQL, parseQuery } from "./parseAlgoliaQueries";

describe("parseQuery", () => {
  it("returns undefined for undefined queries", () => {
    expect(parseQuery(undefined)).toBeUndefined();
  });

  it("returns a query for all fields when it receives an empty string", () => {
    expect(parseQuery("")).toEqual({ FIELD: "_all" });
  });

  it("returns a single space-separated query when it receives and array of strings", () => {
    expect(parseQuery(["foo", "bar"])).toEqual("foo bar");
  });

  it("removes empty strings when it receives empty strings", () => {
    expect(parseQuery([""])).toEqual({ FIELD: "_all" });
    expect(parseQuery(["foo", ""])).toEqual("foo");
  });
});

describe("parseAlgoliaSQL", () => {
  describe("MATCH", () => {
    it("matches a field and a string", () => {
      expect(parseAlgoliaSQL("foo:bar")).toEqual({
        FIELD: "foo",
        VALUE: "bar",
      });
    });

    it("matches a field and a number", () => {
      expect(parseAlgoliaSQL("foo:1")).toEqual({
        FIELD: "foo",
        VALUE: "1",
      });
    });

    it("matches a field and a boolean", () => {
      expect(parseAlgoliaSQL("foo:false")).toEqual({
        FIELD: "foo",
        VALUE: "false",
      });
    });

    it("matches a field and null", () => {
      expect(parseAlgoliaSQL("foo:null")).toEqual({
        FIELD: "foo",
        VALUE: "null",
      });
    });
  });

  describe("EQUALS", () => {
    it("does what MATCH does", () => {
      expect(parseAlgoliaSQL("foo = bar")).toEqual({
        FIELD: "foo",
        VALUE: "bar",
      });
      expect(parseAlgoliaSQL("foo = 1")).toEqual({
        FIELD: "foo",
        VALUE: "1",
      });
      expect(parseAlgoliaSQL("foo = false")).toEqual({
        FIELD: "foo",
        VALUE: "false",
      });
      expect(parseAlgoliaSQL("foo = null")).toEqual({
        FIELD: "foo",
        VALUE: "null",
      });
    });
  });

  describe("AND", () => {
    it("generates an AND token when there is more than one expression", () => {
      expect(parseAlgoliaSQL("foo = bar AND baz = 1")).toEqual({
        AND: [
          { FIELD: "foo", VALUE: "bar" },
          { FIELD: "baz", VALUE: "1" },
        ],
      });
    });
  });

  describe("OR", () => {
    it("generates an OR token when there is more than one expression", () => {
      expect(parseAlgoliaSQL("foo = bar OR baz = 1")).toEqual({
        OR: [
          { FIELD: "foo", VALUE: "bar" },
          { FIELD: "baz", VALUE: "1" },
        ],
      });
    });
  });

  describe("NOT", () => {
    it("generates a NOT token", () => {
      expect(parseAlgoliaSQL("NOT foo = bar")).toEqual({
        NOT: {
          EXCLUDE: { FIELD: "foo", VALUE: "bar" },
          INCLUDE: { FIELD: "_all" },
        },
      });
    });
  });

  describe("GT", () => {
    it("generates a token for > string, boolean, and null queries", () => {
      expect(parseAlgoliaSQL("foo > bar")).toEqual({
        FIELD: "foo",
        VALUE: { GTE: "bar" },
      });
      expect(parseAlgoliaSQL("foo > false")).toEqual({
        FIELD: "foo",
        VALUE: { GTE: "false" },
      });
      expect(parseAlgoliaSQL("foo > null")).toEqual({
        FIELD: "foo",
        VALUE: { GTE: "null" },
      });
    });

    it("generates a token for > number queries", () => {
      expect(parseAlgoliaSQL("foo > 1")).toEqual({
        FIELD: "foo",
        VALUE: { GTE: "2" },
      });
    });
  });

  describe("GTE", () => {
    it("generates a token for >= string, boolean, and null queries", () => {
      expect(parseAlgoliaSQL("foo >= bar")).toEqual({
        FIELD: "foo",
        VALUE: { GTE: "bar" },
      });
      expect(parseAlgoliaSQL("foo >= false")).toEqual({
        FIELD: "foo",
        VALUE: { GTE: "false" },
      });
      expect(parseAlgoliaSQL("foo >= null")).toEqual({
        FIELD: "foo",
        VALUE: { GTE: "null" },
      });
    });

    it("generates a token for >= number queries", () => {
      expect(parseAlgoliaSQL("foo >= 1")).toEqual({
        FIELD: "foo",
        VALUE: { GTE: "1" },
      });
    });
  });

  describe("LT", () => {
    it("generates a token for < string, boolean, and null queries", () => {
      expect(parseAlgoliaSQL("foo < bar")).toEqual({
        FIELD: "foo",
        VALUE: { LTE: "bar" },
      });
      expect(parseAlgoliaSQL("foo < false")).toEqual({
        FIELD: "foo",
        VALUE: { LTE: "false" },
      });
      expect(parseAlgoliaSQL("foo < null")).toEqual({
        FIELD: "foo",
        VALUE: { LTE: "null" },
      });
    });

    it("generates a token for < number queries", () => {
      expect(parseAlgoliaSQL("foo < 2")).toEqual({
        FIELD: "foo",
        VALUE: { LTE: "1" },
      });
    });
  });

  describe("LTE", () => {
    it("generates a token for <= string, boolean, and null queries", () => {
      expect(parseAlgoliaSQL("foo <= bar")).toEqual({
        FIELD: "foo",
        VALUE: { LTE: "bar" },
      });
      expect(parseAlgoliaSQL("foo <= false")).toEqual({
        FIELD: "foo",
        VALUE: { LTE: "false" },
      });
      expect(parseAlgoliaSQL("foo <= null")).toEqual({
        FIELD: "foo",
        VALUE: { LTE: "null" },
      });
    });

    it("generates a token for <= number queries", () => {
      expect(parseAlgoliaSQL("foo <= 2")).toEqual({
        FIELD: "foo",
        VALUE: { LTE: "2" },
      });
    });
  });

  describe("with different combinations", () => {
    it("parses successfully", () => {
      expect(
        parseAlgoliaSQL(
          " foo >   bar OR    (  foo   = baz AND   NOT   qux <=  2    ) OR hello:goodbye"
        )
      ).toEqual({
        OR: [
          { FIELD: "foo", VALUE: { GTE: "bar" } },
          {
            OR: [
              {
                AND: [
                  { FIELD: "foo", VALUE: "baz" },
                  {
                    NOT: {
                      EXCLUDE: { FIELD: "qux", VALUE: { LTE: "2" } },
                      INCLUDE: { FIELD: "_all" },
                    },
                  },
                ],
              },
              { FIELD: "hello", VALUE: "goodbye" },
            ],
          },
        ],
      });
    });
  });
});
