// backend/lib/uploadToSupabase.js
const path = require('path');
const { supabase } = require('./supabaseClient');

async function uploadToSupabase(fileBuffer, originalName, mimeType, folder) {
  if (!supabase) {
    throw new Error('Supabase client is not initialized. Check environment variables.');
  }

  const bucketName = process.env.SUPABASE_BUCKET;
  if (!bucketName) {
    throw new Error('SUPABASE_BUCKET env variable is not set.');
  }

  const ext = path.extname(originalName) || '';
  const uniqueName =
    Date.now().toString() + '-' + Math.random().toString(36).slice(2) + ext;

  const filePath = `${folder}/${uniqueName}`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(filePath, fileBuffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Supabase upload failed: ${uploadError.message}`);
  }

  // Get public URL
  const { data: publicData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  const publicUrl = publicData?.publicUrl;

  return {
    path: filePath,
    publicUrl,
  };
}

module.exports = { uploadToSupabase };
