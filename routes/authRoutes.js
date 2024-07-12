const express = require('express')
const router = express.Router()
const { body } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');
const { getLoggedInUser, authenticateUser, createUser } = require('../services/authService');

//Route 1: create a user
router.post('/createuser',
    [
        body('name', 'Enter a valid name').isLength({ min: 3 }),
        body('email', 'Enter a valid email').isEmail(),
        body('password', 'password must be atleast 6 character').isLength({ min: 6 })
    ], createUser)


//Route 2: authenticate a user
router.post('/login',
    [
        body('email', 'wrong credentials').isEmail(),
        body('password', 'wrong credentials').exists()
    ], authenticateUser)


//Route 3: get loggedIn user details
router.post('/getuser', fetchuser, getLoggedInUser)


module.exports = router