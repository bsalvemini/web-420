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

// Create express application
const app = express();

// Tell express to parse incoming requests as JSON payloads
app.use(express.json());

// Parse incoming urlencoded payloads
app.use(express.urlencoded({ extended: true }));

// Get route for root
app.get("/", async (req, res, next) => {
  // HTML markup to for the landing page
  const html =
  `
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
  `

  // Send HTML to the client
  res.send(html);
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
