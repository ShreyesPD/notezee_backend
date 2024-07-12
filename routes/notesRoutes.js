const express = require('express')
const router = express.Router()
const fetchuser = require('../middleware/fetchuser')
const { body } = require('express-validator');
const { getAllNotes, updateNotes, createNotes, deleteNotes } = require('../services/notesService');

//Route 1 : get all the notes
router.get('/fetchallnotes', fetchuser, getAllNotes)

//Route 2 : edit the existing note
router.put('/updatenote/:id', fetchuser, updateNotes)

//Route 3 : create notes
router.post('/addnote', fetchuser,
    [
        body('title', 'Enter a valid name').isLength({ min: 3 }),
        body('desc', 'description must be atleast 6 character').isLength({ min: 6 })
    ], createNotes)

//Route 4 : delete the note
router.delete('/deletenote/:id', fetchuser, deleteNotes)


module.exports = router