import { Router } from "express";
import auth from "../../middlewares/auth";
import { Plan_Controller } from "./plan.controller";
import { USER_ROLE } from "../../../constants/auth.constant";


const router = Router();

router.post("/create-plan", auth(USER_ROLE.ADMIN), Plan_Controller.plan_create)
router.patch("/update/:id", auth(USER_ROLE.ADMIN), Plan_Controller.update_plan);
router.patch("/toggle/:id", auth(USER_ROLE.ADMIN), Plan_Controller.toggle_plan);
router.get("/active", Plan_Controller.get_active_plans);

export const plan_route = router;