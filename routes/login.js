const express = require('express')
const router = express.Router()
const passport = require('passport')

const checkNotAuthenticated = require('../middleware/checkNotAuthenticated')

const bcrypt = require("bcrypt")

const User = require("../models/user")

router.get('/', checkNotAuthenticated, async (req, res) => {
    res.render('login/index', { Message: "wiadomość", err: '' })
})

router.post('/', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/tickets',
    failureRedirect: '/login',
    failureFlash: true
}))

router.get('/forgot', async (req, res) => {
    res.render('login/index', { Message: "forgot is not implemented yet" })
})

router.get('/logout', async (req, res) => {
    res.render('login/index', { Message: "Wylogowano", err: '' })
})

router.get('/register', async (req, res) => {
    res.render('login/register')
})

router.post('/register', async (req, res) => {
    let email = req.body.email
    let password = req.body.password
    let hashedPassword

    try {
        hashedPassword = await bcrypt.hash(password, 10)
        const user = new User({
            email: email,
            password: hashedPassword
        })
        const newUser = await user.save()
        
    } catch (err) {
        console.log(err);
        res.render('login/register', {error: err})
    }

    res.render('login/index')
    // res.send(email + " " + password + " " + hashedPassword)
    // res.render('login/index',{Message:`Username: ${username} Password: ${password}`, err: ''})
})


module.exports = router