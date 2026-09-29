import { z } from 'zod';

export const MaterialCategorySchema = z.enum([
  'PCB',
  'CABLES',
  'BATTERIES',
  'CRT_TV',
  'LCD_LED',
  'MOTORS_MAGNETS',
  'MIXED_PLASTICS'
]);

export const ConditionGradeSchema = z.enum(['GOOD', 'BROKEN', 'BURNT']);

export const UserRoleSchema = z.enum(['COLLECTOR', 'RECYCLER', 'ADMIN']);

export const CollectorLoginSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid 10-digit Indian mobile number'),
  pin: z.string().length(4, 'PIN must be exactly 4 digits').optional(),
  otp: z.string().length(6, 'OTP must be 6 digits').optional(),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  language: z.string().default('hi')
});

export const RecyclerLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const CreateScrapLotSchema = z.object({
  client_uuid: z.string().optional(),
  category: MaterialCategorySchema,
  condition: ConditionGradeSchema.default('GOOD'),
  weight_kg: z.number().positive('Weight must be greater than 0 kg').max(5000, 'Single lot limit 5000 kg'),
  unit_price: z.number().positive('Unit price must be positive'),
  confidence_score: z.number().min(0).max(1).default(0.95),
  photo_urls: z.array(z.string()).default([]),
  photo_hashes: z.array(z.string()).default([]),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  location_name: z.string().optional(),
  matched_recycler_id: z.string().optional(),
  notes: z.string().optional()
});

export const VerifyHandoverSchema = z.object({
  qr_token: z.string().min(8, 'Invalid QR token'),
  fallback_code: z.string().optional(),
  actual_weight_kg: z.number().positive().optional(),
  actual_condition: ConditionGradeSchema.optional(),
  notes: z.string().optional()
});

export const RateUpdateSchema = z.object({
  category: MaterialCategorySchema,
  base_rate_per_kg: z.number().positive(),
  min_rate_per_kg: z.number().positive(),
  max_rate_per_kg: z.number().positive()
});
