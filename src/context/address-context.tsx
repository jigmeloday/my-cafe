'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { AddressType } from '../../types';

type AddressContextType = {
  addresses: AddressType[];
  loading: boolean;
  currentCafeId?: string;
  setCafeAddresses: (addresses: AddressType[], cafeId: string) => void;
  addAddress: (address: AddressType, cafeId: string) => void;
  updateAddress: (address: AddressType) => void;
};

const AddressContext = createContext<AddressContextType>({
  addresses: [],
  loading: false,
  setCafeAddresses: () => {},
  addAddress: () => {},
  updateAddress: () => {},
});

export const AddressProvider = ({ children }: { children: ReactNode }) => {
  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [loading] = useState(false);
  const [currentCafeId, setCurrentCafeId] = useState<string | undefined>();

  const setCafeAddresses = (newAddresses: AddressType[], cafeId: string) => {
    setAddresses(newAddresses);
    setCurrentCafeId(cafeId);
  };

  const addAddress = (address: AddressType, cafeId: string) => {
    // Only add address if it's for the current cafe
    if (currentCafeId === cafeId) {
      setAddresses((prev) => [address, ...prev]);
    } else {
      setAddresses([address]);
      setCurrentCafeId(cafeId);
    }
  };

  const updateAddress = (updated: AddressType) => {
    setAddresses((prev) =>
      prev.map((addr) => (addr.id === updated.id ? updated : addr))
    );
  };

  return (
    <AddressContext.Provider
      value={{
        addresses,
        loading,
        currentCafeId,
        setCafeAddresses,
        addAddress,
        updateAddress,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => useContext(AddressContext);
