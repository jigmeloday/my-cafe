export const imageUpload = async (image: File | null): Promise<string> => {
  if (!image) return 'Image is invalid';

  try {
    const formData = new FormData();
    formData.append('image', image);
    const response = await fetch('http://localhost:3000/api/image-upload', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Image upload failed');
    }
    return data.logoUrl;
  } catch (error) {
    throw new Error('Image upload failed.');
  }
};
