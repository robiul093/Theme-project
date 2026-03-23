import { Types } from "mongoose";

export type TMediaType = "wallpaper" | "audio" | "video";

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
    isDeleted: boolean;

    createdAt?: Date;
}
