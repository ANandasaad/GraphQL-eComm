import mongoose from "mongoose";

const inventorySchema= mongoose.Schema({
    name:{type:String, required:true},
    location:{type:String,required:true}
})

const Inventory=mongoose.model('Inventory',inventorySchema);
export default Inventory;