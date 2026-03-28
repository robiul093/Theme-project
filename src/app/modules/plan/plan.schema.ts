import { model, Schema } from "mongoose";
import { IPlan } from "./plan.interface";
import { plan_duration_type } from "../../../constants/plan.constant";


const plan_schema = new Schema<IPlan>({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    duration_type: {
        type: String,
        enum: Object.values(plan_duration_type),
        required: true
    },
    description: {
        type: String
    },
    is_active: {
        type: Boolean,
        default: true
    },
    stripe_product_id: {
        type: String
    },
    stripe_price_id: {
        type: String
    }
}, { timestamps: true })

export const Plan_Model = model<IPlan>("Plan", plan_schema);