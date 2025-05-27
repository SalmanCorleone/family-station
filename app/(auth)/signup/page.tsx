import { Suspense } from 'react';
import SignupForm from './_components/signupForm';

const Signup = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupForm />
    </Suspense>
  );
};

export default Signup;
