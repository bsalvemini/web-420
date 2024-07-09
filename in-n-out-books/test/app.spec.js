const app = require("../src/app");
const request = require("supertest");

describe("Chapter 3: API Tests", () => {
  it("it should return an array of books", async () => {
    const res = await request(app).get("/api/books");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);

    res.body.forEach((book) => {
      expect(book).toHaveProperty("id");
      expect(book).toHaveProperty("title");
      expect(book).toHaveProperty("author");
    });
  });

  it("it should return a single book", async () => {
    const res = await request(app).get("/api/books/1");
    expect(res.statusCode).toEqual(200);

    expect(res.body).toHaveProperty("id", 1);
    expect(res.body).toHaveProperty("title", "The Fellowship of the Ring");
    expect(res.body).toHaveProperty("author", "J.R.R. Tolkien");
  });

  it("should return a 400 error if the id is not a number", async () => {
    const res = await request(app).get("/api/books/foo");
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Input must be a number");
  });
});

describe("Chapter 4: API Tests", () => {
  it("should return a 201 status code when adding a new book", async () => {
    const res = await request(app).post("/api/books").send({
      id: 65,
      title: "Pragmatic APIs with NodeJS and Express",
      author: "Richard Krasso",
    });

    expect(res.statusCode).toEqual(201);
  });

  it("should return a 400 status code when adding a new book with missing title", async () => {
    const res = await request(app).post("/api/books").send({
      id: 66,
      author: "Arnaud Lauret",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Bad Request");
  });

  it("should return a 204 status code when deleting a book", async () => {
    const res = await request(app).delete("/api/books/65");

    expect(res.statusCode).toEqual(204);
  });
});

describe("Chapter 5: API Tests", () => {
  it("should update a book and return a 204-status code", async () => {
    const res = await request(app).put("/api/books/1").send({
      title: "LOTR The Fellowship of the Ring",
      author: "J.R.R. Tolkien",
    });

    expect(res.statusCode).toEqual(204);
  });

  it("should return a 400-status code when using a non-numeric id", async () => {
    const res = await request(app).put("/api/books/foo").send({
      name: "Test Book",
      author: "Test Author",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Input must be a number");
  });

  it("should return a 400-status code when updating a book with a missing title", async () => {
    const res = await request(app).put("/api/books/1").send({
      author: "Test Author",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Bad Request");
  });
});

describe("Chapter 6: API Tests", () => {
  it("should log a user in and return a 200-status with 'Authentication successful' message", async () => {
    const res = await request(app).post("/api/login").send({
      email: "ron@hogwarts.edu",
      password: "weasley",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Authentication successful");
  });

  it("should return a 401-status code with 'Unauthorized' message when logging in with incorrect credentials", async () => {
    const res = await request(app).post("/api/login").send({
      email: "wrong@hogwarts.edu",
      password: "wrongPass",
    });

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual("Unauthorized");
  });

  it("should return a 400-status code with 'Bad Request' when missing email or password", async () => {
    const res = await request(app).post("/api/login").send({
      email: "ron@hogwarts.edu",
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Bad Request");
  });
});
