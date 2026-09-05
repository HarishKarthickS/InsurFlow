/**
 * Test script for Supabase connectivity and file listing
 * Usage: node scripts/test-supabase.js
 */

const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Check for required environment variables
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY', 'SUPABASE_STORAGE_BUCKET'];
const missingEnvVars = requiredEnvVars.filter(variable => !process.env[variable]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  console.error('Please check your .env file and ensure all Supabase configuration is set.');
  process.exit(1);
}

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const bucketName = process.env.SUPABASE_STORAGE_BUCKET;

console.log(`🔍 Testing Supabase connectivity with URL: ${supabaseUrl}`);
console.log(`🪣 Bucket name: ${bucketName}`);

// Create the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to test Supabase connectivity and list files
async function testSupabase() {
  try {
    // First, test basic connectivity by listing buckets
    console.log('\n📋 Listing all buckets...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('❌ Error listing buckets:', bucketsError.message);
      return;
    }
    
    console.log(`✅ Successfully connected to Supabase! Found ${buckets.length} buckets:`);
    buckets.forEach((bucket, index) => {
      console.log(`   ${index + 1}. ${bucket.name}`);
    });
    
    // Check if our bucket exists
    const bucketExists = buckets.some(bucket => bucket.name === bucketName);
    if (!bucketExists) {
      console.error(`❌ Bucket '${bucketName}' does not exist!`);
      console.log('Available buckets:', buckets.map(b => b.name).join(', '));
      return;
    }
    
    console.log(`\n✅ Bucket '${bucketName}' exists`);
    
    // List files in the root of the bucket
    console.log('\n📋 Listing files in bucket root...');
    const { data: rootFiles, error: rootError } = await supabase.storage
      .from(bucketName)
      .list();
      
    if (rootError) {
      console.error('❌ Error listing files in bucket root:', rootError.message);
    } else if (rootFiles.length === 0) {
      console.log('   (No files in bucket root)');
    } else {
      rootFiles.forEach((item, index) => {
        if (item.id) { // File
          console.log(`   ${index + 1}. 📄 ${item.name}`);
        } else { // Folder
          console.log(`   ${index + 1}. 📁 ${item.name}/`);
        }
      });
    }
    
    // List files in the 'claims' folder if it exists
    const claimsFolder = rootFiles?.find(item => !item.id && item.name === 'claims');
    
    if (claimsFolder) {
      console.log('\n📋 Listing files in claims folder...');
      const { data: claimFiles, error: claimError } = await supabase.storage
        .from(bucketName)
        .list('claims');
        
      if (claimError) {
        console.error('❌ Error listing files in claims folder:', claimError.message);
      } else if (claimFiles.length === 0) {
        console.log('   (No files in claims folder)');
      } else {
        console.log(`   Found ${claimFiles.length} files in claims folder:`);
        claimFiles.forEach((file, index) => {
          console.log(`   ${index + 1}. 📄 ${file.name}`);
        });
      }
    } else {
      console.log('\n⚠️ No claims folder found in bucket');
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    console.error(err.stack);
  }
}

// Run the test
testSupabase(); 