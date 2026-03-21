"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

interface VistaProfileContextValue {
  accountFolder: string;
  userName: string;
  userImage: string;
  setUserName: (name: string) => void;
  setUserImage: (image: string) => void;
}

const VistaProfileContext = createContext<VistaProfileContextValue | null>(null);

export function VistaProfileProvider({ children }: { children: ReactNode }) {
  const [userName, setUserName] = useState('Irie');
  const [userImage, setUserImage] = useState('🌸');

  const value = useMemo(
    () => ({
      accountFolder: 'Irie',
      userName,
      userImage,
      setUserName,
      setUserImage,
    }),
    [userImage, userName],
  );

  return <VistaProfileContext.Provider value={value}>{children}</VistaProfileContext.Provider>;
}

export function useVistaProfile() {
  const context = useContext(VistaProfileContext);

  if (!context) {
    throw new Error('useVistaProfile must be used inside VistaProfileProvider');
  }

  return context;
}
