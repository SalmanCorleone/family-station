'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { getFileExtension, getUpdatedImageName } from '@/utils';
import { useProfile } from '@/utils/context/profileContext';
import { ACCEPTED_IMAGE_TYPES, accountSchema } from '@/utils/zod/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, User } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { updateProfile } from './actions';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';

const Account = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [firstLoad, setFirstLoad] = useState(true);
  const [isNewImage, setIsNewImage] = useState(false);
  const { profile, isLoading, refetchProfile } = useProfile();
  const form = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      fullName: profile?.full_name ?? '',
      image: undefined,
    },
  });
  const profileImageName = useMemo(
    () => getUpdatedImageName(profile?.avatar_url, profile?.isImageInBucket),
    [profile?.avatar_url, profile?.isImageInBucket],
  );

  useEffect(() => {
    if (isLoading) return;
    if (firstLoad) {
      form.reset({ fullName: profile?.full_name ?? '' });
      setFirstLoad(false);
    }
  }, [profile, firstLoad, form, isLoading]);

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
    setIsNewImage(true);
  };

  const onSubmit = async (data: z.infer<typeof accountSchema>) => {
    console.log(data);
    const file = data.image[0];
    const ext = getFileExtension(file);
    console.log({ filename: file.name, ext });
    if (!profile?.id) return;
    const payload = {
      id: profile?.id,
      fullName: data.fullName,
      profilePic: file,
      isNewImage,
      profileImageName,
    };
    const updatedProfile = await updateProfile(payload);
    if (!updatedProfile) {
      toast.error('Oops! Something went wrong!');
      return;
    } else {
      // refetch profile
      await refetchProfile();
      toast.success('Profile updated successfully!');
    }
  };

  return (
    <div className="flex flex-col bg-white shadow p-4 gap-4 rounded-2xl">
      <div>
        <h2 className="text-xl font-bold">Account Settings</h2>
        <p className="text-gray-500 text-sm">
          Update your personal information and how others see you on the platform.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="image"
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Profile Picture</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-6">
                      {imagePreview ? (
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={imagePreview} alt={form.watch('fullName')} />
                          <AvatarFallback>
                            <User className="h-10 w-10" />
                          </AvatarFallback>
                        </Avatar>
                      ) : profile?.avatar_url ? (
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={profile?.avatar_url} alt={form.watch('fullName')} />
                          <AvatarFallback>
                            <User className="h-10 w-10" />
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <Avatar className="h-20 w-20 flex items-center justify-center bg-muted">
                          <User className="h-10 w-10" />
                        </Avatar>
                      )}
                      <div className="space-y-2">
                        <div className="relative">
                          <Input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              onChange(e.target.files);
                              handleImageChange(e.target.files);
                            }}
                            {...fieldProps}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            className="relative"
                            // disabled={isUploading}
                            onClick={() => document.getElementById('avatar-upload')?.click()}
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            {'Upload new image'}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">JPG, PNG or JPEG. 1MB max.</p>
                      </div>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <Label>Email</Label>
              <p className="text-sm text-muted-foreground">{profile?.email}</p>
            </div>

            <div>
              <Label>Phone</Label>
              <p className="text-sm text-muted-foreground">{profile?.phone || '(not set)'}</p>
            </div>
          </div>

          <div className="mt-4">
            <Button type="submit" disabled={!form.formState.isDirty || form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Account;
