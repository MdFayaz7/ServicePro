import mongoose from 'mongoose';

const providerSchema = new mongoose.Schema({
  ownerName: { type: String, required: true },
  workshopName: { type: String, required: true },
  mobile: { type: String, required: true },
  address: { type: String, required: true },
  serviceType: { type: String, required: true },
  imageURL: String,
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model('Provider', providerSchema);
