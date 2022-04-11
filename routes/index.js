const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    res.redirect('/tickets')
})

router.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
  })

module.exports = router