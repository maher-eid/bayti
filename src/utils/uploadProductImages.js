import { supabase } from '../lib/supabase.js';

export async function uploadProductImages(files) {
  const publicUrls = [];

  for (const file of files) {
    const fileExt = file.name.split('.').pop();
    const safeName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '-');
    const fileName = `${Date.now()}-${safeName}-${Math.random().toString(36).slice(2, 9)}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error } = await supabase.storage
      .from('products')
      .upload(filePath, file);

    if (error) {
      throw error;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('products').getPublicUrl(filePath);

    publicUrls.push(publicUrl);
  }

  return publicUrls;
}