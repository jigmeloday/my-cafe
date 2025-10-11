'use client';
import Image from 'next/image';
import { useState } from 'react';
import { ImageUploaderProps } from '../../../types';

export default function ImageUploader({
  onChange,
  value = null,
  label = "Upload Image",
  className = "",
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <label className="cursor-pointer">
        <div className="h-[200px] w-[300px] border-2 border-dashed border-primary-400 rounded-lg flex items-center justify-center bg-primary-50 hover:bg-primary-100 transition">
          {preview ? (
            <Image
              height={300}
              width={300}
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
           <div className='flex items-center justify-center'>
             <span className="text-primary-500 text-[12px]">{label}</span>
           </div>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
      {value && <p className="text-sm text-gray-400">{value.name}</p>}
    </div>
  );
}