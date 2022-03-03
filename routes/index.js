const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    res.redirect('/tickets')
})

module.exports = router