import { Router } from "express";
import { authRouter } from "./app/modules/auth/auth.route";
import { characterPackRouter } from "./app/modules/character_pack/character_pack.route";
import { mediaRouter } from "./app/modules/media/media.route";
import { plan_route } from "./app/modules/plan/plan.route";

const appRouter = Router();

const moduleRoutes = [
    { path: "/auth", route: authRouter },
    { path: "/character-pack", route: characterPackRouter },
    { path: "/media", route: mediaRouter },
    { path: "/plan", route: plan_route },
];

moduleRoutes.forEach((route) => appRouter.use(route.path, route.route));

export default appRouter;
