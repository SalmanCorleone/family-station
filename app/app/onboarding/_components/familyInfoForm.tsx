'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageIcon, Upload } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ACCEPTED_IMAGE_TYPES, familyInfoSchema } from '@/utils/zod/schemas';
import { cn } from '@/utils/clsx';

interface IFamilyInfoFormProps {
  onSubmit: (data: z.infer<typeof familyInfoSchema>) => void;
}

const FamilyInfoForm = ({ onSubmit }: IFamilyInfoFormProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const form = useForm<z.infer<typeof familyInfoSchema>>({
    resolver: zodResolver(familyInfoSchema),
    defaultValues: { title: '', image: '' },
  });

  const handleImageChange = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) {
      setImagePreview(null);
      return;
    }
    const file = fileList[0];
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setImagePreview(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (values: z.infer<typeof familyInfoSchema>) => {
    // Do something with the form values.
    // console.log(values);
    onSubmit(values);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const fileList = e.dataTransfer.files;
      form.setValue('image', fileList, { shouldValidate: true });
      handleImageChange(fileList);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="flex flex-col gap-8 p-4 rounded-lg">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Family space title</FormLabel>
                <FormControl>
                  <Input placeholder="ex: Brad's home" {...field} />
                </FormControl>
                {/* <FormDescription>This is your family space name.</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            render={({ field: { onChange, value, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Family Image (optional)</FormLabel>
                <FormControl>
                  <div className={cn('flex flex-col justify-center items-center gap-4')}>
                    <div
                      className={`w-full h-32 flex flex-col items-center justify-center border-2 rounded-md ${
                        isDragging
                          ? 'border-primary border-dashed bg-primary/10'
                          : 'border-dashed border border-gray-400 hover:border-primary/50 hover:bg-muted/50'
                      } transition-colors cursor-pointer`}
                      onClick={() => {
                        document.getElementById('image-upload')?.click();
                      }}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <Upload className="h-6 w-6 mb-2" />
                      <span>{isDragging ? 'Drop image here' : 'Upload image'}</span>
                      <span className="text-xs text-muted-foreground mt-1">Drag & drop or click to browse</span>
                      <span className="text-xs text-muted-foreground">JPG, PNG up to 5MB</span>
                    </div>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        onChange(e.target.files);
                        handleImageChange(e.target.files);
                      }}
                      {...fieldProps}
                    />

                    <div className="relative flex items-center justify-center w-32 h-32 border rounded-full overflow-hidden">
                      {imagePreview ? (
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          width={200}
                          height={200}
                        />
                      ) : (
                        <ImageIcon size={80} color="var(--color-gray-500)" />
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormDescription className="text-center">Image preview</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Continue</Button>
        </div>
      </form>
    </Form>
  );
};

export default FamilyInfoForm;
