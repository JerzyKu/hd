const express = require('express')
const router = express.Router()
const checkAuthenticated = require('../middleware/checkAuthenticated')

const Ticket = require('../models/ticket')
const Users = require('../models/user')

router.get('/', checkAuthenticated, async (req, res) => {
    let query = await Ticket
        .find({ state: 'Open' })
        .sort({ createdAt: -1 })
        .populate({path: 'owner', model:'user'})
        .exec();
    
    try {
        
        res.render('tickets/index', { tickets: query })
    } catch (e) {
        console.log(e);
        res.redirect('/tickets/new')
    }
})

router.get('/history', checkAuthenticated, async (req, res) => {
    
    try {
        let query = await Ticket
            .find({ state: 'Close' })
            .sort({ createdAt: -1 })
            .populate({path: 'owner', model:'user'})
            .exec();
        res.render('tickets/index', { tickets: query })
    } catch (e) {
        console.log(e);
        res.redirect('/tickets/new')
    }
})

router.get('/new', checkAuthenticated,  async (req, res) => {
    try {
        const user = await Users.find()
        res.render('tickets/new', { ticket: new Ticket(), users: user})
    } catch (error) {
        console.log(error);
    }
})

router.post('/new', async (req, res) => {
    const ticket = new Ticket({
        title: req.body.title,
        description: req.body.description,
        state: req.body.state
    })
    console.log("req.body.owner: ", req.body.owner);
    if (req.body.owner != 'none') {
        ticket.owner = req.body.owner
    }

    try {
        const newTicket = await ticket.save()
        res.redirect('/tickets/new')
        //sendMail('jerzy.kubisiak@gmail.com', `New ticket: ${ticket.title}`, ticket.description)

    } catch (e) {
        console.log(e);
        res.render('tickets/new', { ticket: new Ticket() })
    }
})


router.get("/:id", checkAuthenticated, async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id).exec()
        res.render('tickets/show', { ticket: ticket })
    }
    catch (e) {
        console.log(e)
        res.redirect('/tickets')
    }
})

//update 
router.put('/:id', async (req, res) => {
    let ticket
    try {
        ticket = await Ticket.findById(req.params.id)
        ticket.title = req.body.title
        ticket.state = req.body.state
        ticket.description = req.body.description
        if ( req.body.owner == 'undefined'){
            ticket.owner = undefined
        } else {
            ticket.owner = req.body.owner
        }
        await ticket.save()
        res.redirect(`/tickets/${ticket.id}`)
    } catch (e) {
        console.log(e);
        if (ticket == null) {
            res.redirect('/tickets')
        } else {
            res.render('tickets/edit', { ticket: ticket })
        }
    }
})

router.get('/:id/edit', checkAuthenticated, async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id)
        const user = await Users.find()
        res.render("tickets/edit", { ticket: ticket, users: user })
    } catch (e) {
        res.redirect('/tickets')
    }
})

router.get('/:id/close', checkAuthenticated, async (req, res) => {
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

const sendMail = (to, subject, text) => { 
    var nodemailer = require('nodemailer');

    var transporter = nodemailer.createTransport({
        host: process.env.MAILER_HOST_SMTP, //smtp
        port: process.env.MAILER_PORT_SMTP,
        secure: process.env.MAILER_SECURE, 
        auth: {
            user: process.env.MAILER_LOGIN,
            pass: process.env.MAILER_PASSWORD,
        },
    });

    var mailOptions = {
        from: process.env.MAILER_LOGIN,   
        to: 'jerzy.kubisiak@gmail.com', //to
        subject: subject,
        // text: text,
        // html: text
        html: `<h1>Welcome</h1><p>That was easy!${text}</p>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = router