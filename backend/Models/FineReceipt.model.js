import mongoose from 'mongoose';

const FineReceiptSchema = new mongoose.Schema({
  vehicleNumber: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  issueDate: { type: Date, required: true },
  section: { type: String, required: true },
  fileUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const FineReceipt = mongoose.model('FineReceipt', FineReceiptSchema);

export default FineReceipt;
