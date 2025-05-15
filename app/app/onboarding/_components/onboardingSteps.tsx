'use client';

import { useState } from 'react';
import FamilyInfoForm from './familyInfoForm';
import { z } from 'zod';
import { familyInfoSchema } from '@/utils/zod/schemas';
import InviteMembersForm from './inviteMembersForm';
import { createFamily } from '../actions';

const OnboardingSteps = () => {
  const [step, setStep] = useState(1);
  const [inviteLink, setInviteLink] = useState('');
  const origin = window.location.origin;

  const onFamilyFormSubmit = async (data: z.infer<typeof familyInfoSchema>) => {
    console.log('on main component', data);
    const file = data.image[0];
    const res = await createFamily({ title: data.title, image: file });
    if (!res) return;
    if (res.invitation_token) setInviteLink(`${origin}/app/invite/${res.invitation_token}`);
    setStep(2);
  };

  const onContinueFromInvite = () => {};

  return (
    <div className="rounded-md w-full lg:w-[40vw]">
      {step === 1 && <FamilyInfoForm onSubmit={onFamilyFormSubmit} />}
      {step === 2 && <InviteMembersForm inviteLink={inviteLink} onSubmit={onContinueFromInvite} />}
    </div>
  );
};

export default OnboardingSteps;
