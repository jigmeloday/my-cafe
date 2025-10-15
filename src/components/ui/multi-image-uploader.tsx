'use client';
import { useState } from 'react';
import Image from 'next/image';

function MultiImageUploader() {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    setImages(prev => [...prev, ...filesArray]);
    const previewUrls = filesArray.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...previewUrls]);
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Upload Box */}
      <label className="w-full flex flex-col items-center justify-center min-h-[180px] border-2 border-dashed border-primary-500 rounded-lg cursor-pointer transition-colors p-6">
        <p className="text-primary-500 mb-2 text-center">
          Click or drag images here to upload
        </p>
        <p className="text-sm text-gray-500">Supports multiple images</p>
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFilesChange}
        />
      </label>

      {/* Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-10 gap-4">
          {previews.map((src, index) => (
            <div key={index} className="relative group rounded-md overflow-hidden">
              <Image
                src={src}
                alt={`preview ${index}`}
                width={300}
                height={300}
                className="object-cover h-30 w-full"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 bg-primary-500 cursor-pointer text-white w-6 h-6 rounded-full flex items-center justify-center hover:scale-110 transition duration-500 ease-in-out"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MultiImageUploader;
