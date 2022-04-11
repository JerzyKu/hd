function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      // console.log('asd');
      return next()
    }
    // console.log('denaided');
    res.redirect('/login')
  }

module.exports = checkAuthenticated