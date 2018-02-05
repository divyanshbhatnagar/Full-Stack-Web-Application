var express = require("express");

var router = express.Router({mergeParams: true});

var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middleware = require("../middleware");

//COMMENTS ROUTES


router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: campground});        
        }
    });
    
});

//new comment
router.post("/",  middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id, function(err, campground) {
        if(err){
            req.flash("error", "Campground not found");

            res.redirect("/campgrounds");
        }else{ 
            Comment.create(req.body.comments, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong");
                }else{
                // add username and id to comment
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                comment.save();
                campground.comments.push(comment);
                campground.save();
                req.flash("success", "Successfully added comment");
                res.redirect("/campgrounds/" + campground._id);
                } 
            });
        }
    });
});



//EDIT COMMENT
router.get("/:comment_id/edit", middleware.checkCommentOwner,function(req, res){
   Comment.findById(req.params.comment_id, function(err, comment) {
      if(err){
          console.log(err);
      }else{
          res.render("comments/edit", {campground_id: req.params.id, comment: comment});
      } 
   }); 
});

//Update Comment

router.put("/:comment_id", middleware.checkCommentOwner, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comments, function(err, comment){
      if(err){
          res.redirect("back")
      }else{
          req.flash("success", "Comment updated");
          res.redirect("/campgrounds/" + req.params.id);
      }
   });
});

//Delete Comment
router.delete("/:comment_id", middleware.checkCommentOwner, function(req, res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err, comment){
       if(err){
           req.flash("error", "Something went wrong");
           res.redirect("back");
       }else{
           req.flash("success", "Comment Deleted");
            res.redirect("/campgrounds/" + req.params.id);     
       }
   }); 
});




module.exports = router;