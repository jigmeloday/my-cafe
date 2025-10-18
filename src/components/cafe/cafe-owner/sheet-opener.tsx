'use client';
import { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { INSERT_CAFE_SCHEMA } from '@/lib/validator';
import { CafeType, SheetOpenerProps } from '../../../../types';
import CafeForm from './cafe-form';
import { createCafeApi, updateCafeApi } from '@/lib/services/cafe/cafe-service';
import { imageUpload } from '@/lib/services/image-upload-shared/image-upload.service';

function SheetOpener({
  setOpen,
  cafe,
  onSave,
  setCafe,
}: Omit<SheetOpenerProps, 'userId' | 'cafeId'> & { cafe?: CafeType }) {
  const [image, setImage] = useState<File | null>(null);

  const methods = useForm<CafeType>({
    resolver: zodResolver(INSERT_CAFE_SCHEMA),
    defaultValues: {
      name: cafe?.name || '',
      subTitle: cafe?.subTitle || '',
      description: cafe?.description || '',
      themeColor: cafe?.themeColor || '',
      openTime: cafe?.openTime || '',
      closeTime: cafe?.closeTime || '',
      agreeTerms: cafe?.agreeTerms || false,
      closed: cafe?.closed || false,
      website: cafe?.website || '',
      phone: cafe?.phone || '',
      email: cafe?.email || '',
      socialLinks: cafe?.socialLinks || {},
      googleMap: cafe?.googleMap || '',
    },
  });
  const { reset, handleSubmit, formState } = methods;

  useEffect(() => {
    if (cafe) {
      reset({
        name: cafe.name,
        subTitle: cafe.subTitle,
        description: cafe.description,
        themeColor: cafe.themeColor,
        openTime: cafe.openTime,
        closeTime: cafe.closeTime,
        agreeTerms: cafe.agreeTerms,
        closed: cafe.closed,
        website: cafe.website,
        phone: cafe.phone,
        email: cafe.email,
        socialLinks: cafe.socialLinks || {},
        googleMap: cafe.googleMap,
        logo: cafe.logo, // if needed
      });
    }
  }, [cafe, reset]);

  const { isSubmitting } = formState;
  const onSubmit = async (data: CafeType) => {
    let updatedCafe: CafeType | null = null; // initialize
    const payload = { ...data };
    if (image) {
      const url = await imageUpload(image);
      payload.logo = url;
    }
    let response;
    if (cafe?.id) {
      response = await updateCafeApi(cafe.id, {
        ...payload,
        logo: payload.logo || cafe?.logo
      });
    } else {
      response = await createCafeApi(payload);
    }

    if (response?.success) {
      updatedCafe = response.data as CafeType;
      reset();
    }
    if (updatedCafe) {
      onSave?.(updatedCafe);
      setOpen(false);
      setCafe(null);
      reset();
    }
  };

  return (
    <SheetContent side="bottom" className="h-screen">
      <SheetHeader>
        <SheetTitle />
        <div className="flex w-full items-center justify-between px-[112px] border-b py-4 shadow">
          <h3>{cafe ? 'Edit Cafe' : "Let's add a cafe"}</h3>
          <div
            onClick={() => {
              setOpen(false);
              setCafe(null);
              reset();
            }}
            className="group cursor-pointer w-[40px] h-[40px] border flex items-center justify-center rounded-md border-primary-500"
          >
            <X className="text-primary-500 transition-transform duration-700 ease-in-out group-hover:rotate-180" />
          </div>
        </div>
      </SheetHeader>

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <ScrollArea className="flex-1 min-h-0">
            <CafeForm image={image} setImage={setImage} />
          </ScrollArea>

          <div className="flex-none w-full flex justify-end sticky bottom-0 px-[112px] p-4 shadow-2xl border-t border-primary-50">
            <Button className="w-fit" disabled={isSubmitting} type="submit">
              {cafe ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </SheetContent>
  );
}

export default SheetOpener;
