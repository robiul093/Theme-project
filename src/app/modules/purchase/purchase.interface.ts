import { ObjectId } from "mongoose"


export type TPurchase = {
    userId: ObjectId;
    packId: ObjectId;
    amount: number;
    stripeSubscriptionId: string;
}