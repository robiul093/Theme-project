import { Router } from "express";
import { auth_controller } from "./auth.controller";
import RequestValidator from "../../middlewares/request_validator";
import { change_password_schema, delete_account_schema, login_schema, sign_up_schema, update_user_name_schema } from "./auth.validation";
import { verifyEmail } from "../../utils/verify-email";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../../../constants/auth.constant";
import { upload } from "../../utils/cloudinaryUploader";

const router = Router();

router.post("/register", RequestValidator(sign_up_schema), auth_controller.sign_up_user);
(router.post("/verify-otp", auth_controller.verify_otp),
  router.post("/login", RequestValidator(login_schema), auth_controller.login_user));
router.patch(
  "/change-password",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  RequestValidator(change_password_schema),
  auth_controller.change_password
);

router.post("/forgot-password", auth_controller.forgot_password);
router.post("/reset-password", auth_controller.reset_password);

router.get("/verify-email", verifyEmail);

router.post("/refresh-token", auth_controller.refresh_token);
router.post("/resend-otp", auth_controller.resend_otp);
router.delete("/delete-account", auth(USER_ROLE.ADMIN, USER_ROLE.USER), RequestValidator(delete_account_schema), auth_controller.delete_account);
router.patch("/update-name", auth(USER_ROLE.ADMIN, USER_ROLE.USER), RequestValidator(update_user_name_schema), auth_controller.update_user_name);
router.patch("/update-profile-image", auth(USER_ROLE.ADMIN, USER_ROLE.USER), upload.single("image"), auth_controller.update_profile_image);
router.get("/me", auth(USER_ROLE.ADMIN, USER_ROLE.USER), auth_controller.get_me);
export const authRouter = router;