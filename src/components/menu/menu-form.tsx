'use client';

import { Dispatch, SetStateAction } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import { INSERT_MENU_SCHEMA } from '@/lib/validator';
import MultiImageUploader from '../ui/multi-image-uploader';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { MenuType } from '../../../types';
import { useCategories } from '@/context/category-context';

type Props = {
  menu?: MenuType | null;
  imageUrls: File[];
  setImageUrls: Dispatch<SetStateAction<File[]>>;
  onSubmit: (data: MenuType) => void;
};

export default function MenuForm({
  menu,
  imageUrls,
  setImageUrls,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MenuType>({
    resolver: zodResolver(INSERT_MENU_SCHEMA),
    defaultValues: menu ?? {
      name: '',
      slug: '',
      price: 0,
      discount: 0,
      spicyRate: null,
      prepTime: undefined,
      description: '',
      categoryId: '',
      ingredients: [''],
      calories: undefined,
      protein: undefined,
      fat: undefined,
      carbs: undefined,
      isAvailable: false,
      archived: false,
    },
  });
  const { categories } = useCategories();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredients' as never,
  });

  const renderNumberInput = (name: keyof MenuType, placeholder: string) => (
    <Input
      key={name}
      {...register(name, { valueAsNumber: true })}
      type="number"
      placeholder={placeholder}
      error={errors[name]?.message as string | undefined}
    />
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col justify-between h-full">
        <ScrollArea className="h-[80vh] px-[112px] py-6 space-y-8">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            {['name', 'slug'].map((f) => (
              <Input
                key={f}
                {...register(f as keyof MenuType)}
                placeholder={f[0].toUpperCase() + f.slice(1)}
                error={
                  errors[f as keyof MenuType]?.message as string | undefined
                }
              />
            ))}
            {['price', 'discount', 'spicyRate', 'prepTime'].map((f) =>
              renderNumberInput(
                f as keyof MenuType,
                f[0].toUpperCase() + f.slice(1)
              )
            )}
          </div>

          <Textarea
            {...register('description')}
            placeholder="Describe this menu..."
            error={errors.description?.message}
          />
          <div className="my-4">
            <Select onValueChange={(val) => setValue('categoryId', val)}>
              <SelectTrigger
                className="border rounded-md w-full"
                error={errors.categoryId?.message}
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ingredients */}

          <div className="space-y-3 py-6 border-y my-4">
            <h6>Ingredients</h6>
            {fields.map((f, i) => (
              <div key={f.id} className="flex gap-2">
                <Input
                  {...register(`ingredients.${i}` as const)}
                  placeholder="e.g., Tomato"
                  className="flex-1"
                  error={errors.ingredients?.[i]?.message}
                />
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => remove(i)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => append('')}
              className="w-fit"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Ingredient
            </Button>
          </div>

          {/* Nutrition */}
          <h6>Nutrition</h6>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-4">
            {['calories', 'protein', 'fat', 'carbs'].map((f) =>
              renderNumberInput(
                f as keyof MenuType,
                f[0].toUpperCase() + f.slice(1)
              )
            )}
          </div>

          <MultiImageUploader value={imageUrls} onChange={setImageUrls} />

          {/* Toggles */}
          <div className="flex gap-6 items-center my-4">
            {['isAvailable', 'archived'].map((f) => (
              <Controller
                key={f}
                name={f as keyof MenuType}
                control={control}
                render={({ field }) => (
                  <label className="flex items-center gap-2">
                    <span className="text-black/60">
                      {f === 'isAvailable' ? 'Available' : 'Archived'}
                    </span>
                    <Checkbox
                      checked={!!field.value} // normalize to boolean
                      onCheckedChange={(checked: boolean) =>
                        field.onChange(checked)
                      }
                    />
                  </label>
                )}
              />
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t shadow-2xl py-4 px-[112px] flex justify-end">
          <Button className="w-fit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : menu ? 'Update Menu' : 'Create Menu'}
          </Button>
        </div>
      </div>
    </form>
  );
}
