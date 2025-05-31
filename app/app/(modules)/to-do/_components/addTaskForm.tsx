import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { addTaskSchema } from '@/utils/zod/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface IAddTaskFormProps {
  onSubmit: (data: z.infer<typeof addTaskSchema>) => void;
  markedIndexForRemoval?: string;
}

const AddTaskForm = ({ onSubmit }: IAddTaskFormProps) => {
  const form = useForm<z.infer<typeof addTaskSchema>>({
    resolver: zodResolver(addTaskSchema),
    defaultValues: { title: '' },
  });

  const handleSubmit = async (data: z.infer<typeof addTaskSchema>) => {
    form.reset();
    onSubmit(data);
  };

  return (
    <motion.div layout="position">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="flex rounded-lg bg-white hover:bg-muted cursor-pointer p-2 shadow">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input placeholder="+ Add new item" className="border-0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

export default AddTaskForm;
