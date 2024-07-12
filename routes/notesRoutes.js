const express = require('express')
const router = express.Router()
const Notes = require('../models/Notes')
const fetchuser = require('../middleware/fetchuser')
const { query, validationResult, body } = require('express-validator');

//Route 1 : get all the notes
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id })
        console.log(notes)
        res.json(notes)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("some error occured")
    }
})


//Route 2 : edit the existing note
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, desc, tag } = req.body

        const newNote = {};
        if (title) { newNote.title = title }
        if (desc) { newNote.desc = desc }
        if (tag) { newNote.tag = tag }


        let note = await Notes.findById(req.params.id)
        if (!note) { return res.status(404).send("Not Found") }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note })
    } catch (error) {
        console.error(error.message)
        res.status(500).send("some error occured")
    }

})


//Route 3 : create notes
router.post('/addnote', fetchuser,
    [
        body('title', 'Enter a valid name').isLength({ min: 3 }),
        body('desc', 'description must be atleast 6 character').isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            //checking for validations ,  if yes return errors
            const result = validationResult(req);
            if (!result.isEmpty()) {
                return res.send({ errors: result.array() });
            }

            const { title, desc, tag } = req.body
            const notes = new Notes({
                title, desc, tag, user: req.user.id
            })

            const savedNote = await notes.save()
            res.json(savedNote)
        } catch (error) {
            console.error(error.message)
            res.status(500).send("some error occured")
        }
    }
)

//Route 4 : delete the note
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        let note = await Notes.findById(req.params.id)
        if (!note) { return res.status(404).send("Not Found") }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({ "Success": " Note has been deleted", note: note })
    } catch (error) {
        console.error(error.message)
        res.status(500).send("some error occured")
    }
})


module.exports = router