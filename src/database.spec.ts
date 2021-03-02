import { Database } from "./database";

const storePath = "./.algolite";

describe("Database", () => {
  describe(".get", () => {
    it("returns a database", async () => {
      const db = await Database.get("foo", storePath);
      const saveResult = await db.saveObject({});
      console.log(saveResult);
      const searchResult = await db.searchObjects({});
      console.log(searchResult);
    });
  });
});
