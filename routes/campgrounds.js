const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware");

//Index route
router.get("/", (req, res) => {
    Campground.find({}, (err, Allcampgrounds) =>
        err
            ? console.log(err)
            : res.render("campgrounds/index", { campgrounds: Allcampgrounds })
    );
});
// new campground route
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});
// create campground route
router.post("/", middleware.isLoggedIn, (req, res) => {
    const name = req.body.name;
    const price = req.body.price;
    const image = req.body.image;
    const desc = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    }
    const newCampGround = {
        name: name,
        price: price,
        image: image,
        description: desc,
        author: author
    };
    Campground.create(newCampGround, (err, newlyCreated) =>
        err ? console.log(err) : res.redirect("/campgrounds")
    );
});

// SHOW route
router.get("/:id", (req, res) => {
    // find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(
        (err, foundCampGround) => {
            err ? console.log() : res.render("campgrounds/show", { campground: foundCampGround });
        }
    );
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.isLoggedIn, middleware.checkUserCampground, (req, res) => {
    res.render("campgrounds/edit", { campground: req.campground });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    })
    // Redirect somewhere
});

// DESTROY campground route
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res, next) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) return next(err);

        campground.remove();
        res.redirect("/campgrounds");
    })
})


module.exports = router;