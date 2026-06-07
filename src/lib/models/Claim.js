import mongoose from 'mongoose';

const ClaimSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
    required: false // Claims can be unlinked if manual entry
  },
  // B2B: Claims are assigned to internal adjusters
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Patient details (ingested via API or Manual Entry)
  patientName: { type: String, required: true },
  patientEmail: { type: String, required: true },
  
  claimAmount: { type: Number, required: true },
  approvedAmount: { type: Number },
  description: { type: String, required: true },
  documentUrl: { type: String, required: true },
  
  status: {
    type: String,
    enum: ['pending', 'in_review', 'approved', 'rejected', 'flagged'],
    default: 'pending'
  },
  
  // Fraud/Risk Flags
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  },
  riskNotes: [String],
  
  // Internal Adjudication
  internalNotes: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note: String,
    createdAt: { type: Date, default: Date.now }
  }],

  // Financial Payouts
  payoutStatus: {
    type: String,
    enum: ['unpaid', 'pending', 'processing', 'settled'],
    default: 'unpaid'
  },
  payoutReference: String,
  settledDate: Date,

  // Audit Trail for full traceability
  auditTrail: [{
    action: String,
    fromStatus: String,
    toStatus: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note: String,
    timestamp: { type: Date, default: Date.now }
  }],
  
  submissionDate: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now }
});

// Update timestamp on save
ClaimSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

const Claim = mongoose.models.Claim || mongoose.model('Claim', ClaimSchema);

export default Claim;
