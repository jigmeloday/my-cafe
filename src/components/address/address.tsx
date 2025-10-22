import { useState } from 'react';
import { AddressType } from '../../../types';
import NoData from '../shared/no-data';
import { Sheet } from '../ui/sheet';
import AddressForm from './address-form';
import { useAddress } from '@/context/address-context';
import { Button } from '../ui/button';

function Address() {
  const [open, setOpen] = useState(false);
  const { addresses } = useAddress();
  const [selectedAddress, setSelectedAddress] = useState<AddressType | null>(
    null
  );

  return (
    <div className="my-[24px]">
      {!addresses.length ? (
        <NoData
          buttonText="Add Address"
          action={() => setOpen(true)}
          title="Address not found"
          description="Please add address so that customers can find you"
        />
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="flex justify-between items-center border p-4 rounded cursor-pointer"
            >
              <div>
                {addr.street}, {addr.city}, {addr.country}
              </div>
              <Button
                onClick={() => {
                  setSelectedAddress(addr);
                  setOpen(true);
                }}
                className="w-fit"
              >
                Edit
              </Button>
            </div>
          ))}
        </div>
      )}
      <Sheet open={open}>
        <AddressForm
          setOpen={setOpen}
          setAddress={setSelectedAddress}
          address={selectedAddress ?? undefined}
        />
      </Sheet>
    </div>
  );
}
export default Address;
