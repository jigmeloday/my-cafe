'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ImageUploaderProps } from '../../../types';
import { X } from 'lucide-react';

export default function ImageUploader({
  onChange,
  value = null,
  previewUrl,
  label = 'Upload Image',
  className = '',
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (previewUrl) {
      setPreview(previewUrl as string);
    }
  }, []);

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
        <div className="relative h-[200px] w-[300px] border-2 border-dashed border-primary-500 rounded-lg flex items-center justify-center hover:bg-primary-50 transition">
          {preview && (
            <div
              className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary-500 flex items-center justify-center cursor-pointer z-10"
              onClick={() => {
                setPreview(null);
                onChange(null);
              }}
            >
              <X className="text-white" size={14} />
            </div>
          )}
          {preview ? (
            <Image
              height={300}
              width={300}
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <div className="flex items-center justify-center">
              <span className="text-primary-500 text-[14px]">{label}</span>
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
