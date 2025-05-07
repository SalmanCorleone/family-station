'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode, Dispatch, useState } from 'react';
import { Tables } from '../supabase/db';
import { getProfile } from '@/app/app/(modules)/account/api';
import { usePathname } from 'next/navigation';

type Profile = Tables<'profiles'>;

type State = {
  profile: Profile | null;
  isLoading: boolean;
};

const initialState: State = {
  profile: null,
  isLoading: true,
};

type Action = { type: 'SET_PROFILE'; payload: Profile | null } | { type: 'CLEAR_PROFILE' };

const profileReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_PROFILE':
      return { ...state, profile: action.payload, isLoading: false };
    case 'CLEAR_PROFILE':
      return { profile: null, isLoading: false };
    default:
      return state;
  }
};

type ProfileContextType = State & {
  dispatch: Dispatch<Action>;
  refetchProfile: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(profileReducer, initialState);
  const [fetchCount, setFetchCount] = useState(0);
  const pathname = usePathname();

  const refetchProfile = async () => {
    const res = await getProfile();
    if (!res) {
      console.log('Profile not available');
      dispatch({ type: 'CLEAR_PROFILE' });
      return;
    }
    console.log('Setting profile', { profile: res });
    dispatch({ type: 'SET_PROFILE', payload: res });
    setFetchCount((c) => c + 1);
  };

  // console.log({ pathname });

  useEffect(() => {
    if (fetchCount > 0) return;
    if (pathname !== '/') return;
    if (state.profile) return;
    refetchProfile();
  }, [fetchCount, pathname, state.profile]);

  return <ProfileContext.Provider value={{ ...state, dispatch, refetchProfile }}>{children}</ProfileContext.Provider>;
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
