'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { X } from 'lucide-react';
import { SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { INSERT_BANNER_SCHEMA } from '@/lib/validator';
import { BannerType, CafeType } from '../../../types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { createBannerApi, updateBannerApi } from '@/lib/services/banner-service/banner.service';

interface BannerFormProps {
  cafe: CafeType[];
  selectedBanner?: BannerType;
  setOpen: (value: boolean) => void;
  onSubmit?: (data: BannerType) => void;
  setBanner: (val: BannerType | null) => void;
}

export default function BannerForm({
  cafe,
  selectedBanner,
  setOpen,
  onSubmit,
  setBanner,
}: BannerFormProps) {
  // Prepare default values: convert startDate and endDate to Date if present
  const defaultValues: BannerType = {
    title: selectedBanner?.title || '',
    subtitle: selectedBanner?.subtitle || '',
    buttonText: selectedBanner?.buttonText || '',
    link: selectedBanner?.link || '',
    cafeId: selectedBanner?.cafeId || '',
    startDate: selectedBanner?.startDate ? new Date(selectedBanner.startDate) : undefined,
    endDate: selectedBanner?.endDate ? new Date(selectedBanner.endDate) : undefined,
    active: selectedBanner?.active || false,
    imageUrl: selectedBanner?.imageUrl || '',
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BannerType>({
    resolver: zodResolver(INSERT_BANNER_SCHEMA),
    defaultValues,
  });

  const submitHandler = async (data: BannerType) => {
    try {
      const payload: BannerType = {
        ...data,
        imageUrl:
          data.imageUrl ||
          'https://images.unsplash.com/photo-1760690344266-966d1bf7c46c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987',
      };

      let response;
      if (selectedBanner?.id) {
        response = await updateBannerApi(payload, selectedBanner.id);
      } else {
        response = await createBannerApi(payload);
      }

      if (response?.data) {
        onSubmit?.(response.data);
        reset(defaultValues);
        setOpen(false);
        setBanner(null);
      }
    } catch (error) {
      console.error('Failed to submit banner:', error);
    }
  };

  const handleClose = () => {
    reset(defaultValues);
    setBanner(null);
    setOpen(false);
  };

  return (
    <SheetContent className="h-screen" side="bottom">
      <SheetHeader className="border-b shadow">
        <SheetTitle/>
        <div className="flex w-full items-center justify-between px-[112px] py-[32px]">
          <h3>
            {selectedBanner ? 'Update Banner' : 'Create Banner'}
          </h3>
          <div
            onClick={handleClose}
            className="group cursor-pointer w-[40px] h-[40px] border flex items-center justify-center rounded-md border-primary-500"
          >
            <X className="text-primary-500 transition-transform duration-700 ease-in-out group-hover:rotate-180" />
          </div>
        </div>
      </SheetHeader>

      <form onSubmit={handleSubmit(submitHandler)} className="px-[112px] py-6">
        <div className="grid grid-cols-2 gap-8">
          <Input placeholder="Banner title" error={errors.title?.message} {...register('title')} />
          <Input placeholder="Subtitle" error={errors.subtitle?.message} {...register('subtitle')} />
          <Input placeholder="Button text" error={errors.buttonText?.message} {...register('buttonText')} />
          <Input placeholder="Link" error={errors.link?.message} {...register('link')} />
          <Controller
            name="cafeId"
            control={control}
            rules={{ required: 'Cafe is required' }}
            render={({ field }) => (
              <div>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className={errors.cafeId ? 'border-red-500 focus:ring-red-500' : ''}>
                    <SelectValue placeholder="Select a cafe" />
                  </SelectTrigger>
                  <SelectContent>
                    {cafe.map(({ id, name }) => (
                      <SelectItem key={id} value={id as string}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.cafeId && <p className="text-sm text-red-500 mt-1">{errors.cafeId.message}</p>}
              </div>
            )}
          />
          <Controller
            name="startDate"
            control={control}
            render={({ field }) => (
              <Input
                type="date"
                value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                onChange={(e) => setValue('startDate', e.target.value ? new Date(e.target.value) : undefined, { shouldValidate: true })}
              />
            )}
          />
          <Controller
            name="endDate"
            control={control}
            render={({ field }) => (
              <Input
                type="date"
                value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                onChange={(e) => setValue('endDate', e.target.value ? new Date(e.target.value) : undefined, { shouldValidate: true })}
              />
            )}
          />
        </div>

        <div className="flex items-center space-x-4 my-4">
          <Controller
            name="active"
            control={control}
            render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}
          />
          <span>Set active</span>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Banner'}
          </Button>
        </div>
      </form>
    </SheetContent>
  );
}
