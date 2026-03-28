import { Router } from "express";
import { Subscription_Controller } from "./subscription.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../../../constants/auth.constant";

const router = Router();

// Regular subscription checkout
router.post("/create-checkout-session/:planId", auth(USER_ROLE.USER), Subscription_Controller.createCheckoutSession);

// Stripe webhook (must be raw body)
// In app.ts, this specific route should use express.raw({type: 'application/json'})
router.post("/webhook", Subscription_Controller.handleStripeWebhook);

export const Subscription_Routes = router;
