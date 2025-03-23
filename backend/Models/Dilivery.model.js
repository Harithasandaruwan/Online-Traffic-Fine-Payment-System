import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    petId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    userId: {
        type: String,
        required: true,
        trim: true
    },
    dilivery_id: {
        type: String,
        required: true,
        trim: true
    },
 
    fine_id : {
        type: String,
        required: true,
        trim: true
    },
    delivery_type : {
        type: String,
        required: true,
        trim: true
    },
    tracking_id : {
        type: String,
        required: true,
        trim: true
    },
    delivery_status : {
        type: String,
        required: true,
        trim: true
    },
    expected_delivery_date : {
        type: String,
        required: true,
        trim: true
    },
  
 
    
   
  
  
}, { timestamps: true });

const Dilivery = mongoose.model("Dilivery", itemSchema);

export default Dilivery;
