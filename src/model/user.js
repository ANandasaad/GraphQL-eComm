import mongoose from "mongoose";
import { model } from "mongoose";
import Order from "./order.js";

const userSchema= new  mongoose.Schema({
    name:String,
    username:String,
    email:String,
   
})

const User = mongoose.model('User', userSchema);

export default User;