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
    fine_id : {
        type: String,
        required: true,
        trim: true
    },
  
    amount  : {
        type: String,
        required: true,
        trim: true
    },
    status  : {
        type: String,
        required: true,
        trim: true
    },
    issue_date  : {
        type: String,
        required: true,
        trim: true
    },
    due_date  : {
        type: String,
        required: true,
        trim: true
    },
    description  : {
        type: String,
        required: true,
        trim: true
    },
    
  
  
}, { timestamps: true });

const Fine = mongoose.model("Find", itemSchema);

export default Fine;
