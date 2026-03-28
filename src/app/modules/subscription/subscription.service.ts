import { Plan_Model } from "../plan/plan.schema";
import { Subscription_Model } from "./subscription.schema";
import { Stripe_Utils } from "../../utils/stripe.utils";
import config from "../../config";
import { AppError } from "../../utils/app_error";

const create_checkout_session = async (userId: string, planId: string) => {
    const plan = await Plan_Model.findById(planId);
    if (!plan || !plan.is_active) {
        throw new AppError(404, "Plan not found or inactive");
    }

    const successUrl = `${config.frontend_url}/payment-success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${config.frontend_url}/payment-cancel`;

    const session = await Stripe_Utils.create_checkout_session(
        plan.stripe_price_id,
        userId,
        successUrl,
        cancelUrl
    );

    return session.url;
};

const handle_webhook = async (payload: any, signature: string) => {
    let event;
    try {
        event = Stripe_Utils.stripe_webhook_construct_event(payload, signature);
    } catch (err: any) {
        throw new AppError(400, `Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object as any;
            const userId = session.metadata.userId;
            const stripeSubscriptionId = session.subscription as string;

            // In a real scenario, you'd fetch the subscription details from Stripe to get the plan
            // For now, we'll assume the client reference ID or metadata has what we need

            // Simplified: Update or create subscription in DB
            // We'll need to know which planId it was
            break;
        }
        case "invoice.payment_succeeded": {
            const invoice = event.data.object as any;
            const stripeSubscriptionId = invoice.subscription as string;
            const userId = invoice.subscription_details?.metadata?.userId;

            // Find the subscription by stripeSubscriptionId and update
            break;
        }
        case "customer.subscription.deleted": {
            const subscription = event.data.object as any;
            await Subscription_Model.findOneAndUpdate(
                { stripeSubscriptionId: subscription.id },
                { isActive: false, status: "canceled" }
            );
            break;
        }
    }
};

export const Subscription_Service = {
    create_checkout_session,
    handle_webhook,
};
