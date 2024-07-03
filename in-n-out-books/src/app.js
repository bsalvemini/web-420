/**
 * Author: Brandon Salvemini
 * Date:   6/12/2024
 * File Name: app.js
 * Description: Main js file for in-n-out-books app
 */

// Require statements to set up express application
const express = require("express");
const bcrypt = require("bcryptjs");
const createError = require("http-errors");

// Require statement for books.js file
const books = require("../database/books");

// Create express application
const app = express();

// Tell express to parse incoming requests as JSON payloads
app.use(express.json());

// Parse incoming urlencoded payloads
app.use(express.urlencoded({ extended: true }));

// Get route for root
app.get("/", async (req, res, next) => {
  // HTML markup to for the landing page
  const html = `
  <html>
  <head>
    <title>In-N-Out-Books app</title>
    <style>
        body, h1, h2 {margin: 0; padding: 0; border: 0;}
        body {background-color: #d6bb87; margin: 1.25rem;}
        h1, h2 {font-family: Verdana, Geneva, Tahoma, sans-serif}
        .container {width: 50%; margin: 0 auto; font-family: Garamond, serif;}
        article {margin: 1.25rem;}
    </style>
  </head>
  <body>
      <div class="container">
        <header>
            <h1>In-N-Out-Books</h1>
            <h2>Keep track of your book collection</h2>
        </header>
        <main>
            <article>
                This site will allow you to keep track of your book collection.
                Whether you are an avid book reader, or a run a bookclub,
                In-N-Out-Books takes care of your book collection tracking needs.
            </article>
        </main>
    </div>
  </body>
</html>
  `;

  // Send HTML to the client
  res.send(html);
});

// GET route for /api/books
app.get("/api/books", async (req, res, next) => {
  try {
    const allBooks = await books.find(); // Gets all books
    console.log("All Books: ", allBooks); // Logs all books
    res.send(allBooks); // Sends response with all books
  } catch (err) {
    console.error("Error: ", err.message); // Logs error message
    next(err); // Pass the error to the middleware
  }
});

// GET route for /api/books/:id
app.get("/api/books/:id", async (req, res, next) => {
  try {
    let { id } = req.params; // Get the id from the params
    id = parseInt(id); // Convert the id to an integer

    // If id is not a number
    if (isNaN(id)) {
      // Return a 400 error with a message
      return next(createError(400, "Input must be a number"));
    }

    // Find the book with the given id
    const book = await books.findOne({ id: id });

    console.log("Book: ", book); // Log the book
    res.send(book); // Send a response with the book
  } catch (err) {
    console.error("Error: ", err.message); // Log error message
    next(err); // Pass the error to the middleware
  }
});

// POST route for /api/books
app.post("/api/books", async (req, res, next) => {
  try {
    // Get book data from request body
    const newBook = req.body;

    // Array containing the expected key values
    const expectedKeys = ["id", "title", "author"];
    const receivedKeys = Object.keys(newBook); // Gets the key values from the newBook object

    // If all of the received keys are in the expected keys and the number of fields match
    if (
      !receivedKeys.every((key) => expectedKeys.includes(key)) ||
      receivedKeys.length !== expectedKeys.length
    ) {
      console.error("Bad Request: Missing keys or extra keys", receivedKeys); // Log Bad Request error
      return next(createError(400, "Bad Request")); // Create a 404 error with Bad Request message
    }

    // Insert a new book into the database
    const result = await books.insertOne(newBook);
    console.log("Result: ", result); // Log result to the console
    res.status(201).send({ id: result.ops[0].id }); // Send a 201 status code and the id of the new book
  } catch (err) {
    console.error("Error: ", err.message); // Log error message
    next(err); // Pass the error to the middleware
  }
});

// DELETE route for /api/books/:id
app.delete("/api/books/:id", async (req, res, next) => {
  try {
    const { id } = req.params; // Get the id from the params
    const result = await books.deleteOne({ id: parseInt(id) }); // Delete the book with the given id, converting the id to an integer
    console.log("Result :", result); // Log result to the console
    res.status(204).send(); // Send a 204 status code
  } catch (err) {
    console.error("Error: ", err.message); // Log error message
    next(err); // Pass the error to the middleware
  }
});

// PUT route for /api/books/:id
app.put("/api/books/:id", async (req, res, next) => {
  try {
    let { id } = req.params; // Get the id from the params
    let book = req.body; // Get the book data from the request body
    id = parseInt(id); // Convert the id to an integer

    // If id is not a number
    if (isNaN(id)) {
      // Return a 400 error with a message
      return next(createError(400, "Input must be a number"));
    }

    // Array containing the expected key values
    const expectedKeys = ["title", "author"];
    const receivedKeys = Object.keys(book); // Gets the key values from the book object

    // If all of the received keys are in the expected keys and the number of fields match
    if (
      !receivedKeys.every((key) => expectedKeys.includes(key)) ||
      receivedKeys.length !== expectedKeys.length
    ) {
      console.error("Bad Request: Missing keys or extra keys", receivedKeys); // Log Bad Request error
      return next(createError(400, "Bad Request")); // Create a 404 error with Bad Request message
    }

    const result = await books.updateOne({ id: id }, book); // Update the book using the given id
    console.log("Result: ", result); // Log result to the console
    res.status(204).send(); // Send a 204 status code
  } catch (err) {
    // If err.message is No matching item found
    if (err.message === "No matching item found") {
      console.log("Book not found", err.message); // Log error to the console
      return next(createError(404, "Book not found")); // Return a 404 error
    }
    console.error("Error: ", err.message); // Log error message
    next(err); // Pass the error to the middleware
  }
});

// catch 404 error and send to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // Set the response status to err.status or 500
  res.status(err.status || 500);

  // Send a JSON response with the details of the error
  res.json({
    type: "error",
    status: err.status,
    message: err.message,
    stack: req.app.get("env") === "development" ? err.stack : undefined,
  });
});

// Export app using modules.export
module.exports = app;
