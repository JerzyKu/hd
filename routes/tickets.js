const express = require('express')
const router = express.Router()

const Ticket = require('../models/ticket')

const moment = require('moment')

router.get('/', async (req, res) => {
    let query = Ticket.find({state: 'Open'}).sort({createdAt: -1})
    try {
        const tickets = await query.exec()
        res.render('tickets/index', {tickets: tickets})
    } catch (e) {
        console.log(e);
        res.redirect('/tickets/new')
    }
})

router.get('/new', (req,res) => {
    res.render('tickets/new', {ticket: new Ticket() })
})

router.post('/new', async (req, res) => {
    const ticket = new Ticket({
        title: req.body.title,
        description: req.body.description
    })

    try{
        const newTicket = await ticket.save()
        res.redirect('/tickets/new')

    } catch (e) {
        console.log(e);
        res.render('tickets/new', {ticket: new Ticket() })
    }
})

router.get("/:id", async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id).exec()
        const a = moment(ticket.createdAt).format('Do MMM YYYY, hh:mm:ss');
        const b = moment(ticket.createdAt).startOf('hour').fromNow(); 
        res.render('tickets/show', {ticket: ticket, a: a, b: b})
    }
    catch (e) {
        console.log(e)
        res.redirect('/tickets')
    }
})

//update 
router.put('/:id', async (req,res) => {
    let ticket
    try{
        ticket = await Ticket.findById(req.params.id)
        ticket.title = req.body.title
        ticket.state = req.body.state
        await ticket.save()
        res.redirect(`/tickets/${ticket.id}`)
    } catch (e) {
        console.log(e);
        if (ticket == null) {
            res.redirect('/tickets')
        } else {
            res.render('tickets/edit', {ticket: ticket})
        }
    }
})

router.get('/:id/edit', async (req,res) => {
    try {
        const ticket = await Ticket.findById(req.params.id)
        res.render("tickets/edit", { ticket: ticket })
    } catch (e) {
        res.redirect('/tickets')
    }
})

router.get('/:id/close', async (req,res) => {
    let ticket
    try {
        ticket = await Ticket.findById(req.params.id)
        ticket.state = 'Close'
        await ticket.save()
        
        res.redirect('/tickets')
    } catch (e) {
        console.log(e);
        res.redirect('/tickets')
    }
})

module.exports = router