

import { model, Schema } from "mongoose";
import { TPurchase } from "./purchase.interface";


const purchase_schema = new Schema<TPurchase>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    packId: {
        type: Schema.Types.ObjectId,
        ref: "CharacterPack",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    stripeSubscriptionId: {
        type: String,
        required: true,
    },
})

export const Purchase_Model = model<TPurchase>("Purchase", purchase_schema)