import { Router } from "express";
import auth from "../../middlewares/auth";
import { Plan_Controller } from "./plan.controller";
import { USER_ROLE } from "../../../constants/auth.constant";


const router = Router();

router.post("/create-plan", auth(USER_ROLE.ADMIN), Plan_Controller.plan_create)

export const plan_route = router;