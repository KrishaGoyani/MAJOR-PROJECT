const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js")
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const multer  = require('multer')
const { storage } = require("../cloudConfig.js")
const upload = multer({ storage });

const listingController = require("../controllers/listings.js");

router
.route("/")
// index route
    .get(wrapAsync(listingController.index))
    //6. Create Route
.post(
    isLoggedIn, 
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing));
    
    //6.New Route
    router.get("/new", isLoggedIn, listingController.renderNewForm);
    
    router
    .route("/:id")
    .get( wrapAsync(listingController.showListing))
    .put(
        isLoggedIn, 
        isOwner,
        upload.single("listing[image]"),
        validateListing,
wrapAsync(listingController.updateListing))
.delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing));

// // Show route
// router.get("/:id", wrapAsync(listingController.showListing));

//7. edit route
router.get("/:id/edit",
    isLoggedIn,
    isOwner, 
    wrapAsync(listingController.renderEditForm));

// // 7. Update route
// router.put("/:id",
//     isLoggedIn, 
//     isOwner,
//     validateListing,
// wrapAsync(listingController.updateListing));

// // 8.Delete route
// router.delete("/:id",
//     isLoggedIn,
//     isOwner,
//     wrapAsync(listingController.destroyListing));

module.exports = router;