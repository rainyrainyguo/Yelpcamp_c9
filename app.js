var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    Campground = require("./models/campground"),
    seedDB     = require("./seeds"),
    Comment    = require("./models/comment"),
    flash = require("connect-flash"),
    passport   = require("passport"),
    LocalStrategy = require("passport-local"),
    User       = require("./models/user"),
    methodOverride = require("method-override");
    
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");
 
//mongoose.connect("mongodb+srv://rainy:rainy003232@cluster0-a27g2.mongodb.net/yelpcamp?retryWrites=true") //mongo lab version (internet)
mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser:true}); //local mongodb
const port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //seed the database

//  PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Rusty is the best dog in the world",
    resave: false,
    saveUninitialized: false
}));

app.locals.moment = require('moment');
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

 
app.listen(port, () => {
    console.log(`The YelpCamp server is listening on port ${port}`);
})

