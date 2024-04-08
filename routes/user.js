const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { saveRediectUrl, isLoggedIn } = require("../utils/middleware");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing.js");
const { storage } = require("../cloudConfig.js");
const multer = require("multer");
const upload = multer({ storage });

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
  })
);

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post("/signup", async (req, res) => {
  try {
    let { email, username, password, confirmPassword } = req.body;
    if (confirmPassword !== password) {
      throw new ExpressError(
        500,
        "Password and Confirm Password should be same"
      );
    }
    const newUser = new User({ email: email, username: username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", `Welcome to WanderLust, ${username}`);
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
});

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  saveRediectUrl,
  passport.authenticate("local", {
    // A middleware that is used to authenticate the data entered by the user
    failureRedirect: "/login", // If authentication fails then where to redirect
    failureFlash: true, // If authentication fails then whether to flash message or not
  }),
  wrapAsync(async (req, res) => {
    let { username } = req.body;

    let redirectUrl = res.locals.redirectUrl
      ? res.locals.redirectUrl
      : "/listings";

    req.flash("success", `Welcome back, ${username}`);
    res.redirect(redirectUrl);
  })
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("error", "You are Logged Out!");
    res.redirect("/listings");
  });
});

router.get(
  "/search",
  wrapAsync(async (req, res) => {
    let toSearch = "";
    let searchWords = req.query.searchValue.split(" ");

    for (let i = 0; i < searchWords.length; i++) {
      let x = searchWords[i].substring(0, 1);

      if (searchWords[i].length > 3) {
        x = x.toUpperCase();
      }

      x += searchWords[i].substring(1);
      toSearch += " " + x;
    }
    toSearch = toSearch.trim();

    if (!toSearch || toSearch.length < 2) {
      req.flash("error", "Please enter a valid keyword");
      return res.redirect("/listings");
    }

    let allListings = await Listing.find({ location: toSearch });
    let country = await Listing.find({ country: toSearch });
    let title = await Listing.find({ title: toSearch });

    toSearch = toSearch.toLowerCase();
    let category = await Listing.find({ category: toSearch });

    if (country && country.length > 0) {
      for (let i = 0; i < country.length; i++) {
        allListings.push(country[i]);
      }
    }

    if (title && title.length > 0) {
      for (let i = 0; i < title.length; i++) {
        allListings.push(title[i]);
      }
    }

    if (category && category.length > 0) {
      for (let i = 0; i < category.length; i++) {
        allListings.push(category[i]);
      }
    }

    if (!allListings || allListings.length == 0) {
      throw new Error(
        "No rooms available at this location. Try with some other location or keyword."
      );
    }
    req.flash("success",'Your search results');
    res.render("listings/index.ejs", { allListings });
  })
);

router.post(
  "/changePass",
  wrapAsync(async (req, res,next) => {
    console.log(req.body);
    res.locals.currUser.changePassword(
      req.body.userPass,
      req.body.userNewPass,
      function (err) {
        if (err) {
          req.flash("error", `Ooops!! ${err.message}`);
          res.redirect("/listings");
          // next(err);
        } else {
          req.flash("success", "Password changed successfully!");
          res.redirect("/listings");
        }
      }
    );
  })
);

router.get("/editprofile", (req, res) => {
  res.render("users/editprofile.ejs", { user: res.locals.currUser });
});

router.post(
  "/editprofile",
  isLoggedIn,
  upload.single("editPhoto"),
  wrapAsync(async (req, res) => {
    let { editUsername, editEmail } = req.body;
    console.log(req.body);

    let editedUser = await User.findByIdAndUpdate(
      res.locals.currUser.id,
      { username: editUsername, email: editEmail },
      { runValidators: true, new: true }
    );

    if (typeof req.file != "undefined") {
      editedUser.profilephoto = {
        filename: req.file.filename,
        url: req.file.path,
      };
    }
    let result = await editedUser.save();
    console.log(result);
    req.flash("success", "User Updated Successfully!");
    res.redirect(`/listings`);
  })
);


module.exports = router;
