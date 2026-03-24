import express from "express";
import { character_pack_controller } from "./character_pack.controller";
import { upload } from "../../utils/cloudinaryUploader";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../../../constants/auth.constant";
import RequestValidator from "../../middlewares/request_validator";
import { character_pack_validation } from "./character_pack.validation";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "cover", maxCount: 1 },
    { name: "wallpapers", maxCount: 20 },
    { name: "wallpaperCovers", maxCount: 20 },
    { name: "audios", maxCount: 20 },
    { name: "audioCovers", maxCount: 20 },
    { name: "videos", maxCount: 20 },
    { name: "videoCovers", maxCount: 20 },
  ]),
  RequestValidator(character_pack_validation.character_pack_create_schema),
  character_pack_controller.create_character_pack
);

router.get("/", character_pack_controller.get_all_character_pack);
router.get("/:id", character_pack_controller.get_single_character_pack);

router.patch("/:id", auth(USER_ROLE.ADMIN), upload.single("coverImage"), RequestValidator(character_pack_validation.character_pack_update_schema), character_pack_controller.update_pack);
router.delete("/:id", auth(USER_ROLE.ADMIN), character_pack_controller.soft_delete_pack);
router.patch("/:id/views", character_pack_controller.increment_view);
router.patch("/:id/favorite", auth(USER_ROLE.USER, USER_ROLE.ADMIN), character_pack_controller.toggle_favorite);

export const characterPackRouter = router;
