import OnboardingSteps from './_components/onboaardingSteps';

const OnboardingPage = async () => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen px-4">
      <h1 className="text-3xl">Welcome</h1>
      <p>Let&apos;s get you set up!</p>
      <OnboardingSteps />
    </div>
  );
};

export default OnboardingPage;
