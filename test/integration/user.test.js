const request = require("supertest");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("config");
let server;

describe("/api/userRegister", () => {
  beforeEach(async () => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await User.deleteMany({});
  });

  describe("POST /", () => {
    it("should return 400 if the user is invalid", async () => {
      const res = await request(server).post("/api/userRegister").send({});
      expect(res.status).toBe(400);
    });
  });

  describe("POST /", () => {
    it("should return 400 if the user already registered", async () => {
      const userObj = {
        name: "abcd",
        email: "abc@abc.com",
        password: "12345",
      };
      await User.collection.insertOne(userObj);

      const res = await request(server).post("/api/userRegister").send(userObj);

      expect(res.status).toBe(400);
    });
  });

  describe("POST /", () => {
    it("should register the user", async () => {
      const userObj = {
        name: "abcd",
        email: "abc@abc.com",
        password: "12345",
      };

      const res = await request(server).post("/api/userRegister").send(userObj);
      userExists = await User.findOne({ name: "abcd" });

      expect(res.status).toBe(200);
      expect(userExists).not.toBeNull();
    });
  });
});

describe("/api/userLogin", () => {
  beforeEach(async () => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await User.deleteMany({});
  });

  describe("POST /", () => {
    it("should return 400 if the user is invalid", async () => {
      const res = await request(server).post("/api/userLogin").send({});
      expect(res.status).toBe(400);
    });
  });

  describe("POST /", () => {
    it("should return 400 if the email is invalid", async () => {
      const res = await request(server).post("/api/userLogin").send({
        name: "abcd",
        email: "abc@abc.com",
        password: "123456",
      });
      expect(res.status).toBe(400);
    });
  });

  describe("POST /", () => {
    it("should return 400 if the password is invalid", async () => {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash("12345", salt);

      await User.collection.insertOne({
        name: "abcd",
        email: "abc@abc.com",
        password: password,
      });

      const res = await request(server).post("/api/userLogin").send({
        email: "abc@abc.com",
        password: "123456",
      });
      expect(res.status).toBe(400);
    });
  });

  describe("POST /", () => {
    it("should login", async () => {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash("123456", salt);

      await User.collection.insertOne({
        name: "abcd",
        email: "abc@abc.com",
        password: password,
      });

      const res = await request(server).post("/api/userLogin").send({
        email: "abc@abc.com",
        password: "123456",
      });

      const decoded = jwt.verify(res.body.token, config.get("jwtPrivateKey"));

      expect(res.status).toBe(200);
      expect(decoded.name).toBe("abcd");
    });
  });
});

describe("/api/updataToAdmin", () => {
  beforeEach(async () => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await User.deleteMany({});
  });

  describe("POST /", () => {
    it("should return 401 if there is no token", async () => {
      const res = await request(server).post("/api/updataToAdmin").send({});
      expect(res.status).toBe(401);
    });
  });

  describe("POST /", () => {
    it("should return 400 if the user doesn't exist", async () => {
      const token = new User().generateAuthToken();

      const res = await request(server)
        .post("/api/updataToAdmin")
        .set("User-Token", token)
        .send({});

      expect(res.status).toBe(400);
    });
  });

  describe("POST /", () => {
    it("should upgrade the user to admin", async () => {
      const newUser = await User.create({
        name: "abcd",
        email: "abc@abc.com",
        password: "123456",
        isAdmin: false,
      });

      const token = newUser.generateAuthToken();

      const res = await request(server)
        .post("/api/updataToAdmin")
        .set("User-Token", token)
            .send({});
    
        const updatedUser = await User.findById(newUser._id);

        expect(res.status).toBe(200);
        expect(updatedUser.isAdmin).toBe(true);
    });
  });
});
