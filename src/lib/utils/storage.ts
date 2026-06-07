import fs from 'fs/promises';
import path from 'path';
import supabase from './supabase';

export async function uploadFile(file: File): Promise<string> {
  const fileName = `${Date.now()}-${file.name}`;
  const storageType = process.env.STORAGE_TYPE || (process.env.SUPABASE_URL?.includes('your-supabase-url') ? 'local' : 'supabase');

  if (storageType === 'local') {
    console.log('Using local storage for upload');
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Ensure uploads directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, buffer);
    
    return `/uploads/${fileName}`;
  } else {
    console.log('Using Supabase storage for upload');
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'claims';
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) {
      console.error('Supabase upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  }
}
