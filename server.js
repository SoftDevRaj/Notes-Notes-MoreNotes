// Load the libraries we need
const express = require("express");
const fs = require("fs");
const path = require("path");

// Create our server app
const app = express();

// Choose a port for our server
const PORT = process.env.PORT || 3000;

// Tell our app to understand incoming JSON data and website forms
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve our front-end files from the 'public' folder
app.use(express.static("public"));

// Show the main page when we visit the website
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Show the notes page when we visit /notes
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// Get all the notes saved in our file
app.get("/api/notes", (req, res) => {
  // Read our notes from db.json
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the db.json file:", err);
      return res.sendStatus(500); // Send a server error response if there's an issue
    }

    const notes = JSON.parse(data); // Convert the file content from string to JavaScript object/array
    res.json(notes); // Send the notes as a response
  });
});

// Add a new note when we save one
app.post("/api/notes", (req, res) => {
  // We need to save our new note to a file here
});

// Start our server so we can access our website
app.listen(PORT, () => {
  console.log(`Our app is running on http://localhost:${PORT}`);
});
