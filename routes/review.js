const express = require("express");
const router = express.Router({mergeParams: true}); // Use this and replace all the router.get or router.post as router.get and router.post

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schemaValidation");
const Review = require("../models/review.js");
const { isLoggedIn, isReviewAuthor } = require("../utils/middleware.js");



const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
      throw new ExpressError(400, error);
    } else {
      next();
    }
  };

// Reviews
// Post Review Route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.createdAt = Date.now();
    newReview.createdBy = req.user._id;
    listing.reviews.push(newReview);
    // console.log(listing);

    let result = await newReview.save();
    await listing.save();
    console.log(result);
    req.flash("success","New Review Created!");
    res.redirect(`/listings/${id}`);
  })
);

// Delete Review Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    // pull will find a particular value and remove it  
    // In the listing the review with reviewId is removed
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    await Review.findByIdAndDelete(reviewId);
    req.flash("error","Review Deleted!");
    res.redirect(`/listings/${id}`);
  })
);

module.exports= router;
