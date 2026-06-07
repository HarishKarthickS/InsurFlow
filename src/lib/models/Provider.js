import mongoose from 'mongoose';

const ProviderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  contactEmail: String,
  phoneNumber: String,
  address: String,
  licenseNumber: String,
  bankDetails: {
    accountNumber: String,
    bankName: String,
    routingNumber: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Provider = mongoose.models.Provider || mongoose.model('Provider', ProviderSchema);

export default Provider;
