const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  flash = require("connect-flash"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  Campground = require("./models/campground"),
  User = require("./models/user"),
  methodOverride = require("method-override");


// requring routes
const
  campgroundRoutes = require("./routes/campgrounds"),
  authRoutes = require("./routes/index");

const url = process.env.DATABASEURL || "mongodb://localhost/devnot2"
//*****************************************************
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}).then(() => console.log("connected to db.."))
  .catch(err => console.log(`ERROR: ${err}`));
//*****************************************************

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(`${__dirname}/public`));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); // Seed the database

// PASSPORT CONFIG
app.use(require("express-session")({
  secret: "some secret string",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// Add currentUser to all views
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error")
  res.locals.success = req.flash("success")
  next();
});

app.use(authRoutes);
app.use("/campgrounds", campgroundRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on port: ${port}`);
});

// ===================================================
//if(err){
  //   req.flash("error", err.message);
  //   return res.redirect("/register");
  // }
  // ===================================================
