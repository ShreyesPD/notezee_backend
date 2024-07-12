const { validationResult } = require('express-validator');
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()


const JWT_SECRET = process.env.JWT_SECRET

const createUser = async (req, res) => {
    //checking for validations ,  if yes return errors
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.send({ errors: result.array() });
    }
    console.log(req.body)

    try {
        //checking if user alredy exists and returning error if it exists
        let user = await User.findOne({ email: req.body.email })
        // console.log(user)
        if (user) {
            return res.status(400).json({ error: "sorry a user with this email already exists" })
        }

        const salt = await bcrypt.genSalt(10)
        const secPass = await bcrypt.hash(req.body.password, salt)

        //creating a user
        User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email
        }).then()
            .catch(err => console.log(err))

        const data = {
            user: {
                id: User.id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET)
        console.log(authToken)
        res.json({ authToken })

    } catch (error) {
        console.error(error.message)
        res.status(500).send("some error occured")
    }
}

const authenticateUser = async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.send({ errors: result.array() });
    }
    console.log(req.body)

    const { email, password } = req.body
    try {
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ error: "please try to login with correct credentials" })
        }

        const passwordCompare = await bcrypt.compare(password, user.password)
        if (!passwordCompare) {
            return res.status(400).json({ error: "please try to login with correct credentials" })
        }

        const data = {
            user: {
                id: user.id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET)
        console.log(authToken)
        res.json({ authToken })

    } catch (error) {
        console.error(error.message)
        res.status(500).send("some error occured")
    }
}

const getLoggedInUser = async (req, res) => {
    try {
        const userId = req.user.id
        const user = await User.findById(userId).select("-password")
        console.log(user)
        res.send(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("some error occured")
    }
}


module.exports = {
    createUser,
    authenticateUser,
    getLoggedInUser
}