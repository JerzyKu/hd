const User = require('../models/user')
const bcrypt = require('bcrypt')

async function  checkNotAuthenticated() {
    
    userCount = await User.count()

    console.log("User count: ", userCount )
    if(userCount == 0){
        console.log("Find no Users.");
        console.log("Creating new user...");

        const email = "w@w"
        const password = "www"
        let hashedPassword

        try {
            hashedPassword = await bcrypt.hash(password, 10)
            const user = new User({
                email: email,
                password: hashedPassword
            })
            const newUser = await user.save()
            console.log("Created user:");
            console.log("email: ", email);    
            console.log("password: ", password);
            console.log('object: ', newUser);
        } catch (err) {
            console.log(err);
        }
    }
}
module.exports = checkNotAuthenticated
  