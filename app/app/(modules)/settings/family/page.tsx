'use client';

import { updateFamily } from '@/app/app/onboarding/actions';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { getUpdatedImageName } from '@/utils';
import { cn } from '@/utils/clsx';
import { useProfile } from '@/utils/context/profileContext';
import { ACCEPTED_IMAGE_TYPES, familyInfoSchema } from '@/utils/zod/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader, Pencil, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const Family = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [firstLoad, setFirstLoad] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isImageEditMode, setIsImageEditMode] = useState(false);
  const { family, isLoading, refetchProfile } = useProfile();
  const imageName = useMemo(() => getUpdatedImageName(family?.image), [family?.image]);

  const form = useForm<z.infer<typeof familyInfoSchema>>({
    resolver: zodResolver(familyInfoSchema),
    defaultValues: { title: family?.title ?? '', image: family?.image ?? '' },
  });

  useEffect(() => {
    if (isLoading) return;
    if (firstLoad) {
      form.reset({ title: family?.title ?? '', image: family?.image ?? '' });
      setFirstLoad(false);
    }
  }, [family, firstLoad, form, isLoading]);

  const handleSubmit = async (values: z.infer<typeof familyInfoSchema>) => {
    if (!family) return;
    const res = await updateFamily({
      id: family?.id,
      title: values.title,
      image: values.image[0],
      imageName,
    });
    if (res) {
      await refetchProfile();
      setIsImageEditMode(false);
      setImagePreview(null);
      toast.success('Info updated successfully!');
    } else {
      toast.error('Oops! Something went wrong!');
    }
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
    <div className="flex flex-col bg-white shadow-lg rounded-2xl w-full xl:w-[35vw]">
      {!family ? (
        <div className="p-4 flex items-center justify-center">
          <Loader className="animate-spin" />
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex flex-col gap-8 p-4 xl:p-8 rounded-lg">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Family space title</FormLabel>
                    <FormControl>
                      <Input placeholder="ex: Brad's home" {...field} />
                    </FormControl>
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
                    <FormLabel>Family Image</FormLabel>
                    <FormControl>
                      <div className={cn('flex flex-col justify-center items-center gap-4')}>
                        {isImageEditMode ? (
                          imagePreview ? (
                            <div
                              className="relative flex items-center justify-center w-full h-80 rounded-lg overflow-hidden"
                              onClick={() => {
                                document.getElementById('image-upload')?.click();
                              }}
                            >
                              <Image
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                                width={200}
                                height={200}
                              />
                            </div>
                          ) : (
                            <div
                              className={`w-full h-80 flex flex-col items-center justify-center border-2 rounded-md ${
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
                          )
                        ) : (
                          <div>
                            <div className="flex items-center justify-center w-full h-80 rounded-lg overflow-hidden">
                              <Image
                                src={family?.image ?? '/family.jpg'}
                                className="w-full h-full object-cover"
                                alt="my-family"
                                width={200}
                                height={150}
                              />
                            </div>
                            <Button variant={'ghost'} onClick={() => setIsImageEditMode(true)}>
                              <Pencil size={16} />
                              <p className="text-xs">Edit</p>
                            </Button>
                          </div>
                        )}
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

                        {isImageEditMode && (
                          <Button
                            variant={'ghost'}
                            onClick={() => {
                              setImagePreview(null);
                              setIsImageEditMode(false);
                            }}
                          >
                            <X size={16} />
                            <p className="text-xs">Cancel</p>
                          </Button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default Family;
