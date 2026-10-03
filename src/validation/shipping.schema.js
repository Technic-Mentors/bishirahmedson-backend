import { z } from 'zod';

export const shippingSettingsSchema = z.object({
  body: z.object({
    defaultShippingRate: z.coerce.number().nonnegative(),
    freeShippingThreshold: z.coerce.number().nonnegative(),
  }),
});

export const shippingQuoteQuerySchema = z.object({
  query: z.object({
    city: z.string().trim().min(2).max(100),
    subtotal: z.coerce.number().nonnegative(),
  }),
});

export const shippingZoneBodySchema = z.object({
  body: z.object({
    city: z.string().trim().min(2).max(100),
    charge: z.coerce.number().nonnegative(),
    isActive: z.coerce.boolean().optional(),
  }),
});

export const shippingZoneIdParamSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
});

export const updateShippingZoneSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: z.object({
    city: z.string().trim().min(2).max(100),
    charge: z.coerce.number().nonnegative(),
    isActive: z.coerce.boolean().optional(),
  }),
});
