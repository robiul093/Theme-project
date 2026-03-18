import { Types } from "mongoose";

export type TPackType = "free" | "premium";

export type TPackStatus = "draft" | "published";

export type TMediaType = "wallpaper" | "audio" | "video";


export type TCharacterPack = {
    _id?: string;

    name: string;
    description?: string;

    type: TPackType;
    price?: number;

    coverImage: string;

    status: TPackStatus;

    views: number;
    downloads: number;
    purchases: number;
    conversionRate: number;

    createdAt?: Date;
    updatedAt?: Date;
}

export type TMedia = {
    _id?: string;

    packId: Types.ObjectId;

    type: TMediaType;

    title: string;
    author: string;

    coverImage: string;
    fileUrl: string;

    prompt?: string; // only wallpaper

    views: number;
    downloads: number;

    createdAt?: Date;
}