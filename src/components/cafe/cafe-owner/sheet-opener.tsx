'use client';
import { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { INSERT_CAFE_SCHEMA } from '@/lib/validator';
import { CafeType, SheetOpenerProps } from '../../../../types';
import CafeForm from './cafe-form';
import { createCafe, updateCafe } from '@/lib/action/cafe.action';
import { toast } from 'sonner';
function SheetOpener({
  setOpen,
  cafe,
  onSave,
  setCafe,
}: Omit<SheetOpenerProps, 'userId' | 'cafeId'> & { cafe?: CafeType }) {
  const methods = useForm<CafeType>({
    resolver: zodResolver(INSERT_CAFE_SCHEMA),
    defaultValues: {
      name: '',
      themeColor: '',
      openTime: '',
      closeTime: '',
      subTitle: '',
      logo: '',
    },
  });

  const { reset, handleSubmit, formState } = methods;
  const { isSubmitting } = formState;

  // Reset form whenever the sheet opens or cafe changes
  useEffect(() => {
    if (cafe) {
      reset({
        ...cafe,
        logo: cafe.logo ?? undefined,
        subTitle: cafe.subTitle ?? undefined,
      });
    } else {
      // Creating: reset to default
      reset({
        name: '',
        themeColor: '',
        openTime: '',
        closeTime: '',
        subTitle: '',
        logo: '',
      });
    }
  }, [cafe, reset]);

  const onSubmit = async (data: CafeType) => {
    let updatedCafe: CafeType;

    if (cafe) {
      // Update via API
      const response = await updateCafe(cafe?.id as string, data);
      if (!response.success) return toast.error(response.message);
      toast.success(response.message);
      updatedCafe = response.data as CafeType;
    } else {
      // Create via API
      const response = await createCafe(data);
      if (!response.success) return toast.error(response.message);
      toast.success(response.message);
      updatedCafe = response.data as CafeType;
    }

    onSave?.(updatedCafe);
    setOpen(false);
    setCafe(null);
  };

  return (
    <SheetContent side="bottom" className="h-[90vh]">
      <SheetHeader>
        <SheetTitle />
        <div className="flex w-full items-center justify-between px-[112px] border-b py-4 shadow">
          <h3>{cafe ? 'Edit Cafe' : "Let's add cafe"}</h3>
          <div
            onClick={() => {
              setOpen(false);
              if (cafe) setCafe(null);
            }}
            className="group cursor-pointer size-[40px] border flex items-center justify-center rounded-md border-primary-500"
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
            <CafeForm />
          </ScrollArea>

          <div className="flex-none w-full flex justify-end sticky bottom-0 px-[112px] p-4 shadow-2xl border-t border-primary-50 ">
            <Button disabled={isSubmitting} type="submit">
              {cafe ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </SheetContent>
  );
}

export default SheetOpener;
