import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_KEY = '@finance_user_profile';

interface UserProfile {
  name: string;
  email: string;
}

interface UserContextValue {
  profile: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Alex Yu',
    email: 'alex@gmail.com',
  });

  // Load persisted profile on mount
  useEffect(() => {
    AsyncStorage.getItem(PROFILE_KEY).then((raw) => {
      if (raw) {
        try {
          setProfile((prev) => ({ ...prev, ...JSON.parse(raw) }));
        } catch {}
      }
    });
  }, []);

  const updateProfile = (data: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...data };
      AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <UserContext.Provider value={{ profile, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUserContext must be used inside UserProvider');
  return ctx;
}
