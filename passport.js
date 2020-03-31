const LocalStrategy = require("passport-local").Strategy;
const googleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./Models/User");
const GUser = require("./Models/googleUser");


module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((user, done) => {
        done(null, user);
    })

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },(username, password, done) => {
        console.log("passport, ", username, password);
        User.findOne({email: username}, (err, doc) => {
            if(err) return done(err);
            else {
                if(doc) {
                    const valid = doc.comparePassword(password, doc.password);
                    if(valid) {
                        return done(null, doc);
                    } else {
                        return done(null, false);
                    }
                } else {
                    return done(null, false);
                }
            }
        });
    }));

    passport.use(new googleStrategy({
        callbackURL: '/auth/google/redirect',
        clientID: '193842486095-pbq4eap3iu4u698t5gitrq9eov9fi8bm.apps.googleusercontent.com',
        clientSecret: 'EG4oIU3dTldV8kApTG5FWhxI'
    }, (accessToken, refreshToken, profile, cb) => {

        GUser.findOne({googleId: profile.id}).then((currentUser) => {
            if(currentUser) {
                console.log("User is", currentUser);
                return cb(null, currentUser);
            } else {
                let username = profile.displayName.replace(".", "");
                username = username.split(" ").join("_");
        
                new GUser({
                    username: username,
                    googleId: profile.id
                }).save().then((newUser) => {
                    console.log("new User created", newUser);
                    return cb(null, newUser);
                }).catch(err => {
                    return cb(err);
                });
            }
        }).catch(err => {
            return cb(err);
        });

    }));   

}