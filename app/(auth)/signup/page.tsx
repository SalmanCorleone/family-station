import { Button } from '@/components/ui/button';
import { signup } from '../actions';
import SignInWithGoogle from '../login/_components/signInWithGoogle';

const Signup = () => {
  return (
    <div className="bg-white flex flex-col items-center justify-center p-4 xl:p-8 rounded-xl">
      <div className="w-sm">
        <div>
          <h2 className="text-2xl font-bold">Sign Up</h2>
          <p className="mt-2 text-sm">Enter your information to create an account</p>
        </div>
        <form action={signup}>
          <div className="flex flex-col gap-6 mt-4">
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                className="border border-gray-200 rounded text-lg p-2"
                id="email"
                name="email"
                type="email"
                placeholder="me@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                {/* <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-sm">
                    Forgot your password?
                  </a> */}
              </div>
              <input
                className="border border-gray-200 rounded text-lg p-2"
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Sign up
            </Button>
            <SignInWithGoogle />
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <a href="/login" className="underline underline-offset-4">
              Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
