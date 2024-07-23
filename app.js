if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}


const express = require ("express");
const app = express();
const mongoose = require('mongoose');
const Listing = require("./models/listing.js")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema , reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStratergy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./Routes/listing.js")
const reviewRouter = require("./Routes/review.js")
const userRouter = require("./Routes/user.js")

const dbUrl = process.env.ATLASDB_URL;


app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname, "public" )));

const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", err);
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 *60 * 60 * 1000,
        maxAge: 7 * 24 *60 * 60 * 1000,
        httpOnly: true
    }
};


main()
    .then(() => {
        console.log("Connect to DB");
    })
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}
// app.get("/", (req,res) => {
//     res.send("root is working");
// });



app.use(session(sessionOptions));
app.use(flash());

// 57.-7 configuring statergy
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User ({
//         email: "abc@gmail.com",
//         username: "delta-student"
//     })
//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// app.get("/testlisting", async (req,res) => {
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         descreption: "By the fort",
//         price: 1200,
//         location: "Jodhpur",
//         country: "India"
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("Successful testing");
// });

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Note Found!!!"));
});

app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something went wrong"} = err;
    res.status(statusCode).render("error.ejs", {message});
    // res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("server is listening on port 8080");
});