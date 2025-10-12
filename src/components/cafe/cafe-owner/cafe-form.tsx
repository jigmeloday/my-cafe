import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ImageUploader from '@/components/ui/image-uploader';
import { CafeType } from '../../../../types';
import { useState } from 'react';

function CafeForm() {
  const {
    register,
    formState: { errors },
    setValue, // <-- add this
  } = useFormContext<CafeType>();

  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (file: File) => {
    setImage(file);
    setValue('logo', file); // <-- update RHF value
  };

  return (
    <div className="px-[112px] mt-[42px] space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <Input placeholder="Cafe name" {...register('name')} />
          {errors.name && <span className="text-red-500 text-sm mt-1">{errors.name.message}</span>}
        </div>
        <div className="flex flex-col">
          <Input placeholder="Theme color (eg: #ffffff)" {...register('themeColor')} />
          {errors.themeColor && (
            <span className="text-red-500 text-sm mt-1">{errors.themeColor.message}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <Input type="time" placeholder="Opening Time" {...register('openTime')} />
          {errors.openTime && (
            <span className="text-red-500 text-sm mt-1">{errors.openTime.message}</span>
          )}
        </div>
        <div className="flex flex-col">
          <Input type="time" placeholder="Closing Time" {...register('closeTime')} />
          {errors.closeTime && (
            <span className="text-red-500 text-sm mt-1">{errors.closeTime.message}</span>
          )}
        </div>
      </div>

      <div className="flex flex-col">
        <Textarea placeholder="Tell us about your cafe" {...register('subTitle')} />
        {errors.subTitle && (
          <span className="text-red-500 text-sm mt-1">{errors.subTitle.message}</span>
        )}
      </div>

      <div className="flex items-center justify-center">
        <ImageUploader
          value={image}
          onChange={handleImageChange}
          label="Upload your cafe logo"
        />
        {errors.logo && (
          <span className="text-red-500 text-sm mt-1">{errors.logo.message}</span>
        )}
      </div>
    </div>
  );
}

export default CafeForm;
