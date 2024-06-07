const express = require('express')
const router = express.Router()
const Notes = require('../models/Notes')
const fetchuser = require('../middleware/fetchuser')

//Route 1 : get all the notes
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    const notes = await Notes.find({ user: req.user.id })
    console.log(notes)
    res.json(notes)
})

module.exports = router