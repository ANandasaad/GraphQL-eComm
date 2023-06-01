import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productId:{type:mongoose.Schema.Types.ObjectId,ref:'Product',required:true},
  rating:{type:String,required:true},
  comment:{type:String,required:true}
});

const Review= mongoose.model('Review',reviewSchema);
export default Review;