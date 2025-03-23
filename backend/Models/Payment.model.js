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
    fname:{
        type: String,
        required: true,
        trim: true
    },
    payment_id : {
        type: String,
        required: true,
        trim: true
    },
    finePaymentid : {
        type: String,
        required: true,
        trim: true
    },
    payment_method  : {
        type: String,
        required: true,
        trim: true
    },
    crd_number: {
        type: String||null,
      
        trim: true
    },
    expd_date: {
        type: String||null,
       
        trim: true
    },
    cvv: {
        type: String||null,
       
        trim: true
    },
    amount :{
        type: String||null,
        
        trim: true 
    }
    
   
  
  
}, { timestamps: true });

const Item = mongoose.model("Payments", itemSchema);

export default Item;
