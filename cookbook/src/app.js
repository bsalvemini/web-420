/**
 * Author: Brandon Salvemini
 * Date:   6/12/2024
 * File Name: app.js
 * Description: Main js file for cookbook app
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

// Get route
app.get("/", async (req, res, next) => {
  // HTML content for the landing page
  const html = `
    <html>
    <head>
    <title>Cookbook App</title>
    <style>
    body, h1, h2, h3 { margin: 0; padding: 0; border: 0;}
    body {
    background: #424242;
    color: #zf;
    margin: 1.25rem;
    font-size: 1.25rem;
    }
    h1, h2, h3 { color: #EF5350; font-family: 'Emblema One', cursive;}
    h1, h2 { text-align: center }
    h3 { color: #zf; }
    .container { width: 50%; margin: 0 auto; font-family: 'Lora', serif; }
    .recipe { border: 1px solid #EF5350; padding: 1rem; margin: 1rem 0; }
    .recipe h3 { margin-top: 0; }
    main a { color: #zf; text-decoration: none; }
    main a:hover { color: #EF5350; text-decoration: underline;}
    </style>
    </head>
    <body>
    <div class="container">
    <header>
    <h1>Cookbook App</h1>

    <h2>Discover and Share Amazing Recipes</h2>
    </header>
    <br />
    <main>
    <div class="recipe">
    <h3>Classic Beef Tacos</h3>
    <p>1. Brown the ground beef in a skillet.<br>2. Warm the taco shells in the
    oven.<br>3. Fill the taco shells with beef, lettuce, and cheese.</p>
    </div>
    <div class="recipe">
    <h3>Vegetarian Lasagna</h3>
    <p>1. Layer lasagna noodles, marinara sauce, and cheese in a baking
    dish.<br>2. Bake at 375 degrees for 45 minutes.<br>3. Let cool before
    serving.</p>
    </div>
    </main>
    </div>
    </body>
    </html>
`; // end HTML content for the landing page
  res.send(html); // Sends the HTML content to the client
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