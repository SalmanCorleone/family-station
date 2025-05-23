'use client';

import { Button } from '@/components/ui/button';
import SignInWithGoogle from './_components/signInWithGoogle';
import { login } from '../actions';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { loginSchema } from '@/utils/zod/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Eye, Heart } from 'lucide-react';

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const form = useForm({
    resolver: zodResolver(loginSchema),
  });

  const handleSubmit = async (data: z.infer<typeof loginSchema>) => {
    const res = await login(data);
    if (!res.success) {
      toast.error(res.message);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center">
        <Heart className="w-24 h-24" fill="var(--color-green)" />
      </div>
      <div className="bg-white flex flex-col items-center justify-center p-4 xl:p-8 rounded-xl">
        <div className="xl:w-sm w-full">
          <div>
            <h2 className="text-2xl font-bold">Login</h2>
            <p className="mt-2 text-sm">Enter your credentials below to login to your account</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="flex flex-col gap-6 mt-4">
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
                  Log In
                </Button>
                <SignInWithGoogle />
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{' '}
                <a href="/signup" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
