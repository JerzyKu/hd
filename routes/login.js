const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    res.render('login/index', { Message: "wiadomość", err: '' })
})

router.get('/forgot', async (req, res) => {
    res.render('login/index', { Message:'', err: "forgot is not implemented yet" })
})

router.get('/logout', async (req, res) => {
    res.render('login/index', { Message: "Wylogowano", err: '' })
})

router.post('/', (req, res) => {
    let username = req.body.email
    let password = req.body.password
    res.render('login/index',{Message:`Username: ${username} Password: ${password}`, err: ''})
})


module.exports = router