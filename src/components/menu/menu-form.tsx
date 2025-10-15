'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { MenuFormValues, MenuType } from '../../../types';
import { INSERT_MENU_SCHEMA } from '@/lib/validator';

type MenuFormProps = {
  initialData?: Partial<MenuFormValues>;
  onSubmit: (data: MenuFormValues) => Promise<void> | void;
};

export default function MenuForm({ initialData, onSubmit }: MenuFormProps) {
  const form = useForm<MenuFormValues>({
    resolver: zodResolver(INSERT_MENU_SCHEMA),
    defaultValues: {
      name: initialData?.name ?? '',
      slug: initialData?.slug ?? '',
      price: initialData?.price ?? 0,
      discount: initialData?.discount ?? null,
      spicyRate: initialData?.spicyRate ?? 0,
      ingredients: initialData?.ingredients ?? [], // important!
      description: initialData?.description ?? '',
      categoryId: initialData?.categoryId ?? '',
      isAvailable: initialData?.isAvailable ?? true,
      prepTime: initialData?.prepTime ?? null,
      tags: initialData?.tags ?? null,
      calories: initialData?.calories ?? null,
      protein: initialData?.protein ?? null,
      fat: initialData?.fat ?? null,
      carbs: initialData?.carbs ?? null,
      archived: initialData?.archived ?? false,
    },
  });

  const {  handleSubmit, reset, formState } = form;
  const { errors, isSubmitting } = formState;

  useEffect(() => {
    if (initialData) reset(initialData);
  }, [initialData, reset]);

  return (
    <form
      // onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 bg-bgLight p-5 rounded-2xl"
    >
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          error={errors.name?.message}
          // {...register('name')}
          placeholder="Menu name"
        />
        <Input
          error={errors.slug?.message}
          // {...register('slug')}
          placeholder="unique-slug"
        />

        <Input
          type="number"
          step="0.01"
          // {...register('price', { valueAsNumber: true })}
          placeholder="Price"
          error={errors.price?.message}
        />
        <Input
          type="number"
          step="0.01"
          // {...register('discount', { valueAsNumber: true })}
          placeholder="discount"
          error={errors.discount?.message}
        />
        <Input
          type="number"
          // {...register('spicyRate', { valueAsNumber: true })}
          error={errors.spicyRate?.message}
          placeholder="Spicy Rate(0-5)"
        />
        <Input
          type="number"
          // {...register('prepTime', { valueAsNumber: true })}
          error={errors.prepTime?.message}
        />
      </div>

      {/* Description */}
      <Textarea
        error={errors.description?.message}
        // {...register('description')}
        placeholder="Describe the menu item..."
      />

      {/* Ingredients */}
      <div>
        <Input
          placeholder="e.g. Cheese, Tomato, Basil, Sugar..."
          error={errors.ingredients?.message}
          onChange={(e) =>
            form.setValue(
              'ingredients',
              e.target.value.split(',').map((i) => i.trim())
            )
          }
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

      {/* Misc */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Input 
          // {...register('categoryId')} 
          placeholder="Category UUID" />
          {errors.categoryId && (
            <p className="text-red-500 text-sm">{errors.categoryId.message}</p>
          )}
        </div>
      </div>

      {/* Toggles */}
      <div className="flex items-center gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
          //  {...register('isAvailable')} 
           />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
          //  {...register('archived')} 
           />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {initialData ? 'Update Menu' : 'Create Menu'}
      </Button>
    </form>
  );
}
