var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var FacebookTokenStrategy = require('passport-facebook-token');
var TwitterTokenStrategy = require('passport-twitter-token');


var mongoose = require('mongoose');
var configAuth = require('./auth');
var util = require('util');
var User = mongoose.model('Users');


passport.use(new LocalStrategy({
        usernameField: 'email'
    },
    function (username, password, done) {
        User.findOne({email: username}, function (err, user) {
            if (err) {
                return done(err);
            }
            // Return if user not found in database
            if (!user) {
                return done(null, false, {
                    message: 'User not found'
                });
            }
            // Return if password is wrong
            if (!user.validPassword(password)) {
                return done(null, false, {
                    message: 'Password is wrong'
                });
            }
            // If credentials are correct, return the user object
            return done(null, user);
        });
    }
));
// used to serialize the user for the session
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});
passport.use(new FacebookStrategy({
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL,
        profileFields: ['id', 'first_name', 'last_name', 'email']
    },
    // facebook will send back the token and profile
    function (accessToken, refreshToken, profile, done) {
        // asynchronous
        process.nextTick(function () {
            // find the user in the database based on their facebook id
            User.findOne({'email': profile.email}, function (err, user) {
                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser = new User();

                    // set all of the facebook information in our user model
                    newUser.facebook_id = profile.id;
                    newUser.firtName = profile.first_name;
                    newUser.lastName = profile.last_name;
                    newUser.email = profile.email; // facebook can return multiple emails so we'll take the first

                    // save our user to the database
                    newUser.save(function (err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }

            });
        });

    }));

passport.use(new FacebookTokenStrategy({
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        profileFields: ['id', 'first_name', 'last_name', 'email', 'picture']
    },
    function (accessToken, refreshToken, profile, done) {
        // asynchronous
        process.nextTick(function () {
            profile = profile["_json"];
            console.log(profile)
            // find the user in the database based on their facebook id
            User.findOne({'email': profile.email}, function (err, user) {
                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {
                    if (user.avatar) {
                        return done(null, user); // user found, return that user
                    } else {
                        user.avatar = util.format('http://graph.facebook.com/%s/picture?type=large', profile.id);
                        user.save(function (err, data) {
                            if (err)
                                throw err;

                            // if successful, return the user
                            return done(null, data);
                        });
                    }

                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser = new User();

                    // set all of the facebook information in our user model
                    newUser.facebook.id = profile.id;
                    newUser.facebook.token = accessToken;
                    newUser.firstName = profile.first_name;
                    newUser.lastName = profile.last_name;
                    newUser.email = profile.email;
                    newUser.avatar = util.format('http://graph.facebook.com/%s/picture?type=large', profile.id);

                    // save our user to the database
                    newUser.save(function (err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }

            });
        });
    }));

passport.use(new TwitterTokenStrategy({

        consumerKey: configAuth.twitterAuth.consumerKey,
        consumerSecret: configAuth.twitterAuth.consumerSecret,
        callbackURL: configAuth.twitterAuth.callbackURL

    },
    function (token, tokenSecret, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Twitter
        process.nextTick(function () {
            profile = profile["_json"];
            User.findOne({'twitter.id': profile.id}, function (err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user, create them
                    var newUser = new User();

                    // set all of the user data that we need
                    newUser.twitter.id = profile.id;
                    // newUser.twitter.token = token;
                    newUser.lastName = '';
                    newUser.firstName = profile.screen_name;
                    newUser.email = profile.id + '@livematch.com';
                    newUser.avatar = profile.profile_image_url;


                    // save our user into the database
                    newUser.save(function (err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });

        });

    }));
// passport.use(new TwitterTokenStrategy({
//         consumerKey: configAuth.twitterAuth.consumerKey,
//         consumerSecret: configAuth.twitterAuth.consumerSecret,
//     }, function (token, tokenSecret, profile, done) {
//         // User.findOrCreate({twitterId: profile.id}, function (error, user) {
//         //     return done(error, user);
//         // });
//         console.log(profile)
//     }
// ));
