import mongoose from 'mongoose';

const FineReceiptSchema = new mongoose.Schema({
  vehicleNumber: { 
    type: String, 
    required: true 
  },

  licenseNumber: { 
    type: String, 
    required: true 
  },

  issueDate: { 
    type: Date, 
    required: true 
  },

  section: { 
    type: String, 
    required: true 
  },

  fileUrl: { 
    type: String,
    required: true 
  },

  status: { 
    type: String, 
    enum: ["Pending", "Approved", "Rejected"], 
    default: "Pending" 
  },

  createdAt: { 
    type: Date, 
    default: Date.now 
  },
}, { timestamps: true });

const FineReceipt = mongoose.model('fine_receipt', FineReceiptSchema);

export default FineReceipt;