import { z } from 'zod';

const MAX_FILE_SIZE = 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const familyInfoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(20, 'Title must be 50 characters or less'),
  image: z
    .any()
    .refine(
      (files) => ['image/png', 'image/jpeg', 'image/jpg'].includes(files?.[0]?.type),
      'File type must be png or jpeg',
    )
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, 'File size must be less than 1MB')
    .optional(),
});

export { familyInfoSchema, ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE };
