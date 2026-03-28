import { Plan_Model } from "./plan.schema";
import { IPlan } from "./plan.interface";
import { Stripe_Utils } from "../../utils/stripe.utils";
import { AppError } from "../../utils/app_error";

const create_plan_into_db = async (payload: IPlan) => {
    const { name, description, price, duration_type } = payload;
    
    const is_plan_exist = await Plan_Model.findOne({ name });
    if (is_plan_exist) {
        throw new AppError(400, "Plan already exists");
    }

    // 1. Create Product in Stripe
    const stripeProduct = await Stripe_Utils.create_stripe_product(name, description);
    
    // 2. Create Price in Stripe
    const interval = duration_type === "MONTHLY" ? "month" : "year";
    const stripePrice = await Stripe_Utils.create_stripe_price(stripeProduct.id, price, interval);

    // 3. Save to DB with Stripe IDs
    payload.stripe_product_id = stripeProduct.id;
    payload.stripe_price_id = stripePrice.id;

    const result = await Plan_Model.create(payload);
    return result;
};

const update_plan_in_db = async (id: string, payload: Partial<IPlan>) => {
    const plan = await Plan_Model.findById(id);
    if (!plan) {
        throw new AppError(404, "Plan not found");
    }

    // If name or description changes, update Stripe Product
    if (payload.name || payload.description) {
        await Stripe_Utils.update_stripe_product(
            plan.stripe_product_id,
            payload.name || plan.name,
            payload.description || plan.description
        );
    }

    // If price or duration changes, we must create a NEW Stripe Price
    if (payload.price || payload.duration_type) {
        const interval = (payload.duration_type || plan.duration_type) === "MONTHLY" ? "month" : "year";
        const newPrice = await Stripe_Utils.create_stripe_price(
            plan.stripe_product_id,
            payload.price || plan.price,
            interval
        );
        payload.stripe_price_id = newPrice.id;
    }

    const result = await Plan_Model.findByIdAndUpdate(id, payload, { new: true });
    return result;
};

const toggle_plan_status = async (id: string) => {
    const plan = await Plan_Model.findById(id);
    if (!plan) {
        throw new AppError(404, "Plan not found");
    }
    const result = await Plan_Model.findByIdAndUpdate(id, { is_active: !plan.is_active }, { new: true });
    return result;
};

const get_active_plans = async () => {
    return await Plan_Model.find({ is_active: true });
};

export const Plan_Service = {
    create_plan_into_db,
    update_plan_in_db,
    toggle_plan_status,
    get_active_plans,
};