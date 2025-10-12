'use client';
import NoData from '@/components/shared/no-data';
import { CafeType, Role } from '../../../../types';
import CafeCard from '@/components/shared/cafe-card';
import { Plus } from 'lucide-react';
import { Sheet } from '@/components/ui/sheet';
import { useState } from 'react';
import SheetOpener from './sheet-opener';
import { permissionChecker } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Dialog } from '@/components/ui/dialog';
import DialogComponent from '@/components/ui/dialog-component';
import { deleteCafe, updateCafe } from '@/lib/action/cafe.action';

function CreateCafe({ cafe, roles }: { cafe: CafeType[]; roles: Role[] }) {
  const { data: session } = useSession();
  const permission = permissionChecker(
    session?.user.role as string,
    roles as Role[]
  );

  const [cafes, setCafes] = useState<CafeType[]>(cafe);
  const [open, setOpen] = useState(false); // Sheet for create/edit
  const [dialogOpen, setDialogOpen] = useState(false); // Dialog for close/delete
  const [selectedCafe, setSelectedCafe] = useState<CafeType | null>(null);
  const [actionType, setActionType] = useState<'close' | 'delete' | null>(null);

  const handleAction = async () => {
    if (!permission || !actionType || !selectedCafe) return;

    if (actionType === 'close') {
      const updatedCafe = { ...selectedCafe, closed: !selectedCafe.closed };
      const response = await updateCafe(selectedCafe.id as string, updatedCafe);
      toast[response.success ? 'success' : 'error'](response.message);

      if (response.success) {
        setCafes((prev) =>
          prev.map((c) => (c.id === selectedCafe.id ? updatedCafe : c))
        );
      }
    }

    if (actionType === 'delete') {
      const response = await deleteCafe(selectedCafe.id as string);
      toast[response.success ? 'success' : 'error'](response.message);

      if (response.success) {
        setCafes((prev) => prev.filter((c) => c.id !== selectedCafe.id));
      }
    }

    setDialogOpen(false);
    setActionType(null);
    setSelectedCafe(null);
  };

  return (
    <div>
      {cafes.length ? (
        <div className="min-h-screen px-[112px] my-[52px]">
          <div className="grid grid-cols-4 gap-4">
            {cafes.map((item) => (
              <CafeCard
                key={item?.id}
                cafe={item}
                roles={roles}
                onEdit={(cafe) => {
                  setSelectedCafe(cafe); // set cafe to edit
                  setOpen(true); // open the sheet
                }}
                onAction={(cafeId, type) => {
                  const cafeObj = cafes?.find((c) => c.id === cafeId);
                  if (!cafeObj) return;
                  setSelectedCafe(cafeObj);
                  setActionType(type);
                  setDialogOpen(true);
                }}
              />
            ))}

            {/* Create Cafe Card */}
            <div className="min-h-[340px] w-full rounded-md bg-primary-50 flex items-center justify-center">
              <div
                onClick={() => setOpen(true)}
                className="flex flex-col size-[140px] items-center justify-center border border-dashed border-primary-600/70 rounded-md hover:shadow-lg cursor-pointer transition duration-300 group"
              >
                <Plus
                  size={32}
                  className="text-primary-500 transition-transform duration-300 ease-in-out group-hover:rotate-180"
                />
                <p className="text-center text-[14px] font-bold">
                  Hey Let&apos;s create Cafe
                </p>
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

      {/* Sheet for creating/editing cafe */}
      <Sheet open={open}>
        <SheetOpener
          setOpen={setOpen}
          cafe={selectedCafe ?? undefined}
          onSave={(updatedCafe: CafeType) => {
            setCafes((prev) => {
              const exists = prev.find((c) => c.id === updatedCafe.id);
              if (exists) {
                return prev.map((c) =>
                  c.id === updatedCafe.id ? updatedCafe : c
                );
              }
              return [updatedCafe, ...prev]; // add new cafe
            });
          }}
        />
      </Sheet>

      {/* Dialog for close/delete */}
      <Dialog open={dialogOpen}>
        <DialogComponent
          btn1="Cancel"
          btn2={
            actionType === 'delete'
              ? 'Delete'
              : selectedCafe?.closed
              ? 'Open'
              : 'Close'
          }
          title="Confirm Action"
          description={`Are you sure you want to ${actionType} this cafe?`}
          onConfirm={handleAction}
          onCancel={() => setDialogOpen(false)}
        />
      </Dialog>
    </div>
  );
}

export default CreateCafe;
