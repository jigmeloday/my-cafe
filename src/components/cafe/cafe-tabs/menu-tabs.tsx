'use client';
import MenuCard from '@/components/shared/menu-card';
import { CATEGORY, DUMMY_MENU } from '@/lib/constant';
import { useState } from 'react';
import { MenuType } from '../../../../types';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { Sheet } from '@/components/ui/sheet';
import MenuCreation from '@/components/menu/menu-creation';

function MenuTab() {
  const { data: session } = useSession();
  const [active, setActive] = useState(1);
  const [open, setOpen] = useState(false);
  
  return (
    <div className="flex px-[4px] py-[20px] space-x-[42px]">
      <div className="w-[16%] px-2">
        <h4>Categories</h4>
        <div className="mt-[24px]">
          {CATEGORY.map(({ id, name }) => (
            <div
              key={id}
              onClick={() => {
                setActive(id);
              }}
              className={`"my-[16px] transition-all duration-500 ease-in-out rounded-md px-[8px] py-[10px] cursor-pointer " ${
                active === id
                  ? 'bg-primary-500 shadow'
                  : 'hover:bg-primary-50/10'
              }`}
            >
              <p
                className={`font-bold ${
                  active === id ? 'text-white' : 'text-primary-500'
                }`}
              >
                {name}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full px-2">
        {session?.user.role === 'owner' &&
          <div className="flex justify-end">
            <Button onClick={() => setOpen(true)} className="w-fit my-2">Add menu</Button>
          </div>
        }
        <div className="grid grid-cols-3 gap-4">
          {DUMMY_MENU.map((item) => (
            <MenuCard key={item.id} menu={item as MenuType} />
          ))}
        </div>
      </div>
      <Sheet open={open}>
        <MenuCreation setOpen={setOpen} />
      </Sheet>
    </div>
  );
}

export default MenuTab;
