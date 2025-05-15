'use client';

import { useMemo, useState } from 'react';
import FamilyInfoForm from './familyInfoForm';
import { z } from 'zod';
import { familyImageSchema, familyInfoSchema } from '@/utils/zod/schemas';
import InviteMembersForm from './inviteMembersForm';
import { createFamily, FamilyType, updateFamily } from '../actions';
import FamilyImageForm from './familyImageForm';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import StepProgress from './stepProgress';
import { Button } from '@/components/ui/button';

const OnboardingSteps = () => {
  const [step, setStep] = useState(1);
  const [family, setFamily] = useState<FamilyType | undefined>();
  const router = useRouter();
  const origin = window.location.origin;
  const inviteLink = useMemo(
    () => (family ? `${origin}/app/invite/${family.invitation_token ?? ''}` : ''),
    [family, origin],
  );
  console.log({ inviteLink });

  const onFamilyFormSubmit = async (data: z.infer<typeof familyInfoSchema>) => {
    // todo: debug this
    console.log('reached');
    const res = await createFamily({ title: data.title });
    if (!res) return;
    setFamily(res);
    setStep(2);
  };

  const onImageSubmit = async (data: z.infer<typeof familyImageSchema>) => {
    console.log('on image submit', data);
    const file = data.image[0];
    const res = await updateFamily({
      id: 1,
      title: family?.title || 'My Family',
      image: file,
      imageName: data.imageName,
    });
    if (!res) {
      toast.error('Failed to upload image. Try again from settings later');
    }
    setStep(3);
  };

  const onContinueFromInvite = () => {
    router.replace('/app/dashboard');
  };

  return (
    <div className="flex flex-col gap-6 flex-1 w-full lg:w-[40vw]">
      <div className="flex justify-between">
        <Button onClick={() => setStep(step - 1)}>prev</Button>
        <Button onClick={() => setStep(step + 1)}>next</Button>
      </div>
      <StepProgress totalSteps={3} step={step} />
      {step === 1 && <FamilyInfoForm onSubmit={onFamilyFormSubmit} />}
      {step === 2 && <FamilyImageForm onSubmit={onImageSubmit} />}
      {step === 3 && <InviteMembersForm inviteLink={inviteLink} onSubmit={onContinueFromInvite} />}
    </div>
  );
};

export default OnboardingSteps;
