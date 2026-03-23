import { model, Schema } from "mongoose";
import { TMedia } from "./media.interface";

const media_schema = new Schema<TMedia>({
    packId: {
        type: Schema.Types.ObjectId as any,
        ref: "CharacterPack",
        required: true,
    },

    type: {
        type: String,
        enum: ["wallpaper", "audio", "video"],
        required: true,
    },

    title: String,
    author: String,

    coverImage: String,
    fileUrl: String,

    prompt: String,

    views: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

export const Media_Model = model<TMedia>("Media", media_schema);
