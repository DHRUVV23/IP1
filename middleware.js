const Listing=require("./models/listing");
const Review = require("./models/review.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema,}=require('./schema.js');

module.exports.isLoggedIn =(req,res,next)=>{

if(!req.isAuthenticated()){   //to check if a user is logged in before doing any specifc thing
  req.session.redirectUrl=req.originalUrl;
  // console.log(req.session.redirectUrl);
    req.flash("error","you must be logged in to create Listing");
    return res.redirect("/login");   
  }
  next();
}  

module.exports.saveRedirectUrl=(req,res,next)=>{  //since is.authorization clear all session objection so
  //to save original url we save res.locals 
  // console.log(req.session.redirectUrl);
  if(req.session.redirectUrl){
    res.locals.redirectUrl=res.session.redirectUrl;
  }
  next();
};

module.exports.isOwner= async (req,res,next)=>{  //to check if a current user is owner of listing
  let { id } = req.params;
  let listing=await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","You are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.validateListing=(req,res,next)=>{   //to validate lisitng using listing schema(server side error handling)
  let {error}=  listingSchema.validate(req.body);
  if(error){
   
    throw new ExpressError(400,error);
  }else{
    next();
  }
};

module.exports.validatereview=(req,res,next)=>{   //to validate review using review schema(server side error handling)
  let {error}=  reviewSchema.validate(req.body);
  if(error){
   
    throw new ExpressError(400,error);
  }else{
    next();
  }
};


module.exports.isReviewAuthor= async (req,res,next)=>{
  let {id, reviewId } = req.params;
  let review=await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","You are not the Author of this REVIEW");
    return res.redirect(`/listings/${id}`);
  }
  next();
};