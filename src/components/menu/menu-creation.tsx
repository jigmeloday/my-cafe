'use client';
import { useState, Dispatch, SetStateAction } from 'react';
import { useParams } from 'next/navigation';
import { MenuType } from '../../../types';
import { SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { createMenuApi, updateMenuApi } from '@/lib/services/menu/menu.service';
import MenuForm from './menu-form';
import { imageUpload } from '@/lib/services/image-upload-shared/image-upload.service';

export default function MenuCreation({
  setOpen,
  menu,
  onMenuCreated,
  setMenu
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
  menu?: MenuType | null;
  setMenu: (menu: MenuType | null) => void;
  onMenuCreated?: (menu: MenuType) => void;
}) {
  const { slug } = useParams();
  const cafeId = String(slug);

  const [imageUrls, setImageUrls] = useState<File[]>([]);

  const handleSubmit = async (data: MenuType) => {
    const urls: string[] = [];
    if (imageUrls) {
      for (const file of imageUrls.slice(0, 3)) {
        const res = await imageUpload(file);
        if (res) urls.push(res);
      }
    }

    const payload = {
      ...data,
      cafeId,
      imageUrls: urls,
    };

    const response = menu
      ? await updateMenuApi(menu.id as string, payload)
      : await createMenuApi(payload);
    if (response.success) {
      if (onMenuCreated && response.data) {
        onMenuCreated(response?.data as MenuType);
      }
      if(menu) {
        setMenu(null)
      }
      setOpen(false);
    }
  };

  return (
    <SheetContent side="bottom" className="min-h-screen">
      <SheetHeader>
        <SheetTitle>
          <div className="flex justify-between items-center px-[112px] py-4 border-b shadow">
            <h3>{menu ? 'Edit Menu' : "Let's create a menu"}</h3>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {setOpen(false); setMenu(null)}}
              className="border-primary-500"
            >
              <X className="text-primary-500" />
            </Button>
          </div>
        </SheetTitle>
      </SheetHeader>

      <MenuForm
        menu={menu}
        imageUrls={imageUrls}
        setImageUrls={setImageUrls}
        onSubmit={handleSubmit}
      />
    </SheetContent>
  );
}
