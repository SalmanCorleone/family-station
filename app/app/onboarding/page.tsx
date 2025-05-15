import OnboardingSteps from './_components/onboardingSteps';

const OnboardingPage = async () => {
  return (
    <div className="flex flex-col gap-4 items-center h-screen px-4">
      <div className="pt-[20vh] flex flex-col items-center justify-center">
        <h1 className="text-3xl">Welcome</h1>
        <p>Let&apos;s get you set up!</p>
      </div>
      <OnboardingSteps />
    </div>
  );
};

export default OnboardingPage;
