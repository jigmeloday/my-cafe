import { Dispatch, SetStateAction } from 'react';
import { SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { X } from 'lucide-react';
import { MenuType } from '../../../types';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectValue } from '../ui/select';
import { SelectItem, SelectTrigger } from '@radix-ui/react-select';
import { CATEGORY } from '@/lib/constant';
import { Checkbox } from '../ui/checkbox';
import MultiImageUploader from '../ui/multi-image-uploader';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';

function MenuCreation({
  setOpen,
  menu,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
  menu?: MenuType[] | [];
}) {
  const Category = CATEGORY;
  return (
    <SheetContent side="bottom" className="min-h-screen">
      <SheetHeader>
        <SheetTitle>
          <div className="flex w-full items-center justify-between px-[112px] border-b py-4 shadow">
            <h3>{menu ? 'Edit Menu' : "Let's create menu"}</h3>
            <div
              onClick={() => {
                setOpen(false);
                // if (cafe) setCafe(null);
              }}
              className="group cursor-pointer size-[40px] border flex items-center justify-center rounded-md border-primary-500"
            >
              <X className="text-primary-500 transition-transform duration-700 ease-in-out group-hover:rotate-180" />
            </div>
          </div>
        </SheetTitle>
      </SheetHeader>
     <div className='h-full flex flex-col justify-between'>
       <ScrollArea className="h-[80vh] px-[112px] py-[20px]">
        <div className="space-y-[32px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              // error={errors.name?.message}
              // {...register('name')}
              placeholder="Menu name"
            />
            <Input
              // error={errors.slug?.message}
              // {...register('slug')}
              placeholder="unique-slug"
            />

            <Input
              type="number"
              step="0.01"
              // {...register('price', { valueAsNumber: true })}
              placeholder="Price"
              // error={errors.price?.message}
            />
            <Input
              type="number"
              step="0.01"
              // {...register('discount', { valueAsNumber: true })}
              placeholder="discount"
              // error={errors.discount?.message}
            />
            <Input
              type="number"
              // {...register('spicyRate', { valueAsNumber: true })}
              // error={errors.spicyRate?.message}
              placeholder="Spicy Rate(0-5)"
            />
            <Input
              type="number"
              placeholder="Prepaction Time(mins)"
              // {...register('prepTime', { valueAsNumber: true })}
              // error={errors.prepTime?.message}
            />
          </div>
          <Textarea
            // error={errors.description?.message}
            // {...register('description')}
            placeholder="Describe the menu item..."
          />
             <div className='flex space-x-6'>
             <Select
            // onValueChange={field.onChange} value={field.value ?? ''}
            >
              <SelectTrigger
                className="[&[data-placeholder]]:text-black/50 h-12  w-full border border-input rounded-md py-2"
                // error={fieldState.error?.message}
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {Category.map(({ id, name }) => (
                  <SelectItem value="user" key={id}>
                    {name}{' '}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
             <Input
              // error={errors.slug?.message}
              // {...register('slug')}
              placeholder="unique-slug"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Colories"
              type="number"
              // {...register('calories', { valueAsNumber: true })}
            />
            <Input
              placeholder="Protein"
              type="number"
              // {...register('protein', { valueAsNumber: true })}
            />
            <Input
              placeholder="Fat"
              type="number"
              // {...register('fat', { valueAsNumber: true })}
            />
            <Input
              placeholder="Carbs"
              type="number"
              // {...register('carbs', { valueAsNumber: true })}
            />
          </div>
         
          <MultiImageUploader />
            <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <span className='text-black/50'>Available</span>
              <Checkbox
              //  {...register('isAvailable')}
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className='text-black/50'>Archived</span>
              <Checkbox
              //  {...register('archived')}
              />
            </div>
          </div>
        </div>
      </ScrollArea>
      <div className="sticky bottom-0 bg-white shadow-2xl border-t-[0.5px] py-[20px] px-[112px] flex justify-end">
        <Button className='w-fit'>Create menu</Button>
      </div>
     </div>
    </SheetContent>
  );
}

export default MenuCreation;
