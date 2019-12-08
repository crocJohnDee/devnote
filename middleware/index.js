const Campground = require("../models/campground");
const Comment = require("../models/comment");

// all the middleare goes here
let middlewareObj = {};

middlewareObj.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampGround) => {
            const author = foundCampGround.author.id;
            const user = req.user._id;
            if (err) {
                req.flash("error", "Campground not found");
                res.redirect("back");
            } else {
                if (author.equals(user)) {
                    next();
                }
                else {
                    req.flash("error", "You dont have persmission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            const author = foundComment.author.id;
            const user = req.user._id;
            if (err) {
                res.redirect("back");
            } else {
                if (author.equals(user)) {
                    next();
                }
                else {
                    req.flash("error", "You dont have persmission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkUserCampground = (req, res, next) => {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err || !foundCampground) {
            console.log(err);
            req.flash('error', 'Sorry, that campground does not exist!');
            res.redirect('/campgrounds');
        } else if (foundCampground.author.id.equals(req.user._id) || req.user.isAdmin) {
            req.campground = foundCampground;
            next();
        } else {
            req.flash('error', 'You don\'t have permission to do that!');
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
}

middlewareObj.checkUserComment = (req, res, next) => {
    Comment.findById(req.params.commentId, function (err, foundComment) {
        if (err || !foundComment) {
            console.log(err);
            req.flash('error', 'Sorry, that comment does not exist!');
            res.redirect('/campgrounds');
        } else if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
            req.comment = foundComment;
            next();
        } else {
            req.flash('error', 'You don\'t have permission to do that!');
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
}

module.exports = middlewareObj;
