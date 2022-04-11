const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByEmail, getUserById){
    const authenticateUser = async (email, password, done) => {
        let user

        try {
            user = await getUserByEmail(email)
        } catch (error) {
            console.log(error);
        }
        if (user.length == 0){
            //done: error, user, message
            return done(null, false, {message: 'No user with that email.'})
        }
        console.log("USER", user[0].password);


        try {
            if (await bcrypt.compare(password, user[0].password)){
                return done(null, user, { message: 'Correct Logon' })
            }
            else {
                return done(null, false, { message: 'Password incorrect.' })
            }
        } catch (error) {
            console.log(error);
            return done(error)
        }
    }


    passport.use(new LocalStrategy({usernameField: 'email'},authenticateUser))
    passport.serializeUser((user, done) => done(null, user[0].id))
    passport.deserializeUser((id, done) => { 
        return done(null, getUserById(id))
     })
}

module.exports = initialize