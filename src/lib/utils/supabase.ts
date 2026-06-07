import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Initialize Supabase client with error checking
let supabase: SupabaseClient;

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';

try {
  // Check if environment variables are set and look like real URLs
  const isValidUrl = supabaseUrl && supabaseUrl.startsWith('http');
  
  if (!isValidUrl || !supabaseKey) {
    throw new Error('Supabase URL or Key is missing or invalid');
  }
  
  // Initialize Supabase client
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  
  console.log('Supabase client initialized');
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  // Create a mock client that throws errors when methods are called
  supabase = {
    storage: {
      getBucket: () => Promise.reject(new Error('Supabase not properly initialized')),
      createBucket: () => Promise.reject(new Error('Supabase not properly initialized')),
      from: () => ({
        upload: () => Promise.reject(new Error('Supabase not properly initialized')),
        download: () => Promise.reject(new Error('Supabase not properly initialized')),
        getPublicUrl: () => ({ data: { publicUrl: '' }, error: new Error('Supabase not properly initialized') })
      })
    }
  } as unknown as SupabaseClient;
}

// Function to initialize Supabase and ensure bucket exists
export async function initSupabase() {
  const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'claims';
  
  if (!supabaseUrl || !supabaseKey) {
    return { error: 'Missing environment variables' };
  }
  
  try {
    const { data: bucketData, error: bucketError } = await supabase.storage.getBucket(bucketName);
    
    if (bucketError) {
      if (bucketError.message.includes('not found')) {
        const { error: createError } = await supabase.storage.createBucket(bucketName, { public: true });
        
        if (createError) {
          return { error: `Failed to create bucket: ${createError.message}` };
        } else {
          return { success: true, message: 'Bucket created successfully' };
        }
      }
      return { error: `Bucket check failed: ${bucketError.message}` };
    } else {
      return { success: true, message: 'Bucket exists' };
    }
  } catch (error: any) {
    return { error: `Initialization error: ${error.message}` };
  }
}

export default supabase;
