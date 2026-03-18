import express from 'express';
import { character_pack_controller } from './character_pack.controller';
import { upload } from '../../utils/cloudinaryUploader';

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
    character_pack_controller.create_character_pack
);

export const characterPackRouter = router;