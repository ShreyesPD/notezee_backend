const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { query, validationResult , body } = require('express-validator');

router.post('/', (req, res) => {
    console.log(req.body)
    const user = User(req.body)
    user.save()
    res.send(req.body)
})

module.exports = router  