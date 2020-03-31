const express = require('express');
const auth = require("./Routes/auth");
const mongoose = require("mongoose");
const session = require("express-session");
const User = require("./Models/User");
const passport = require("passport");

require("./passport")(passport);


mongoose.connect('mongodb+srv://dhoop:dhoop@cluster0-sabsc.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(res => {
    console.log("Connected");
}).catch(err => {
    console.log("Error in connection", err);
    process.exit(1);
});

const app = express();

app.use('/assets', express.static(__dirname + "/assets"));
app.use(require("body-parser").urlencoded({ extended: false }));
app.use(require("body-parser").json());

app.use(session({
    secret: 'thesecret',
    saveUninitialized: 'false',
    resave: false
}))

app.use(passport.initialize());
app.use(passport.session());


app.use("/auth", auth);

app.get("/users", (req, res) => {

    User.find({}, (err, result) => {
        if (err) throw err;
        res.json({ data: result });
    });

});


const loggedIn = (req, res, next) => {
    console.log(req.isAuthenticated());
    if(req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/auth/login");
    }
}

app.get("/", loggedIn, (req, res) => {
    return res.sendFile(__dirname + "/Pages/home.html");
});

app.listen(3000, () => {
    console.log("Server is listening on PORT 3000");
});