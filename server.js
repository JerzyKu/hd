if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const passport = require('passport')
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const flash = require('express-flash')
const session = require('express-session')
const Users = require('./models/user')
const methodOverride = require('method-override')

const checkBuildInAdmin = require('./middleware/checkBuildInAdmin')

const initPassport = require('./passport-config')
initPassport(passport, async (email) => {
  let usersOut

  try {
    usersOut = await Users.find({ email: email })
  } catch (error) {
    console.log(error);
  }
  
  return usersOut
},
  async id => {
    let idOut
    try {
      idOut = await Users.findById(id)
    } catch (error) {
      console.log(error);
    }
    return idOut
  }
)

const ticketRouter = require('./routes/tickets')
const indexRouter = require('./routes/index')
const loginRouter = require('./routes/login')
const userRouter = require('./routes/users')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')

app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use('/public', express.static('./public'))
// app.use(express.static('public'))
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}))

app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

// connect to db 
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true
})
const db = mongoose.connection
db.on('error', e => console.error(e))
db.once('open', e => {
  console.log('Connected to mongoose'); 
  checkBuildInAdmin();
})

app.use('/tickets', ticketRouter)
app.use('/', indexRouter)
app.use('/login', loginRouter)
app.use('/users', userRouter)

app.listen(process.env.PORT || 3000, () => {console.log(`App listen on port: ${process.env.PORT || 3000}`)})



// exapmle of schedule, for future use ;) 
// const cron = require('node-cron');
// cron.schedule('* * * * *', () => {
//   console.log('Test of cron schedule(evry minutes):', String(Date()).slice(4, 24));
// });