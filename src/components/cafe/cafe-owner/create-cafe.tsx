'use client';
import NoData from '@/components/shared/no-data';
import { CafeType, Role } from '../../../../types';
import CafeCard from '@/components/shared/cafe-card';
import { Sheet } from '@/components/ui/sheet';
import { useEffect, useState } from 'react';
import SheetOpener from './sheet-opener';
import { toast } from 'sonner';
import { Dialog } from '@/components/ui/dialog';
import DialogComponent from '@/components/ui/dialog-component';
import {
  deleteCafeApi,
  updateCafeApi,
} from '@/lib/services/cafe/cafe-service';
import CreateCard from '@/components/shared/create-card';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { getCafeByCafeOwner } from '@/lib/action/cafe.action';

function CreateCafe({ roles }: { roles: Role[] }) {
  const [cafes, setCafes] = useState<CafeType[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedCafe, setSelectedCafe] = useState<CafeType | null>();
  const [actionType, setActionType] = useState<'close' | 'delete' | ''>('');
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    setFetching(true);
    const fetchCafe = async () => {
      const cafe = await getCafeByCafeOwner();
      setCafes(cafe as CafeType[]);
      setFetching(false);
    };
    fetchCafe();
  }, []);

  const handleSubmit = (updatedCafe: CafeType) => {
    setCafes((prev) => {
      const cafeMap = new Map(prev.map((c) => [c.id, c]));
      cafeMap.set(updatedCafe.id, updatedCafe);
      return Array.from(cafeMap.values());
    });
  };

  const handleAction = async () => {
    if (!selectedCafe) return;
    setLoading(true);

    try {
      let response;

      if (actionType === 'delete' && selectedCafe?.id) {
        response = await deleteCafeApi(selectedCafe.id);
      } else if (actionType === 'close' && selectedCafe?.id) {
        response = await updateCafeApi(selectedCafe?.id, {
          ...selectedCafe,
          logo: selectedCafe.logo,
          closed: !selectedCafe.closed,
        });
      } else {
        throw new Error('Invalid action');
      }

      if (response.success) {
        toast.success(
          actionType === 'delete'
            ? 'Cafe deleted successfully!'
            : selectedCafe.closed
            ? 'Cafe is now open!'
            : 'Cafe closed successfully!'
        );

        // Update local state
        setCafes((prev) => {
          if (actionType === 'delete') {
            return prev.filter((c) => c.id !== selectedCafe.id);
          } else {
            return prev.map((c) =>
              c.id === selectedCafe.id ? { ...c, closed: !c.closed } : c
            );
          }
        });
      } else {
        toast.error(response.message || 'Action failed.');
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      setDialogOpen(false);
      setSelectedCafe(null);
      setActionType('');
    }
  };
  return (
    <div>
      {
        !session?.user.cafeCreation && <div className="w-full bg-primary-500 py-2 px-[112px] text-[14px] text-white sticky top-[88px]">
        Congrats! Your café is pending admin approval. Please wait 1–24 hours or
        contact admin if delayed <Link className="font-bold underline ml-2" href="/contact">CONTACT US</Link>.
      </div>
      }
      {fetching ? (
        <div className="h-screen flex items-center justify-center">
          Please wait
        </div>
      ) : (
        <div>
          {cafes.length ? (
            <div className="px-[112px] my-[52px] grid grid-cols-4 gap-4">
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
              <CreateCard
                setOpen={setOpen}
                title="Open your cafe by"
                primaryText="clicking here"
                description=" Cafe will remain inactive until admin permit"
              />
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
              setCafe={setSelectedCafe}
              cafe={selectedCafe ?? undefined}
              onSave={(updatedCafe: CafeType) => {
                handleSubmit(updatedCafe);
              }}
            />
          </Sheet>

          {/* Dialog for close/delete */}
          <Dialog open={dialogOpen}>
            <DialogComponent
              btn1="Cancel"
              isDisabled={loading}
              btn2={
                actionType === 'delete'
                  ? 'Delete'
                  : selectedCafe?.closed
                  ? 'Open'
                  : 'Close'
              }
              title="Confirm Action"
              description={`Are you sure you want to ${
                actionType === 'close'
                  ? selectedCafe?.closed
                    ? 'open'
                    : 'close'
                  : actionType
              } this cafe?`}
              onConfirm={handleAction}
              onCancel={() => setDialogOpen(false)}
            />
          </Dialog>
        </div>
      )}
    </div>
  );
}

export default CreateCafe;
