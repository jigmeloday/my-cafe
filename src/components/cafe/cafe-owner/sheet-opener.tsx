import { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { INSERT_CAFE_SCHEMA } from '@/lib/validator';
import {
  getCafeByCafeOwnerById,
  createCafe,
  updateCafe,
} from '@/lib/action/cafe.action';
import { CafeType, SheetOpenerProps } from '../../../../types';
import CafeForm from './cafe-form';

function SheetOpener({ setOpen, cafeId, userId }: SheetOpenerProps) {
  const [loading, setLoading] = useState(false);

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

  // Fetch cafe details if editing
  useEffect(() => {
    if (!cafeId || !userId) return;

    setLoading(true);
    getCafeByCafeOwnerById(userId, cafeId)
      .then((data) => {
        if (data && !Array.isArray(data)) {
          reset({
            ...data,
            logo: data.logo ?? undefined,
            subTitle: data.subTitle ?? undefined,
            createdAt: data.createdAt ? data.createdAt.toString() : undefined,
          });
        }
      })
      .finally(() => setLoading(false));
  }, [cafeId, userId, reset]);

  const onSubmit = async (data: CafeType) => {
    const payload = {
      ...data,
    };
    const response = cafeId
      ? await updateCafe(cafeId as string, payload)
      : await createCafe(payload);

    toast[response.success ? 'success' : 'error'](response.message);
  };

  return (
    <SheetContent side="bottom" className="h-[90vh]">
      {/* Header */}
      <SheetHeader>
        <SheetTitle></SheetTitle>
        <div className="flex w-full items-center justify-between px-[112px] border-b py-4 shadow">
          <h3>Let&apos;s add cafe</h3>
          <div
            onClick={() => setOpen(false)}
            className="group cursor-pointer size-[40px] border flex items-center justify-center rounded-md border-primary-400"
          >
            <X className="text-primary-500 transition-transform duration-300 ease-in-out group-hover:rotate-180" />
          </div>
        </div>
      </SheetHeader>

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <ScrollArea className="flex-1 min-h-0">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                Loading...
              </div>
            ) : (
              <CafeForm />
            )}
          </ScrollArea>

          <div className="flex-none w-full flex justify-end sticky bottom-0 bg-primary-50 px-[112px] p-4 shadow">
            <Button disabled={isSubmitting} type="submit">
              {cafeId ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </SheetContent>
  );
}

export default SheetOpener;
