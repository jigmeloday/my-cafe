import { z } from 'zod';
export const INSERT_CAFE_SCHEMA = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  subTitle: z.string().min(1, 'Subtitle is required'),
  description: z.string().min(1, 'Description is required'),
  website: z.string().trim().url('Please enter a valid website URL').optional(),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-()\s]{6,20}$/, 'Please enter a valid phone number')
    .optional(),
  email: z.string().trim().email('Please enter a valid email address'), // required
  socialLinks: z.record(z.string(), z.string().url()).optional(),
  googleMap: z.string().trim().url('Please enter a valid map URL').optional(),
  // logo: z.string().url('Please enter a valid map URL'),
  openTime: z.string().min(1, 'Open time is required'),
  closeTime: z.string().min(1, 'Close time is required'),
  themeColor: z
    .string()
    .regex(/^#([0-9A-F]{3}){1,2}$/i, 'Theme color must be a valid hex code'),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
  isFeature: z.boolean().default(false).optional(),
  closed: z.boolean().default(false).optional(),
  isActive: z.boolean().default(false).optional(),
  ownerId: z
    .string()
    .uuid('Owner ID must be a valid UUID')
    .nullable()
    .optional(),
});
export const INSERT_CAFE_BE_SCHEMA = INSERT_CAFE_SCHEMA.extend({
  logo: z.string().url('Invalide url'),
});

export const INSERT_MENU_SCHEMA = z.object({
  name: z
    .string()
    .min(2, 'Menu name must be at least 2 characters long')
    .max(100, 'Menu name cannot exceed 100 characters'),

  slug: z.string().optional(),
  price: z.number().nonnegative('Price cannot be negative').nullable(),
  discount: z
    .number()
    .min(0, 'Discount cannot be negative')
    .max(100, 'Discount cannot exceed 100%').nullable()
    .optional(),
  spicyRate: z
    .number()
    .int('Spicy rate must be a whole number')
    .min(0, 'Spicy rate must be at least 0')
    .max(5, 'Spicy rate cannot exceed 5')
    .nullable()
    .optional(),
  prepTime: z
    .number()
    .int('Preparation time must be a whole number')
    .min(1, 'Preparation time must be at least 1 minute')
    .optional(),
  description: z
    .string()
    .min(5, 'Description must be at least 5 characters long'),
  categoryId: z.string().min(1, 'Please select a category'),
  ingredients: z.array(z.string().min(1, 'Ingredient cannot be empty')).max(10, 'You can add up to 10 ingredients only'),
  calories: z.number().nonnegative('Calories cannot be negative').optional(),
  protein: z.number().nonnegative('Protein cannot be negative').optional(),
  fat: z.number().nonnegative('Fat cannot be negative').optional(),
  carbs: z.number().nonnegative('Carbohydrates cannot be negative').optional(),
  isAvailable: z.boolean(),
  archived: z.boolean(),
});

export const INSERT_MENU_BE_SCHEMA = INSERT_MENU_SCHEMA.extend({
  imageUrls: z.array(z.string()), 
  price: z.number().nonnegative('Price cannot be negative'),
  cafeId: z.string(),
});

export const INSERT_BANNER_SCHEMA = z.object({
  cafeId: z.string(),
  title: z.string().min(2, 'Banner titile is required').nullable(),
  subtitle: z.string().min(2, 'Banner subtitle is required').nullable(), // allows string or null
  buttonText: z.string().optional(), // optional
  link: z.string().url(), // optional
  active: z.boolean(),
  startDate: z.date().nullable().optional(), // allow null or undefined
  endDate: z.date().nullable().optional(), // allow null or undefined
});

export const INSERT_BANNER_BE_SCHEMA = INSERT_BANNER_SCHEMA.extend({
  imageUrl: z.string().url(),
  startDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  endDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
});

export const SIGN_IN_SCHEMA = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character'
    ),
});

export const SIGN_UP_SCHEMA = z
  .object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character'
      ),
    confirmPassword: z.string(),
    userType: z.enum(['user', 'owner'], {
      error: 'Please select a user type',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'], // attaches the error to confirmPassword field
  });

export const FORGOT_PASSWORD_SCHEMA = z.object({
  email: z.string().email('Invalid email address'),
});

export const RESET_PASSWORD_SCHEMA = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'], // attaches the error to confirmPassword field
  });

export const INSERT_ADDRESS_SCHEMA = z.object({
  street: z.string().min(2, 'Street must be at least 2 characters long'),
  city: z.string().min(2, 'City must be at least 2 characters long'),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().min(2, 'Country name must be at least 2 characters long'),
  // map: z.string().url('Map link must be a valid URL').optional(),
  // isDefault: z.coerce.boolean().default(false),
});

export const INSERT_ADDRESS_BE_SCHEMA = z.object({
  
  street: z.string().min(2, 'Street must be at least 2 characters long'),
  city: z.string().min(2, 'City must be at least 2 characters long'),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().min(2, 'Country name must be at least 2 characters long'),
  cafeId: z.string().optional()
  // map: z.string().url('Map link must be a valid URL').optional(),
  // isDefault: z.coerce.boolean().default(false),
});

export const INSERT_IMAGE_SCHEMA = z.object({
  image: z.instanceof(File),
});