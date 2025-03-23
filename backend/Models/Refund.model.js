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
    ticket_nb: {
        type: String,
        required: true,
        trim: true
    },
    Name: {
        type: String,
        required: true,
        trim: true
    },
    refund_Amount: {
        type: String,
        required: true,
        trim: true
    },
    refund_reason: {
        type: String,
        required: true,
        trim: true
    },
   
   
  
  
}, { timestamps: true });

const Refund = mongoose.model("Refunds", itemSchema);

export default Refund;
