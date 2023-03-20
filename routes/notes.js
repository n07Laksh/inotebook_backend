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


// route3 updating notes using PUT "/api/notes/updatenotes" : login required
router.put("/updatenotes/:id",getuser, async (req, res) =>{

  try {
  const { title, description, tag } = req.body;
  // Create new note Object
  const newNote = {};
  if(title) newNote.title = title;
  if(description) newNote.description = description;
  if(tag) newNote.tag = tag;

  // find the note to be updated and update it
  let notes = await Notes.findById(req.params.id);
  if(!notes){ return res.status(401).send("Not Found")};
  if(notes.user.toString() !== req.user.id){
    return res.status(401).send("Not Allowed");
  }

  notes = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true});
  res.json(notes);

} catch (error) {
      res.status(500).send("internal Server Error");
    }
})
  

// route4 deleting notes using DELETE "/api/notes/deletenotes" : login required
router.delete("/deletenotes/:id",getuser, async (req, res) =>{

  try {
     
    // find the note to be deleted and delete it
    let notes = await Notes.findById(req.params.id);
    if(!notes){ return res.status(404).send("Not Found")};
    // Allow detetion if user owns the note
    if(notes.user.toString() !== req.user.id){
      return res.status(401).send("Not Allowed");
    }
  
    notes = await Notes.findByIdAndDelete(req.params.id);
    res.json({"Success":"Note has been deleted", note: notes});
  
  } catch (error) {
        res.status(500).send("internal Server Error");
      }
})
module.exports = router;
