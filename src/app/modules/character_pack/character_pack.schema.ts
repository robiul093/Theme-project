import { model, Schema } from "mongoose";
import { TCharacterPack } from "./character_pack.interface";

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
        isDeleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const Character_Pack_Model = model<TCharacterPack>(
    "CharacterPack",
    character_pack_schema
);