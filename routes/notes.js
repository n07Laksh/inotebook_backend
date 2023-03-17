const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");
const getuser = require("../middleware/getuser");
const { body, validationResult } = require("express-validator");

// route1 get all the notes using GET "/api/notes/fetchallnotes" login required
router.get("/fetchallnotes", getuser, async (req, res) => {
  try {
    //req.user.id from getuser middleware function
    const notes = await Notes.find({ user: req.user.id });
    res.send(notes);
  } catch (error) {
    res.status(500).send("internal Server Error");
  }
});

// route2 adding notes using POST "/api/notes/addnote" login required
router.post("/addnote", getuser, [
    body("title", "Enter valid title").isLength({ min: 3 }),
    body("description", "description must be atleast five characters").isLength({ min: 5 }),
  ], async (req, res) => {
    try {
      const { title, description, tag } = req.body;

      //return function return error if there is a error
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const notes = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const noteData = await notes.save();
      res.send(noteData);
    } catch (error) {
      res.status(500).send("internal Server Error");
    }
  }
);

module.exports = router;
