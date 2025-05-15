'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode, Dispatch, useCallback } from 'react';
import { createClient } from '../supabase/client';
import {
  FamilyMemberType,
  getFamilyMembers,
  getProfile,
  ProfileType,
} from '@/app/app/(modules)/settings/account/actions';

type Profile = ProfileType & { isImageInBucket?: boolean };
type Family = ProfileType['family'];
type FamilyMemberImageMap = Record<string, string | undefined>;

type State = {
  profile: Profile | null;
  family: Family | null;
  members: FamilyMemberType[] | null;
  membersImageMap: FamilyMemberImageMap | null;
  isLoading: boolean;
};

const initialState: State = {
  profile: null,
  family: null,
  members: null,
  membersImageMap: null,
  isLoading: true,
};

type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_PROFILE'; payload: Profile | null }
  | { type: 'SET_MEMBERS'; payload: FamilyMemberType[] | null }
  | { type: 'SET_MEMBERS_IMAGE_MAP'; payload: FamilyMemberImageMap | null }
  | { type: 'SET_FAMILY'; payload: Family | null }
  | { type: 'CLEAR' };

const profileReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_PROFILE':
      return { ...state, profile: action.payload };
    case 'SET_MEMBERS':
      return { ...state, members: action.payload };
    case 'SET_MEMBERS_IMAGE_MAP':
      return { ...state, membersImageMap: action.payload };
    case 'SET_FAMILY':
      return { ...state, family: action.payload };
    case 'CLEAR':
      return { profile: null, family: null, members: null, membersImageMap: null, isLoading: false };
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

  const refetchProfile = useCallback(async () => {
    console.log('fetching');
    dispatch({ type: 'SET_LOADING', payload: true });
    const supabase = createClient();
    const profile = await getProfile();
    if (!profile) {
      dispatch({ type: 'CLEAR' });
      return;
    }
    /**
     * Set members and membersImageMap
     */
    if (profile.family_id) {
      const familyMembers = await getFamilyMembers(profile.family_id);
      if (familyMembers?.length) {
        const imageMap = familyMembers.reduce((acc, member) => {
          let imageURL = undefined;
          if (member.profiles?.avatar_url) {
            const { data } = supabase.storage.from('').getPublicUrl(member.profiles?.avatar_url);
            imageURL = data.publicUrl;
          }
          if (member.profile_id) {
            acc[member.profile_id] = imageURL;
          }
          return acc;
        }, {} as FamilyMemberImageMap);
        dispatch({ type: 'SET_MEMBERS', payload: familyMembers });
        dispatch({ type: 'SET_MEMBERS_IMAGE_MAP', payload: imageMap });
      }
    }
    /**
     * Set family
     */
    if (profile.family) {
      let publicUrl = '';
      if (profile.family.image) {
        const { data } = supabase.storage.from('').getPublicUrl(profile.family.image);
        publicUrl = data?.publicUrl;
      }
      const family = { ...profile.family, image: publicUrl || null };
      dispatch({ type: 'SET_FAMILY', payload: family });
    }
    /**
     * Set profile
     */
    const profilePayload: Profile = { ...profile };
    if (profile.avatar_url && profile.avatar_url.startsWith('user-images')) {
      const { data } = supabase.storage.from('').getPublicUrl(profile.avatar_url);
      profilePayload.avatar_url = data?.publicUrl;
      profilePayload.isImageInBucket = true;
    }
    dispatch({ type: 'SET_PROFILE', payload: profilePayload });
    dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

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
