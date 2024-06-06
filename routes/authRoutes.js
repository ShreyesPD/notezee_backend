const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { query, validationResult, body } = require('express-validator');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const JWT_SECRET = "hellowor$d"

router.post('/createuser',
    [
        body('name', 'Enter a valid name').isLength({ min: 3 }),
        body('email', 'Enter a valid email').isEmail(),
        body('password', 'password must be atleast 6 character').isLength({ min: 6 })
    ],
    async (req, res) => {
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
    })

router.post('/login',
    [
        body('email', 'wrong credentials').isEmail(),
        body('password', 'wrong credentials').exists()
    ],
    async (req, res) => {
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
)

module.exports = router  