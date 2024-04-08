const express = require("express");
const router = express.Router(); // Use this and replace all the router.get or router.post as router.get and router.post

const Listing = require("../models/listing.js");
const { listingSchema } = require("../schemaValidation");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isOwner } = require("../utils/middleware.js");
const { storage } = require("../cloudConfig.js");

// Useing multer to pass file
const multer = require("multer");
// const upload =multer({dest:"uploads/"});   //to store the file in local users machine in uploads folder
const upload = multer({ storage });

// Map-box
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding.js");
const Review = require("../models/review.js");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
  })
);

router.get("/mylocations",wrapAsync(async(req,res)=>{
  let allListings= await Listing.find({owner : res.locals.currUser._id});
  res.render("listings/index.ejs", { allListings });
}));

router.get("/reviewedlocation",wrapAsync(async(req,res)=>{
  let review= await Review.find({ createdBy : res.locals.currUser._id});
  let allListings=await Listing.find({"reviews": {$in: review}});
  console.log(allListings);
  res.render("listings/index.ejs", { allListings });
}));

router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

router.post(
  "/",
  isLoggedIn,
  upload.single("image"),
  validateListing,
  wrapAsync(async (req, res) => {

    // Geocoding
    let response = await geocodingClient
      .forwardGeocode({   //converts text location to geographical coordinates (lattitude, longitude)
        query: req.body.location + " " +req.body.country,  //text location
        limit: 1,  // how many ans it stores (can have more than one coordinate of a location)
      })
      .send();

    const { title, description, price, location, country, gst ,category } = req.body;
    const newList = new Listing({
      title: title,
      description: description,
      price: price,
      location: location,
      country: country,
      owner: res.locals.currUser._id,
      gst: gst,
      category: category,
    });

    newList.geometry=response.body.features[0].geometry;

    if (typeof req.file != "undefined") {
      newList.image = {
        filename: req.file.filename,
        url: req.file.path,
      };
    }
    // console.log("Req.file----> ", req.file);
    let result= await newList.save();
    console.log(result);

    // Flash message---
    req.flash("success", "New Location Added Successfully!");
    res.redirect("/listings");
  })
);

// Show Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    let singleList = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "createdBy" } })
      .populate("owner");
    console.log(singleList);
    if (!singleList) {
      req.flash("error", "Location you want to access doesn't exist!");
      res.redirect("/listings");
    }
    // console.log(singleList);
    res.render("listings/show.ejs", { singleList });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    let singleList = await Listing.findById(id);
    if (!singleList) {
      req.flash("error", "Location you want to edit doesn't exist!");
      return res.redirect("/listings");
    }

    res.render("listings/edit.ejs", { singleList });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("image"),
  validateListing,
  wrapAsync(async (req, res) => {
    let response = await geocodingClient
      .forwardGeocode({  
        query: req.body.location + " " +req.body.country,  
        limit: 1,  
      })
      .send();

    const { id } = req.params;
    const { title, description, price, location, country, gst ,category} = req.body;
    let updatedList = await Listing.findByIdAndUpdate(
      id,
      {
        title: title,
        description: description,
        price: price,
        location: location,
        country: country,
        owner: res.locals.currUser._id,
        gst:gst,
        category: category,
      },
      { runValidators: true, new: true }
    );

    // If a new image file is uploaded
    if (typeof req.file != "undefined") {
      updatedList.image = {
        filename: req.file.filename,
        url: req.file.path,
      };
    }
    updatedList.geometry=response.body.features[0].geometry;
    await updatedList.save();
    console.log(updatedList);
    req.flash("success", "Location Updated Successfully!");
    res.redirect(`/listings/${id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id).then((res) => {
      console.log(res);
    });
    req.flash("error", "Location Deleted!");
    res.redirect("/listings");
  })
);

module.exports = router;
