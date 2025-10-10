import { z } from 'zod';

export const INSERT_CAFE_SCHEMA = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  subTitle: z.string().nullable().optional(),
  logo: z.string().url('Logo must be a valid URL').nullable().optional(),
  openTime: z.string().min(1, 'Open time is required'),
  closeTime: z.string().min(1, 'Close time is required'),
  isFeature: z.boolean().default(false).optional(),
  themeColor: z
    .string()
    .regex(/^#([0-9A-F]{3}){1,2}$/i, 'Theme color must be a valid hex code'),
  closed: z.boolean().default(false).optional(),
});

export const INSERT_MENU_SCHEMA = z.object({
  cafeId: z.string().uuid('Cafe ID must be a valid UUID'),
  name: z.string().min(2, 'Menu name must be at least 2 characters long'),
  img: z.string().url('Image must be a valid URL').nullable().optional(),
  price: z.number().nonnegative('Price must be a non-negative number'),
  spicyRate: z.number().int().min(0).max(5).nullable().optional(), // assuming a scale 0-5
  ingredients: z.array(z.string()).nullable().optional(),
});

export const INSERT_BANNER_SCHEMA = z.object({
 cafeId: z.string(),
  title: z.string().nullable(),      // allows string or null
  subtitle: z.string().nullable(),   // allows string or null
  imageUrl: z.string().url(),
  buttonText: z.string().optional(), // optional
  link: z.string().url(), // optional
  active: z.boolean().default(false),
  startDate: z.date().nullable().optional(), // allow null or undefined
  endDate: z.date().nullable().optional(),   // allow null or undefined
  createdAt: z.date().default(() => new Date()),
})

export const SIGN_IN_SCHEMA = z.object({
 email: z.string().email('Invalid email address'),
 password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character'
    ),
  });

  export const SIGN_UP_SCHEMA = z
  .object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
      ),
    confirmPassword: z.string(),
    userType: z.enum(["user", "owner"], {
      error: "Please select a user type",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // attaches the error to confirmPassword field
  });