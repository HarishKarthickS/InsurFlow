import mongoose from 'mongoose';
import User from './models/User.js';
import Organization from './models/Organization.js';
import Provider from './models/Provider.js';
import Claim from './models/Claim.js';
import crypto from 'crypto';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/claims-management';

async function seed(retries = 3) {
  try {
    console.log(`🌱 Starting Comprehensive B2B Seeding...`);
    
    while (retries > 0) {
      try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        break;
      } catch (err) {
        retries -= 1;
        console.log(`⚠️ Connection failed. Retries left: ${retries}`);
        if (retries === 0) throw err;
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    // 0. Clear existing data for a clean slate
    console.log('🧹 Clearing existing database...');
    await Organization.deleteMany({});
    await Provider.deleteMany({});
    await User.deleteMany({});
    await Claim.deleteMany({});

    // 1. Create Organizations (Insurance Companies)
    const orgs = await Organization.create([
      {
        name: 'InsurFlow Global',
        slug: 'insurflow',
        apiKey: 'insurflow_master_key_2026',
        branding: { primaryColor: '#4B56D2', secondaryColor: '#82C3EC' },
        policyRules: [
          { category: 'Surgery', maxAmount: 500000, description: 'High-value surgical procedures' },
          { category: 'Dental', maxAmount: 50000, description: 'Routine dental care' }
        ]
      },
      {
        name: 'SafeGuard Assurance',
        slug: 'safeguard',
        apiKey: 'safeguard_secure_key_99',
        branding: { primaryColor: '#059669', secondaryColor: '#34D399' }
      }
    ]);
    const mainOrg = orgs[0];
    console.log('🏢 Created Organizations');

    // 2. Create Providers (Hospitals/Clinics)
    const providers = await Provider.create([
      {
        name: 'City General Hospital',
        slug: 'city-general',
        organizationId: mainOrg._id,
        contactEmail: 'contact@citygeneral.com',
        bankDetails: { accountNumber: '123456789', bankName: 'Standard Bank' }
      },
      {
        name: 'Elite Dental Clinic',
        slug: 'elite-dental',
        organizationId: mainOrg._id,
        contactEmail: 'billing@elitedental.com'
      }
    ]);
    const hospital = providers[0];
    const dental = providers[1];
    console.log('🏥 Created Providers');

    // 3. Create Users
    const users = await User.create([
      // InsurFlow Staff
      { name: 'Global Admin', email: 'admin@insurflow.com', password: 'password', role: 'admin', organizationId: mainOrg._id },
      { name: 'Ops Manager', email: 'manager@insurflow.com', password: 'password', role: 'manager', organizationId: mainOrg._id },
      { name: 'Senior Adjuster', email: 'adjuster@insurflow.com', password: 'password', role: 'adjuster', organizationId: mainOrg._id },
      
      // Hospital Staff
      { name: 'Hospital Admin', email: 'admin@citygeneral.com', password: 'password', role: 'provider_admin', organizationId: mainOrg._id, providerId: hospital._id },
      { name: 'Billing Desk', email: 'staff@citygeneral.com', password: 'password', role: 'provider_staff', organizationId: mainOrg._id, providerId: hospital._id }
    ]);
    const admin = users[0];
    const adjuster = users[2];
    console.log('👤 Created Users');

    // 4. Create Sample Claims (Variety of states)
    const sampleClaims = [
      {
        organizationId: mainOrg._id,
        providerId: hospital._id,
        assignee: adjuster._id,
        patientName: 'Alice Johnson',
        patientEmail: 'alice@example.com',
        claimAmount: 125000,
        description: 'Major Cardiac Procedure - Emergency bypass surgery.',
        documentUrl: '/uploads/sample-heart.pdf',
        status: 'approved',
        approvedAmount: 120000,
        riskLevel: 'high',
        payoutStatus: 'settled',
        payoutReference: 'SETTLE-CARDIAC-99',
        settledDate: new Date(),
        auditTrail: [
          { action: 'Creation', toStatus: 'pending', user: admin._id, note: 'Ingested via Portal' },
          { action: 'Review', fromStatus: 'pending', toStatus: 'in_review', user: adjuster._id },
          { action: 'Approval', fromStatus: 'in_review', toStatus: 'approved', user: adjuster._id, note: 'Valid medical necessity' }
        ]
      },
      {
        organizationId: mainOrg._id,
        providerId: dental._id,
        patientName: 'Bob Miller',
        patientEmail: 'bob@example.com',
        claimAmount: 65000,
        description: 'Full Mouth Reconstruction & Implants.',
        documentUrl: '/uploads/sample-dental.pdf',
        status: 'flagged',
        riskLevel: 'medium',
        riskNotes: ['Exceeds Dental policy limit of ₹50,000'],
        internalNotes: [{ user: adjuster._id, note: 'Checking if patient has premium dental add-on.' }]
      },
      {
        organizationId: mainOrg._id,
        providerId: hospital._id,
        patientName: 'Charlie Davis',
        patientEmail: 'charlie@example.com',
        claimAmount: 15000,
        description: 'Routine blood tests and outpatient consultation.',
        documentUrl: '/uploads/sample-routine.pdf',
        status: 'pending',
        riskLevel: 'low'
      },
      {
        organizationId: mainOrg._id,
        providerId: hospital._id,
        patientName: 'Diana Prince',
        patientEmail: 'diana@amazon.com',
        claimAmount: 850000,
        description: 'Intensive Care Unit (ICU) - 10 day stay.',
        documentUrl: '/uploads/sample-icu.pdf',
        status: 'in_review',
        riskLevel: 'critical',
        riskNotes: ['Extremely high claim amount (Critical)'],
        auditTrail: [{ action: 'Creation', toStatus: 'pending', user: admin._id }]
      }
    ];

    await Claim.create(sampleClaims);
    console.log('📄 Created Sample Claims');

    console.log('✅ DATABASE FULLY SEEDED WITH SAMPLE DATA!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
