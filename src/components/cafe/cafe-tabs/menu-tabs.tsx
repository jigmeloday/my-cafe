'use client';
import MenuCard from '@/components/shared/menu-card';
import { CATEGORY, DUMMY_MENU } from '@/lib/constant';
import { useState } from 'react';
import { MenuType } from '../../../../types';

function MenuTab() {
  const [active, setActive] = useState(1);
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
        {/* <h4 className="text-primary-500">Menu List</h4> */}
        <div className="grid grid-cols-3 gap-4">
          {DUMMY_MENU.map((item) => (
            <MenuCard key={item.id} menu={item as MenuType} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MenuTab;
