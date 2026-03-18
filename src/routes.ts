import { Router } from "express";
import { authRouter } from "./app/modules/auth/auth.route";
import { characterPackRouter } from "./app/modules/character_pack/character_pack.route";

const appRouter = Router();

const moduleRoutes = [
    { path: "/auth", route: authRouter },
    { path: "/character-pack", route: characterPackRouter },
];

moduleRoutes.forEach((route) => appRouter.use(route.path, route.route));

export default appRouter;
