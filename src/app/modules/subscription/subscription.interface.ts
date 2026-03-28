import { ObjectId } from "mongoose"

export type TSubscription = {
    userId: ObjectId;
    planId: ObjectId;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    stripeSubscriptionId: string;
    status: string;
}