import mongoose from 'mongoose';

const OrganizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  // B2B Branding
  branding: {
    primaryColor: { type: String, default: '#4B56D2' },
    secondaryColor: { type: String, default: '#82C3EC' },
    logoUrl: { type: String }
  },
  // API Integration
  apiKey: {
    type: String,
    unique: true,
    sparse: true // Only for organizations using API ingestion
  },
  // Policy Rules
  policyRules: [{
    category: String,
    maxAmount: Number,
    description: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Organization = mongoose.models.Organization || mongoose.model('Organization', OrganizationSchema);

export default Organization;
