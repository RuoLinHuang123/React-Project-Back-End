const request = require("supertest");
const Item = require("../../models/item");
const ItemDetail = require("../../models/itemDetail");
const User = require("../../models/user");
let server;

describe("/api/items", () => {
  beforeEach(async () => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await Item.deleteMany({});
  });

  describe("GET /", () => {
    it("should return all items", async () => {
      await Item.collection.insertMany([
        {
          name: "Earth",
          mass: 12345,
          category: "Planet",
          picUrl:
            "https://en.wikipedia.org/wiki/File:The_Blue_Marble_(remastered).jpg",
        },
        {
          name: "Earth2",
          mass: 12345,
          category: "Planet",
          picUrl:
            "https://en.wikipedia.org/wiki/File:The_Blue_Marble_(remastered).jpg",
        },
      ]);

      const res = await request(server).get("/api/items");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((item) => item.name === "Earth")).toBe(true);
      expect(res.body.some((item) => item.name === "Earth2")).toBe(true);
    });
  });
});

describe("/api/itemDetails", () => {
  beforeEach(async () => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await ItemDetail.deleteMany({});
  });

  describe("GET /", () => {
    it("should return 400 if name is not provided", async () => {
      const res = await request(server).get("/api/itemDetails");

      expect(res.status).toBe(400);
    });
  });

  describe("GET /:name", () => {
    it("should return 404 if item doesn't exist", async () => {
      const res = await request(server).get("/api/itemDetails?name=abcd");
      expect(res.status).toBe(404);
    });
  });

  describe("GET /:name", () => {
    it("should return the item's detail", async () => {
      await ItemDetail.collection.insertOne({
        name: "abcd",
        properties: [],
        detailPicUrl: "aaa",
        description: "aaa",
      });
      const res = await request(server).get("/api/itemDetails?name=abcd");
      expect(res.status).toBe(200);
      expect(res.body.name).toBe("abcd");
    });
  });
});

describe("/api/itemSubmission", () => {
  beforeEach(async () => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await Item.deleteMany({});
    await ItemDetail.deleteMany({});
  });

  describe("POST /", () => {
    it("should return 401 if client is not logged in", async () => {
      const res = await request(server).post("/api/itemSubmission").send({});
      expect(res.status).toBe(401);
    });
  });

  describe("POST /", () => {
    it("should return 400 if the item is not valid", async () => {
      const token = new User().generateAuthToken();

      const res = await request(server)
        .post("/api/itemSubmission")
        .set("User-Token", token)
        .send({});

      expect(res.status).toBe(400);
    });
  });

  describe("POST /", () => {
    it("should return 400 if item already exists", async () => {
      const token = new User().generateAuthToken();

      await Item.collection.insertOne({
        name: "Earth",
        mass: 12345,
        category: "Planet",
        picUrl:
          "https://en.wikipedia.org/wiki/File:The_Blue_Marble_(remastered).jpg",
      });

      const object = {
        name: "Earth",
        mass: 12345,
        category: "Planet",
        picUrl:
          "https://en.wikipedia.org/wiki/File:The_Blue_Marble_(remastered).jpg",
        detailPicUrl:
          "https://en.wikipedia.org/wiki/File:The_Blue_Marble_(remastered).jpg",
        description: "aaa",
      };

      const res = await request(server)
        .post("/api/itemSubmission")
        .set("User-Token", token)
        .send(object);

      expect(res.status).toBe(400);
    });
  });

  describe("POST /", () => {
    it("should submit the item", async () => {
      const token = new User().generateAuthToken();

      const object = {
        name: "Earth",
        mass: 12345,
        category: "Planet",
        picUrl:
          "https://en.wikipedia.org/wiki/File:The_Blue_Marble_(remastered).jpg",
        detailPicUrl:
          "https://en.wikipedia.org/wiki/File:The_Blue_Marble_(remastered).jpg",
        description: "aaa",
      };

      const res = await request(server)
        .post("/api/itemSubmission")
        .set("User-Token", token)
        .send(object);
      itemExists = await Item.findOne({ name: object.name });
      itemDetailExists = await ItemDetail.findOne({ name: object.name });

      expect(res.status).toBe(200);
      expect(res.body.name === "Earth").toBe(true);
      expect(itemExists).not.toBeNull();
      expect(itemDetailExists).not.toBeNull();
    });
  });
});

describe("/api/itemDelete", () => {
  beforeEach(async () => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await ItemDetail.deleteMany({});
    await Item.deleteMany({});
  });

  describe("DELETE /", () => {
    it("should return 401 if client is not logged in", async () => {
      const res = await request(server).delete("/api/itemDelete?name=abcd");
      expect(res.status).toBe(401);
    });
  });

  describe("DELETE /", () => {
    it("should return 403 if client is not admin", async () => {
      const token = new User().generateAuthToken();
      const res = await request(server)
        .delete("/api/itemDelete?name=abcd")
        .set("User-Token", token);
      expect(res.status).toBe(403);
    });
  });

  describe("DELETE /", () => {
    it("should return 404 if the item doesn't exist", async () => {
      const user = new User();
      user.isAdmin = true;
      const token = user.generateAuthToken();
      const res = await request(server)
        .delete("/api/itemDelete?name=abcd")
        .set("User-Token", token);
      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /", () => {
    it("should delete the item", async () => {
      await Item.collection.insertOne({
        name: "abcd",
        mass: 12345,
        category: "Planet",
        picUrl:
          "https://en.wikipedia.org/wiki/File:The_Blue_Marble_(remastered).jpg",
      });

      await ItemDetail.collection.insertOne({
        name: "abcd",
        properties: [],
        detailPicUrl: "aaa",
        description: "aaa",
      });

      const user = new User();
      user.isAdmin = true;
      const token = user.generateAuthToken();
      const res = await request(server)
        .delete("/api/itemDelete?name=abcd")
        .set("User-Token", token);

      itemExists = await Item.findOne({ name: "abcd" });
      itemDetailExists = await ItemDetail.findOne({ name: "abcd" });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('abcd');
      expect(itemExists).toBeNull();
      expect(itemDetailExists).toBeNull();
    });
  });
});
