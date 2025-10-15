'use client';
import { useState } from 'react';
import Image from 'next/image';
import { UploadCloud } from 'lucide-react';
type MultiImageUploaderProps = {
  value: File[];
  onChange: (files: File[]) => void;
};
function MultiImageUploader({ value, onChange }: MultiImageUploaderProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const MAX_SIZE_MB = 7;

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const filesArray = Array.from(e.target.files);
    const validFiles: File[] = [];
    const previewUrls: string[] = [];

    for (const file of filesArray) {
      if (file.size / 1024 / 1024 > MAX_SIZE_MB) {
        setError(`"${file.name}" exceeds ${MAX_SIZE_MB} MB and was skipped.`);
        continue;
      }
      validFiles.push(file);
      previewUrls.push(URL.createObjectURL(file));
    }
    const newFiles = [...value, ...validFiles];
     onChange(newFiles);
     setPreviews(newFiles.map((file) => URL.createObjectURL(file)));
    // if (validFiles.length > 0) {
    //   value((prev) => [...prev, ...validFiles]);
    //   setPreviews((prev) => [...prev, ...previewUrls]);
    // }
  };

  const handleRemoveImage = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange(newFiles);
    setPreviews(newFiles.map((file) => URL.createObjectURL(file)));
  };

  return (
    <div className="space-y-4">
      {/* Upload Box */}
      <label className="w-full flex flex-col items-center justify-center min-h-[180px] border-2 border-dashed border-primary-500 rounded-lg cursor-pointer transition-colors p-6 hover:bg-primary-50/10 duration-300">
        <UploadCloud size={32} className="text-black/60" />
        <p className="text-primary-500 my-2 text-center">
          Click or drag images here to upload
        </p>
        <p className="text-sm text-gray-500">
          Supports multiple images (Max 8 MB each)
        </p>
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFilesChange}
        />
      </label>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-500 p-2 text-start hover:bg-primary-50/20 cursor-pointer rounded-md transition duration-300 ease-in-out" onClick={() => setError('')}>
          {error}
        </p>
      )}

      {/* Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4">
          {previews.map((src, index) => (
            <div
              key={index}
              className="relative group rounded-md overflow-hidden shadow-sm"
            >
              <Image
                src={src}
                alt={`preview ${index}`}
                width={300}
                height={300}
                className="object-cover h-32 w-full transition-transform duration-300 group-hover:scale-105"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 bg-primary-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:scale-110 transition duration-300"
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
