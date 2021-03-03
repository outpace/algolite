import { Database } from "./database";

const storePath = "./indexes";

describe("Database", () => {
  afterEach(async () => {
    await Database.purgeAll();
  });

  describe(".get", () => {
    it("returns a database", async () => {
      const db = await Database.get("foo", storePath);
      const saveResult = await db.saveObject({});
      const searchResult = await db.searchObjects({});
    });
  });
});
