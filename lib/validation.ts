import { z } from "zod";

export const brandSchema = z.object({
  name: z.string().min(1, "Brand Name is required"),
  projectName: z.string().min(1, "Campaign / Project Name is required"),
  year: z.number().int().min(2000).max(2100),
  logoImage: z.string().optional(),
});

export const colorsSchema = z.object({
  primary: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/, "Valid HEX required"),
  secondary: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/, "Valid HEX required"),
  accent: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/, "Valid HEX required"),
});

export const typographySchema = z.object({
  display: z.string().min(1, "Display Font required"),
  secondary: z.string().min(1, "Secondary Font required"),
  caption: z.string().min(1, "Caption Font required"),
});

export const editingSchema = z.object({
  pacing: z.number().min(0).max(100),
  styles: z.array(z.string()).min(1, "Select or add at least one edit style"),
});

export const wardrobeSchema = z.object({
  tone: z.array(z.string()),
  colors: z.array(z.string()),
  images: z.array(z.string()),
});

export const backgroundSchema = z.object({
  tone: z.array(z.string()),
  locations: z.array(z.string()),
  images: z.array(z.string()),
});

export const fullFrameworkSchema = z.object({
  brand: brandSchema,
  colors: colorsSchema,
  typography: typographySchema,
  editing: editingSchema,
  wardrobe: wardrobeSchema,
  background: backgroundSchema,
});
