import { AppError } from "../../utils/app_error";
import { uploadToCloudinary } from "../../utils/cloudinaryUploader";
import { Character_Pack_Model, Media_Model } from "./character_pack.schema";

const create_pack_into_db = async (body: any, files: any) => {
    if (!files?.cover?.[0]) {
        throw new AppError(400, "Pack cover image is required");
    }

    // 1️⃣ upload pack cover
    const coverUpload = await uploadToCloudinary(files.cover[0]);

    // 2️⃣ create pack
    const pack = await Character_Pack_Model.create({
        name: body.name,
        description: body.description,
        type: body.type,
        price: body.price,
        coverImage: coverUpload.url,
    });

    const mediaList = [];

    // 3️⃣ wallpapers
    if (files.wallpapers && Array.isArray(files.wallpapers)) {
        for (const file of files.wallpapers) {
            const upload = await uploadToCloudinary(file);

            mediaList.push({
                packId: pack._id,
                type: "wallpaper",
                title: body.title || "Wallpaper",
                author: body.author,
                fileUrl: upload.url,
                coverImage: upload.url,
                prompt: body.prompt,
            });
        }
    }

    // 4️⃣ audios
    if (files.audios && Array.isArray(files.audios)) {
        for (const file of files.audios) {
            const upload = await uploadToCloudinary(file);

            mediaList.push({
                packId: pack._id,
                type: "audio",
                title: body.title || "Audio",
                author: body.author,
                fileUrl: upload.url,
                coverImage: body.audioCover,
            });
        }
    }

    // 5️⃣ videos
    if (files.videos && Array.isArray(files.videos)) {
        for (const file of files.videos) {
            const upload = await uploadToCloudinary(file);

            mediaList.push({
                packId: pack._id,
                type: "video",
                title: body.title || "Video",
                author: body.author,
                fileUrl: upload.url,
                coverImage: body.videoCover,
            });
        }
    }

    // 6️⃣ save media
    if (mediaList.length > 0) {
        await Media_Model.insertMany(mediaList);
    }

    return {
        pack,
        mediaCount: mediaList.length,
    };
};

export const character_pack_service = {
    create_pack_into_db,
};