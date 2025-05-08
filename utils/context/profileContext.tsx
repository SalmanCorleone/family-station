'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode, Dispatch } from 'react';
import { Tables } from '../supabase/db';
import { getFamilyMembers, getProfile } from '@/app/app/(modules)/account/actions';
import { createClient } from '../supabase/client';

type Profile = Tables<'profiles'>;
type Family = Tables<'family'>;
type FamilyMember = Tables<'family_members'>;

type State = {
  profile: Profile | null;
  family: Family | null;
  members: FamilyMember[] | null;
  isLoading: boolean;
};

const initialState: State = {
  profile: null,
  family: null,
  members: null,
  isLoading: true,
};

type Action =
  | { type: 'SET_PROFILE'; payload: Profile | null }
  | { type: 'SET_MEMBERS'; payload: FamilyMember[] | null }
  | { type: 'SET_FAMILY'; payload: Family | null }
  | { type: 'CLEAR' };

const profileReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_PROFILE':
      return { ...state, profile: action.payload, isLoading: false };
    case 'SET_MEMBERS':
      return { ...state, members: action.payload, isLoading: false };
    case 'SET_FAMILY':
      return { ...state, family: action.payload, isLoading: false };
    case 'CLEAR':
      return { profile: null, family: null, members: null, isLoading: false };
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

  const refetchProfile = async () => {
    const supabase = createClient();
    const profile = await getProfile();
    if (!profile) {
      console.log('Profile not available');
      dispatch({ type: 'CLEAR' });
      return;
    }
    if (profile.family_id) {
      const familyMembers = await getFamilyMembers(profile.family_id);
      if (familyMembers) dispatch({ type: 'SET_MEMBERS', payload: familyMembers });
    }
    if (profile.family) {
      const { data } = supabase.storage.from('').getPublicUrl(profile.family.image ?? '');
      const publicUrl = data?.publicUrl;
      const family = { ...profile.family, image: publicUrl };
      console.log({ family });
      dispatch({ type: 'SET_FAMILY', payload: family });
    }
    dispatch({ type: 'SET_PROFILE', payload: profile });
  };

  useEffect(() => {
    if (state.profile) return;
    refetchProfile();
  }, [state.profile]);

  return <ProfileContext.Provider value={{ ...state, dispatch, refetchProfile }}>{children}</ProfileContext.Provider>;
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
