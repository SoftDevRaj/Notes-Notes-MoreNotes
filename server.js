// Load the libraries we need
const express = require("express");
const fs = require("fs");
const path = require("path");

// Create our server app
const app = express();

// Choose a port for our server
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("Public"));

// Serve the main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./index.html"));
});

// Serve the notes page
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./notes.html"));
});

// Fetch all notes from the db.json file
app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the db.json file:", err);
      return res.sendStatus(500);
    }
    res.json(JSON.parse(data));
  });
});

// Save a new note to the db.json file
app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  newNote.id = Date.now();

  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the db.json file:", err);
      return res.sendStatus(500);
    }

    const notes = JSON.parse(data);
    notes.push(newNote);

    fs.writeFile("./db/db.json", JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        console.error("Error writing to the db.json file:", err);
        return res.sendStatus(500);
      }
      res.json(newNote);
    });
  });
});

// Delete a note from the db.json file
app.delete("/api/notes/:id", (req, res) => {
  const noteId = parseInt(req.params.id);

  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the db.json file:", err);
      return res.sendStatus(500);
    }

    const notes = JSON.parse(data);
    const noteIndex = notes.findIndex(note => note.id === noteId);

    if (noteIndex === -1) {
      return res.status(404).send("Note not found.");
    }

    notes.splice(noteIndex, 1);

    fs.writeFile("./db/db.json", JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        console.error("Error writing to the db.json file:", err);
        return res.sendStatus(500);
      }
      res.send("Note deleted successfully.");
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`App listening on http://localhost:${PORT}`);
});
