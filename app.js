var express = require("express");

var mongoose = require("mongoose");

var methodOverride = require("method-override");

var app = express();
var bodyParser = require("body-parser");


mongoose.connect("mongodb://localhost/yelp_capmp");

var Campground = require("./models/campground.js"),
    seedDB = require("./seeds.js"),
    User = require("./models/user.js"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    
    Comment = require("./models/comment.js");
    // seedDB(); //seed the db
    
    
var campgroundRoutes = require("./routes/campgrounds.js");
var commentRoutes = require("./routes/comments.js");
var indexRoutes = require("./routes/index.js");
    

app.use(flash());
    
app.use(methodOverride("_method"));
    //PASSPORT CONFIGURATION
app.use(require("express-session")({
    
    secret: "I am the best",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

    
    
    


app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(indexRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("server started!!!");
});