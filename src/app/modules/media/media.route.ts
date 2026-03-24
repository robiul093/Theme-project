import express from "express";
import { media_controller } from "./media.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../../../constants/auth.constant";
import RequestValidator from "../../middlewares/request_validator";
import { media_validation } from "./media.validation";
import { upload } from "../../utils/cloudinaryUploader";

const router = express.Router();

router.post(
    "/",
    auth(USER_ROLE.ADMIN),
    upload.fields([{ name: "file", maxCount: 1 }, { name: "coverImage", maxCount: 1 }]),
    RequestValidator(media_validation.media_create_schema),
    media_controller.add_media
);

router.patch(
    "/:id",
    auth(USER_ROLE.ADMIN),
    upload.fields([{ name: "file", maxCount: 1 }, { name: "coverImage", maxCount: 1 }]),
    RequestValidator(media_validation.media_update_schema),
    media_controller.update_media
);

router.get("/:id", media_controller.get_single_media);
router.delete("/:id", auth(USER_ROLE.ADMIN), media_controller.soft_delete_media);
router.patch("/:id/views", media_controller.increment_view);
router.patch("/:id/favorite", auth(USER_ROLE.USER, USER_ROLE.ADMIN), media_controller.toggle_favorite);

export const mediaRouter = router;
