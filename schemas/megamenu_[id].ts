import { z } from 'zod';

// Menu item schema
export const megaMenuItemSchema = z.object({
  id: z.number().optional(),
  label: z.string().min(1, 'Item label is required'),
  route: z.string().nullish(),
  type: z.string().nullish(),
  image: z.string().nullish(),
  first: z.boolean().default(false),
  sortOrder: z.number().default(0),
  filterId: z.number().nullish(),
  categoryValueId: z.number().nullish(),
});

// Section schema
export const megaMenuSectionSchema = z.object({
  id: z.number().optional(),
  label: z.string().min(1, 'Section label is required'),
  variant: z.string().nullish(),
  sortOrder: z.number().default(0),
  items: z.array(megaMenuItemSchema),
});

// Column schema
export const megaMenuColumnSchema = z.object({
  id: z.number().optional(),
  sortOrder: z.number().default(0),
  sections: z.array(megaMenuSectionSchema),
});

// Category schema
export const megaMenuCategorySchema = z.object({
  id: z.number().optional(),
  label: z.string().min(1, 'Label is required'),
  root: z.boolean().default(false),
  sortOrder: z.number().default(0),
  columns: z.array(megaMenuColumnSchema),
});

// Main mega menu schema
export const megaMenuSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().nullish(),
  isActive: z.boolean().default(true),
  categories: z.array(megaMenuCategorySchema),
});
