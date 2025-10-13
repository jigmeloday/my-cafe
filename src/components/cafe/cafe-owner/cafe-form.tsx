import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ImageUploader from '@/components/ui/image-uploader';
import { CafeType } from '../../../../types';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';

function CafeForm() {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<CafeType>();
  const logo = watch('logo');
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (file: File | null) => {
    setImage(file);
    setValue('logo', file as File);
  };

  return (
    <div className="px-[112px] mt-[42px] space-y-6">
      {/* Cafe Name & Theme Color */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="Cafe name"
          {...register('name')}
          error={errors.name?.message}
        />
        <Input
          placeholder="Theme color (eg: #ffffff)"
          error={errors.themeColor?.message}
          {...register('themeColor')}
        />
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          type="email"
          placeholder="Email address"
          {...register('email')}
          error={errors.email?.message}
        />
        <Input
          type="tel"
          placeholder="Phone number"
          {...register('phone')}
          error={errors.phone?.message}
        />
      </div>

      {/* Website & Google Map */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          type="url"
          placeholder="Website URL"
          error={errors.website?.message}
          {...register('website')}
        />
        <Input
          placeholder="Google Map URL"
          {...register('googleMap')}
          error={errors.googleMap?.message}
        />
      </div>

      {/* Business Hours */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          type="time"
          placeholder="Opening Time"
          {...register('openTime')}
          error={errors.openTime?.message}
        />
        <Input
          type="time"
          placeholder="Closing Time"
          {...register('closeTime')}
          error={errors.closeTime?.message}
        />
      </div>

      <Input
        placeholder="Cafe subtitle/tagline"
        {...register('subTitle')}
        error={errors.subTitle?.message}
      />
      {/* Description */}
      <Textarea
        placeholder="Tell us about your cafe"
        rows={4}
        error={errors?.description?.message}
        {...register('description')}
      />

      {/* Social Links - Simple implementation */}
      <div className="space-y-3">
        <div className="space-y-3">
          <Input
            placeholder="https://facebook.com/yourpage"
            {...register('socialLinks.facebook')}
            className="flex-1"
          />
          <Input
            placeholder="https://instagram.com/yourpage"
            {...register('socialLinks.instagram')}
            className="flex-1"
          />
          <Input
            placeholder="https://twitter.com/yourpage"
            {...register('socialLinks.twitter')}
            className="flex-1"
          />
          <Input
            placeholder="https://tiktok.com/@yourpage"
            {...register('socialLinks.tiktok')}
            className="flex-1"
          />
        </div>
      </div>
      {/* Logo Upload */}
      <div className="flex flex-col items-center justify-center my-[32px]">
        <ImageUploader
          value={image}
          previewUrl={(logo as string) || ''}
          onChange={handleImageChange}
          label="cafe logo"
        />
        {errors.logo && (
          <span className="text-red-500 text-sm mt-1">
            {errors.logo.message}
          </span>
        )}
      </div>
      <div className="my-[32px] space-y-[20px]">
        <div className="flex items-center space-x-2">
          <Switch
            checked={watch('closed')}
            onCheckedChange={(checked) =>
              setValue('closed', checked as boolean)
            }
          />
          <span className="text-[14px]">We currently close</span>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="agreeTerms"
            checked={watch('agreeTerms')}
            onCheckedChange={(checked) =>
              setValue('agreeTerms', checked as boolean)
            }
          />
          <label htmlFor="agreeTerms" className="text-[14px] cursor-pointer">
            Agree all terms and condition
          </label>
        </div>
        {errors.agreeTerms && (
          <span className="text-red-500 text-sm mt-1">
            {errors.agreeTerms.message}
          </span>
        )}
      </div>
    </div>
  );
}

export default CafeForm;
