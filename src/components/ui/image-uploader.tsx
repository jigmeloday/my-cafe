'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ImageUploaderProps } from '../../../types';
import { Upload, X } from 'lucide-react';

export default function ImageUploader({
  onChange,
  value = null,
  previewUrl,
  label = 'Upload Image',
  className = '',
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(previewUrl || null);
  const [error, setError] = useState<string | null>(null);

  const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
  const maxFileSize = 8 * 1024 * 1024; // 10MB

  // ✅ If previewUrl changes (e.g., existing logo), update preview
  useEffect(() => {
    if (previewUrl && typeof previewUrl === 'string') {
      setPreview(previewUrl);
    }
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      setError('Only JPG, PNG, or SVG files are allowed.');
      e.target.value = '';
      return;
    }

    if (file.size > maxFileSize) {
      setError('File size must be less than 10MB.');
      e.target.value = '';
      return;
    }

    setError(null);

    // ✅ Preview new file immediately
    const newPreview = URL.createObjectURL(file);
    setPreview(newPreview);
    onChange(file);
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onChange(null);
  };

  return (
    <div className={`flex flex-col w-full justify-center items-center gap-2 ${className}`}>
      <label className="cursor-pointer w-[50%]">
        <div className="relative h-[300px] border-2 border-dashed border-primary-500 rounded-lg flex items-center justify-center hover:bg-primary-50/10 transition">
          {preview && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary-500 flex items-center justify-center cursor-pointer z-10"
            >
              <X className="text-white" size={14} />
            </button>
          )}

          {preview ? (
            <Image
              src={preview}
              alt="Preview"
              width={300}
              height={300}
              className="w-full h-full object-cover rounded-md"
              unoptimized
            />
          ) : (
            <div className="flex flex-col items-center justify-center">
              <Upload size={32} className="text-primary-500" />
              <p className="mt-3">
                Upload your <span className="text-primary-500">{label}</span> here.
              </p>
              <p className="text-[12px] text-black/70 mt-1">
                Upload file up to <span className="font-medium text-black">8MB</span>
              </p>
              <p className="text-[12px] text-black/70 mt-1">Supported: JPG, PNG, SVG</p>
            </div>
          )}
        </div>

        <input
          type="file"
          accept=".jpg,.jpeg,.png,.svg"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {value && typeof value !== 'string' && (
        <p className="text-sm text-gray-400">{value.name}</p>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
