import cloudinary from '@/lib/cloudinary';

export const uploadImage = async (file: File, folderName: string): Promise<string | null> => {
  try {
    const arrayBuffer = await file.arrayBuffer(); // convert File to ArrayBuffer
    const buffer = Buffer.from(arrayBuffer);       // convert ArrayBuffer to Node Buffer
    // Cloudinary upload via stream
    const streamUpload = () =>
      new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: folderName },
          (error, result) => {
            if (error || !result) reject(error);
            else resolve(result.secure_url);
          }
        );
        uploadStream.end(buffer);
      });

    return await streamUpload();
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return null;
  }
};
