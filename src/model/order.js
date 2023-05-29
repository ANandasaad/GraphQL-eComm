
import mongoose from "mongoose";

const orderSchema= new mongoose.Schema({
     customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
     },
     products:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true

     },
     total:{type:Number, required:true},
     createAt:{type:Date, default:Date.now}
})

const Order=mongoose.model("Order",orderSchema);
export default Order;