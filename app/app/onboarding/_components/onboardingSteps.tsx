'use client';

import { Button } from '@/components/ui/button';
import { getFileExtension } from '@/utils';
import { familyImageSchema, familyInfoSchema } from '@/utils/zod/schemas';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { createFamily, FamilyType, updateFamily } from '../actions';
import FamilyImageForm from './familyImageForm';
import FamilyInfoForm from './familyInfoForm';
import InviteMembersForm from './inviteMembersForm';
import StepProgress from './stepProgress';
import { useProfile } from '@/utils/context/profileContext';

const OnboardingSteps = () => {
  const [step, setStep] = useState(1);
  const { family: familyFromContext } = useProfile();
  const [family, setFamily] = useState<FamilyType | undefined>();
  const router = useRouter();
  const origin = window.location.origin;
  const inviteLink = useMemo(
    () => (family ? `${origin}/app/invite/${family.invitation_token ?? ''}` : ''),
    [family, origin],
  );

  /**
   * Manually visiting onboarding, who has family
   */
  useEffect(() => {
    if (familyFromContext) {
      setFamily(familyFromContext);
      setStep(3);
    }
  }, [familyFromContext]);

  const onFamilyFormSubmit = async (data: z.infer<typeof familyInfoSchema>) => {
    const res = await createFamily({ title: data.title });
    if (!res) return;
    setFamily(res);
    setStep(2);
  };

  const onImageSubmit = async (data: z.infer<typeof familyImageSchema>) => {
    if (!family?.id) {
      console.log('No family id ---- onImageSubmit');
      return;
    }
    if (!data?.image?.[0]) {
      setStep(3);
      return;
    }
    const file = data.image[0];
    const res = await updateFamily({
      id: 1,
      title: family?.title || 'My Family',
      image: file,
      imageName: `family_${family.id}__0.${getFileExtension(file)}`,
    });
    if (!res) {
      toast.error('Failed to upload image. Try again from settings later');
      setStep(3);
    }
    setStep(3);
  };

  const onContinueFromInvite = () => {
    router.replace('/app');
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
