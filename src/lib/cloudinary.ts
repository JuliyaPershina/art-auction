import { v2 as cloudinary } from 'cloudinary';
import { env } from '@/env';

// 🔧 config
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

// 🗑 delete image
export async function deleteImageFromCloudinary(publicId: string) {
  try {
    /**
     * publicId має бути таким, як у Cloudinary:
     * art-auction/abc123
     */
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (err) {
    console.error('Cloudinary deletion error:', err);
    throw new Error('Failed to delete image from Cloudinary');
  }
}

export { cloudinary };



