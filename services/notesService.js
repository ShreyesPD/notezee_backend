const Notes = require('../models/Notes')
const { validationResult } = require('express-validator');



const getAllNotes = async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id })
        console.log(notes)
        res.json(notes)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("some error occured")
    }
}


const updateNotes = async (req, res) => {
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
}

const createNotes = async (req, res) => {
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

const deleteNotes = async (req, res) => {
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
}

module.exports = {
    getAllNotes,
    updateNotes,
    createNotes,
    deleteNotes
}