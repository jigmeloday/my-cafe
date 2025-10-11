'use client';
import NoData from '@/components/shared/no-data';
import { CafeType, Role } from '../../../../types';
import CafeCard from '@/components/shared/cafe-card';
import { Plus } from 'lucide-react';
import {
  Sheet,
} from '@/components/ui/sheet';
import { useState } from 'react';
import SheetOpener from './sheet-opener';

function CreateCafe({ cafe, roles }: { cafe: CafeType[], roles: Role[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {cafe.length ? (
        <div className="min-h-screen px-[112px] my-[52px]">
          <div className="grid grid-cols-4 gap-4">
            {cafe.map((item) => (
              <CafeCard key={item.id} cafe={item} roles={roles} />
            ))}
            <div className="h-full w-full rounded-md bg-primary-50 flex items-center justify-center">
              <div
                onClick={() => setOpen(true)}
                className="flex flex-col size-[140px] items-center justify-center border border-dashed border-primary-600/70 rounded-md hover:shadow-lg cursor-pointer transition duration-300 group"
              >
                <Plus
                  size={32}
                  className="text-primary-500 transition-transform duration-300 ease-in-out group-hover:rotate-180"
                />
                <p className='text-center text-[14px] font-bold'>Hey Let&apos;s create Cafe</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <NoData
          title="No Cafe"
          description="No cafes here… yet! 😢 But don’t worry, you can brew your first one by hitting the ‘Create’ button!"
          buttonText="Create Cafe"
          action={setOpen}
        />
      )}
      <Sheet open={open} >
        <SheetOpener setOpen={setOpen} />
      </Sheet>
    </div>
  );
}

export default CreateCafe;
