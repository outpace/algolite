import { Database } from "./database";
import tmp from "tmp";

const {
  name: storePath,
  removeCallback: storePathRemoveFunction,
} = tmp.dirSync();

describe("Database", () => {
  beforeAll(async () => {
    await Database.purgeAll();
  });

  afterEach(async () => {
    await Database.purgeAll();
  });

  afterAll(() => {
    storePathRemoveFunction();
  });

  describe(".get", () => {
    it("returns a database and doesn't error", async () => {
      await Database.get("foo", storePath);
    });
    it("saves and returns objects", async () => {
      const db = await Database.get("foo", storePath);
      const { objectID } = await db.saveObject({ foo: "bar" });
      await db.saveObject({ foo: "qux" });
      expect(objectID).toBeDefined();
      console.log(objectID);
      let searchResult = await db.searchObjects({
        filters: `objectID:${objectID}`,
      });
      console.log(searchResult);
      searchResult = await db.searchObjects({});
      console.log(searchResult);
    });
  });
});
