import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name:{type:String,required:true},
  description:{type:String,required:true},
  price:{type:String,required:true},
  category:{type:String,required:true},
  createAt:{type:Date, default:Date.now}
});

const Product = mongoose.model("Product", productSchema);
export default Product;
