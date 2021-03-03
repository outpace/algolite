import { Database } from "./database";

const storePath = "./indexes";

describe("Database", () => {
  describe(".get", () => {
    it("returns a database", async () => {
      const db = await Database.get("foo", storePath);
      const saveResult = await db.saveObject({});
      const searchResult = await db.searchObjects({});

      // await Database.purgeAll();
    });
  });
});
