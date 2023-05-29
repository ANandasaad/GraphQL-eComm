
import mongoose from "mongoose";

const orderSchema= new mongoose.Schema({
    customerName:String,
    Amount:Number
})

const Order=mongoose.model("Order",orderSchema);
export default Order;