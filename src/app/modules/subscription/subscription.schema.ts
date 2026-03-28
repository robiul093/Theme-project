import { model, Schema } from "mongoose";
import { TSubscription } from "./subscription.interface";


const subscription_schema = new Schema<TSubscription>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    planId: {
        type: Schema.Types.ObjectId,
        ref: "Plan",
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    stripeSubscriptionId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
})

export const Subscription_Model = model<TSubscription>("Subscription", subscription_schema)