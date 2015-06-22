var passport = require('passport'),
var GoodreadsStrategy = require('passport-goodreads');

var User = require('../models/users');
var configAuth = require('./configAuth');

module.exports = function(app, passport){

	//SerializeUser
	passport.serializeUser(function (user, done){
		return done(null, user.id);
	});
	//DeSerializeUser
	passport.deserializeUser(function (id, done){
		User.findById(id, function (err, user){
			done(err, user);
		})
	});
	passport.use('goodreads', new GoodreadsStrategy({
		clientID     : configAuth.goodreadsAuth.clientID,
        clientSecret  : configAuth.goodreadsAuth.clientSecret,
        callbackURL     : configAuth.goodreadsAuth.callbackURL
	}));

	function (token, tokenSecret, profile, done){
		process.nextTick(function(){
			User.findOne({ 'goodreads.id' : profile.id }, function(err, user) {
                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);
                // if the user is found then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user, create them
                    var newUser                 = new User();
                    newUser.goodreads.id          = profile.id;
                    newUser.goodreads.token       = profile.id;
                    newUser.goodreads.name    = profile._json.name;
                    newUser.goodreads.img = profile.image;
                    // save our user into the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
		})
	}
}