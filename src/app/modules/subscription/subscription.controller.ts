import { Request, Response } from "express";
import catchAsync from "../../utils/catch_async";
import { sendResponse } from "../../utils/send_response";
import { Subscription_Service } from "./subscription.service";
import { AppError } from "../../utils/app_error";

const createCheckoutSession = catchAsync(async (req: Request, res: Response) => {
    const { planId } = req.params;
    if (!planId) {
        throw new AppError(400, "Plan ID is required");
    }
    const user = req.user as any;
    const userId = user?._id;

    if (!userId) {
        throw new AppError(401, "User not authenticated");
    }

    const sessionUrl = await Subscription_Service.create_checkout_session(userId, planId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Checkout session created successfully",
        data: { sessionUrl },
    });
});

const handleStripeWebhook = catchAsync(async (req: Request, res: Response) => {
    const signature = req.headers["stripe-signature"] as string;

    if (!signature) {
        throw new AppError(400, "Stripe signature missing");
    }

    // Stripe webhook requires the raw body (Buffer)
    // Assuming express.raw() or a similar middleware is used for the webhook route
    await Subscription_Service.handle_webhook(req.body, signature);

    res.status(200).send({ received: true });
});

export const Subscription_Controller = {
    createCheckoutSession,
    handleStripeWebhook,
};
