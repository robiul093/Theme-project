import { z } from "zod";

export const media_create_schema = z.object({
  packId: z.string().min(1, "packId is required"),
  type: z.enum(["wallpaper", "audio", "video"]),
  title: z.string().optional(),
  author: z.string().optional(),
  prompt: z.string().optional(),
});

export const media_update_schema = z.object({
  packId: z.string().optional(),
  type: z.enum(["wallpaper", "audio", "video"]).optional(),
  title: z.string().optional(),
  author: z.string().optional(),
  prompt: z.string().optional(),
});

export const media_validation = {
  media_create_schema,
  media_update_schema,
};
