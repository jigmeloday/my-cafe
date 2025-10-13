'use client';

import { EllipsisVertical } from 'lucide-react';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '../ui/menubar';

export interface MenuItem {
  label: string;
  onClick: () => void;
  className?: string;
  separator?: boolean; // adds a separator before this item
}

interface ActionMenuProps {
  items: MenuItem[];
}

export default function ActionMenu({ items }: ActionMenuProps) {
  return (
    <Menubar className="border-none bg-transparent">
      <MenubarMenu>
        <MenubarTrigger className="p-0 focus:outline-none data-[state=open]:bg-transparent cursor-pointer">
          <EllipsisVertical className="text-primary-500 hover:text-primary-600 transition duration-500 ease-in-out" />
        </MenubarTrigger>
        <MenubarContent className="mt-2 w-[180px] shadow-md">
          {items.map((item, index) => (
            <div key={index}>
              {item.separator && <MenubarSeparator />}
              <MenubarItem
                asChild
                className={`cursor-pointer ${item.className || ''}`}
                onClick={item.onClick}
              >
                <div>{item.label}</div>
              </MenubarItem>
            </div>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
