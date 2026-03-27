import { plan_duration_type } from "../../../constants/plan.constant";

export type IDurationType = keyof typeof plan_duration_type;

export type IPlan = {
    name: string,
    price: number,
    duration: number,
    duration_type: IDurationType,
    description: string,
    is_active: boolean,
    stripe_price_id: string,
    created_at: Date,
    updated_at: Date,
}