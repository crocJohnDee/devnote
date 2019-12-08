const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

// Root route
router.get("/", (req, res) => {
    res.render("landing");
});
// Register Form route
router.get("/register", (req, res) => {
    res.render("register");
});
// Handle sign up Logic  route
router.post("/register", (req, res) => {
    const newUser = new User(
        { username: req.body.username }
    );
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            return res.render("register", { "error": err.message });
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", `Welcome to Yelpcamp ${user.username}`);

            res.redirect("/campgrounds");
        })
    });
});

// LOGIN FORM route
router.get("/login", (req, res) => {
    res.render("login");
});
// HANDLE LOGIN LOGIC route
router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/campgrounds',
        failureRedirect: '/login',
        failureFlash: 'Invalid username or password.',
        successFlash: `'Welcome back!'`
    })
);
// logout route
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "logged you out");
    res.redirect("/campgrounds");
})

module.exports = router;