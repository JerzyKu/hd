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
            title: req.body.title
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

//update 
router.put('/:id', async (req, res) => {
    let user
    try {
        user = await User.findById(req.params.id)

        user.name=req.body.name
        user.surname=req.body.surname
        user.title=req.body.title
        
        if(req.body.password !==  ''){
            user.password = req.body.password
        }else{
            user.password = user.password
        }
        user.email = req.body.email

        console.log("req.body.password", req.body.password);

        await user.save()
        res.redirect(`/users/${user.id}`)

    } catch (error) {
        console.log(error);
        if (user == null){
            res.redirect(`/users`)
        }else {
            res.render('users/edit', {user: user})
        }
    }
})

module.exports = router
