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

const familyImageSchema = z.object({
  image: z
    .any()
    .refine(
      (files) => ['image/png', 'image/jpeg', 'image/jpg'].includes(files?.[0]?.type),
      'File type must be png or jpeg',
    )
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, 'File size must be less than 1MB')
    .optional(),
  // imageName: z.string().optional(),
});

const inviteSchema = z.object({
  email: z.string().email('Invalid email'),
});

const inviteFormSchema = z.object({
  invitees: z.array(inviteSchema).min(1, {
    message: 'You need at least one invitee.',
  }),
});

const signUpSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'name must be 50 characters or less'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(100, 'Password must be 100 characters or less'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(100, 'Password must be 100 characters or less'),
});

const addFinancialRecordSchema = z.object({
  amount: z.number().min(1, 'Amount must be greater than 0').max(1000000, 'Amount must be less than 1 million'),
  category: z.string().min(1, 'Category is required'),
  note: z.string().optional(),
  created_at: z.string().optional(),
  profile_id: z.string(),
  family_id: z.number(),
});

const addTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(30, 'Title must be 30 characters or less'),
});

const accountSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: 'Full name must be at least 2 characters' })
    .max(50, { message: 'Full name must be less than 50 characters' }),
  image: z
    .any()
    .refine(
      (files) => ['image/png', 'image/jpeg', 'image/jpg'].includes(files?.[0]?.type),
      'File type must be png or jpeg',
    )
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, 'File size must be less than 1MB')
    .optional(),
  phone: z.string().optional(),
  socials: z.object({
    twitter: z.string().optional(),
    instagram: z.string().optional(),
    facebook: z.string().optional(),
  }),
});

export {
  familyInfoSchema,
  familyImageSchema,
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE,
  inviteFormSchema,
  signUpSchema,
  loginSchema,
  addTaskSchema,
  addFinancialRecordSchema,
  accountSchema,
};
