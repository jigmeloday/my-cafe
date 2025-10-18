'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { INSERT_ADDRESS_SCHEMA } from '@/lib/validator';
import { AddressType } from '../../../types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  addAddressApi,
  updateAddressApi,
} from '@/lib/services/address/address.service';
import { useParams } from 'next/navigation';
import { useAddress } from '@/context/address-context';
import { X } from 'lucide-react';
import { useEffect } from 'react';

interface AddressFormProps {
  setOpen: (val: boolean) => void;
  setAddress: (address: AddressType | null) => void;
  address?: AddressType;
}

const AddressForm = ({ setOpen, address, setAddress }: AddressFormProps) => {
  const { slug } = useParams();
  const { updateAddress, addAddress } = useAddress();
  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddressType>({
    resolver: zodResolver(INSERT_ADDRESS_SCHEMA),
    defaultValues: {
      street: address?.street || '',
      city: address?.city || '',
      state: address?.state || '',
      zip: address?.zip || '',
      country: address?.country || '',
    },
  });

  useEffect(() => {
  if (address) {
    reset({
      street: address.street || '',
      city: address.city || '',
      state: address.state || '',
      zip: address.zip || '',
      country: address.country || '',
    });
  } else {
    reset({
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
    });
  }
}, [address, reset]);

  const onSubmit = async (data: AddressType) => {
    try {
      const payload = {
        ...data,
        cafeId: slug as string,
      };

      if (address?.id) {
        const response = await updateAddressApi(payload, address?.id);
        updateAddress(response?.data as AddressType);
      } else {
        const response = await addAddressApi(payload);
        addAddress(response?.data as AddressType, slug as string);
      }
      setAddress(null);
      setOpen(false);
      reset();
    } catch (error) {
      console.error('Failed to submit address:', error);
    }
  };


  return (
    <SheetContent className="h-[70vh] py-6" side="bottom">
      <SheetHeader className="px-[112px] shadow pb-4">
         <SheetTitle />
        <div className="flex w-full items-center justify-between">
          <h3>{address ? 'Edit address' : "Let's add a address"}</h3>
          <div
            onClick={() => {
              setOpen(false);
              setAddress(null);
              reset();
            }}
            className="group cursor-pointer w-[40px] h-[40px] border flex items-center justify-center rounded-md border-primary-500"
          >
            <X className="text-primary-500 transition-transform duration-700 ease-in-out group-hover:rotate-180" />
          </div>
        </div>
      </SheetHeader>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex h-full flex-col justify-between"
      >
        <ScrollArea className="flex-1 px-[112px] py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              placeholder="Street"
              {...register('street')}
              error={errors.street?.message}
            />
            <Input
              placeholder="City"
              {...register('city')}
              error={errors.city?.message}
            />
            <Input
              placeholder="State"
              {...register('state')}
              error={errors.state?.message}
            />
            <Input
              placeholder="ZIP code"
              {...register('zip')}
              error={errors.zip?.message}
            />
            <Controller
              name="country"
              control={control}
              rules={{ required: 'Country is required' }}
              render={({ field }) => (
                <div>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      className={`${
                        errors.country
                          ? 'border-red-500 focus:ring-red-500'
                          : ''
                      }`}
                    >
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bhutan">Bhutan</SelectItem>
                      <SelectItem value="india">India</SelectItem>
                      <SelectItem value="nepal">Nepal</SelectItem>
                      <SelectItem value="thailand">Thailand</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.country && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.country.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
        </ScrollArea>
        <div className="border-t px-12 py-4 flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="w-fit">
            {isSubmitting ? 'Saving...' : 'Save Address'}
          </Button>
        </div>
      </form>
    </SheetContent>
  );
};

export default AddressForm;
