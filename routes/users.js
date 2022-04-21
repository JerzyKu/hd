const express = require('express')
const router = express.Router()
const checkAuthenticated = require('../middleware/checkAuthenticated')

const User = require('../models/user')
const bcrypt = require("bcrypt")

// show list of users
router.get('/', checkAuthenticated, async (req, res) => {
    res.render('users/index', {thing: await User.find()})
})

// show new user form 
router.get('/new', checkAuthenticated, (req, res) => {
    res.render("users/new")
})

//create user in db
router.post('/new', async (req, res) => {
    try {
        const user = new User({
            email: req.body.email,
            password: await bcrypt.hash(req.body.password + '', 10),
            name: req.body.name,
            surname: req.body.surname,
        })
        console.log(req.body.name);
        const newUser = await user.save()
        res.redirect('/users')
    } catch (e) {
        console.log(e);
        res.redirect('/users/new')
    }
})

//show single user
router.get('/:id', async (req, res) => {
    try {
        res.render('users/edit', {user: await User.findById(req.params.id)})
    } catch (e) {
        console.log(e);
        res.send('somthing wrong')
    }
})
module.exports = router
