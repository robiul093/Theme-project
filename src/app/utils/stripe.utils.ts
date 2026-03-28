import Stripe from "stripe";
import config from "../config";

const stripe = new Stripe(config.stripe.stripe_secret_key!, {
    //@ts-ignore
    apiVersion: "2026-03-25.dahlia", 
});

export const create_stripe_product = async (name: string, description?: string) => {
    const product = await stripe.products.create({
        name,
        description,
    });
    return product;
};

export const update_stripe_product = async (productId: string, name: string, description?: string) => {
    const product = await stripe.products.update(productId, {
        name,
        description,
    });
    return product;
};

export const create_stripe_price = async (productId: string, unitAmount: number, interval: "month" | "year") => {
    const price = await stripe.prices.create({
        product: productId,
        unit_amount: unitAmount * 100, // Stripe expects amounts in cents
        currency: "usd",
        recurring: {
            interval: interval === "month" ? "month" : "year",
        },
    });
    return price;
};

export const create_checkout_session = async (priceId: string, userId: string, successUrl: string, cancelUrl: string) => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        mode: "subscription",
        success_url: successUrl,
        cancel_url: cancelUrl,
        client_reference_id: userId,
        metadata: {
            userId,
        },
    });
    return session;
};

export const stripe_webhook_construct_event = (payload: string | Buffer, signature: string) => {
    return stripe.webhooks.constructEvent(payload, signature, config.stripe.stripe_webhook_secret!);
};

export const Stripe_Utils = {
    create_stripe_product,
    update_stripe_product,
    create_stripe_price,
    create_checkout_session,
    stripe_webhook_construct_event,
};
