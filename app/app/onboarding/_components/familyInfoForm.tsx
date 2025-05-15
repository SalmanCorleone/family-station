'use client';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { familyInfoSchema } from '@/utils/zod/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { motion, cubicBezier } from 'framer-motion';
import { useProfile } from '@/utils/context/profileContext';

interface IFamilyInfoFormProps {
  onSubmit: (data: z.infer<typeof familyInfoSchema>) => void;
}

const FamilyInfoForm = ({ onSubmit }: IFamilyInfoFormProps) => {
  const { profile } = useProfile();
  const form = useForm<z.infer<typeof familyInfoSchema>>({
    resolver: zodResolver(familyInfoSchema),
    defaultValues: { title: '' },
  });
  const name = profile?.full_name ? profile.full_name.split(' ')[0] : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ease: cubicBezier(0.77, 0, 0.175, 1), duration: 0.3 }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-8 p-4 rounded-lg flex-1 bg-white shadow">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Family space title</FormLabel>
                  <FormControl>
                    <Input
                      className="border-0 border-b m-0 text-3xl xl:text-4xl mt-4 h-min"
                      placeholder={`ex: ${name ?? 'Brad'}'s home`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Continue</Button>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

export default FamilyInfoForm;
