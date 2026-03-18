import { model, Schema } from "mongoose";
import { TCharacterPack, TMedia } from "./character_pack.interface";

const character_pack_schema = new Schema<TCharacterPack>(
    {
        name: String,
        description: String,

        type: {
            type: String,
            enum: ["free", "premium"],
            required: true,
        },

        price: Number,

        coverImage: String,

        status: {
            type: String,
            enum: ["draft", "published"],
            default: "draft",
        },

        views: { type: Number, default: 0 },
        downloads: { type: Number, default: 0 },
        purchases: { type: Number, default: 0 },
        conversionRate: { type: Number, default: 0 },
    },
    { timestamps: true }
);

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
    createdAt: { type: Date, default: Date.now },
});

export const Media_Model = model<TMedia>("Media", media_schema);

export const Character_Pack_Model = model<TCharacterPack>(
    "CharacterPack",
    character_pack_schema
);