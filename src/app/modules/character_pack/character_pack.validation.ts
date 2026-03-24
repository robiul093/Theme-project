import { z } from "zod";

export const character_pack_create_schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["free", "premium"]),
  price: z.preprocess((val) => (val ? Number(val) : 0), z.number().optional()),
  status: z.enum(["draft", "published"]).optional(),
});

export const character_pack_update_schema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(["free", "premium"]).optional(),
  price: z.preprocess((val) => (val ? Number(val) : 0), z.number().optional()),
  status: z.enum(["draft", "published"]).optional(),
});

export const character_pack_validation = {
  character_pack_create_schema,
  character_pack_update_schema,
};
