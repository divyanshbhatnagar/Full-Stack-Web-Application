var express = require("express");

var passport = require("passport");

var router = express.Router();

var User = require("../models/user");



router.get("/", function(req, res){
   res.render("landing"); 
});


//AUTHENTICATION ROUTES

router.get("/register", function(req, res) {
   res.render("register"); 
});

router.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            req.flash("error",err.message);
            return res.render("/register");
        
        }else{
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome" + user.username);
               res.redirect("/campgrounds"); 
            });
        }
    });
});

//LOGIN

router.get("/login", function(req, res) {
   res.render("login");
});
router.post("/login",passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: true
}), function(req, res){
    
});

router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged You Out!");
   res.redirect("/");
});


module.exports = router;
