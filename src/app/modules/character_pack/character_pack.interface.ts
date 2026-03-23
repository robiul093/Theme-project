import { Types } from "mongoose";

export type TPackType = "free" | "premium";

export type TPackStatus = "draft" | "published";

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
    
    isDeleted: boolean;

    createdAt?: Date;
    updatedAt?: Date;
}