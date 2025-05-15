import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { signUpSchema } from '@/utils/zod/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import SignInWithGoogle from '../../login/_components/signInWithGoogle';
import { signup } from '../../actions';
import { toast } from 'sonner';
import { z } from 'zod';
import { useState } from 'react';
import { Eye } from 'lucide-react';

const SignupForm = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const form = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const handleSubmit = async (data: z.infer<typeof signUpSchema>) => {
    const res = await signup(data);
    if (!res.success) {
      toast.error(res.message);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="flex flex-col gap-6 mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative flex items-center">
                    <div
                      className="absolute right-1 w-6 h-6 cursor-pointer"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                    >
                      <Eye stroke={passwordVisible ? 'var(--color-green)' : 'var(--color-ash)'} />
                    </div>
                    <Input type={passwordVisible ? 'text' : 'password'} placeholder="Password" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
    </Form>
  );
};

export default SignupForm;
