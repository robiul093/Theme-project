import { AppError } from "../../utils/app_error";
import { Media_Model } from "./media.schema";
import { User_Model } from "../auth/auth.schema";
import { uploadToCloudinary } from "../../utils/cloudinaryUploader";
import { Character_Pack_Model } from "../character_pack/character_pack.schema";

const add_media_into_db = async (payload: any, files: any) => {
  const pack = await Character_Pack_Model.findById(payload.packId);
  if (!pack) {
    throw new AppError(404, "Character Pack not found");
  }

  if (files?.file?.[0]) {
    const fileUpload = await uploadToCloudinary(files.file[0]);
    payload.fileUrl = fileUpload.url;
    if (payload.type === "wallpaper" && !files?.coverImage?.[0]) {
      payload.coverImage = fileUpload.url;
    }
  } else {
    throw new AppError(400, "Media file is required");
  }

  if (files?.coverImage?.[0]) {
    const coverUpload = await uploadToCloudinary(files.coverImage[0]);
    payload.coverImage = coverUpload.url;
  }

  const result = await Media_Model.create(payload);
  return result;
};

const update_media_in_db = async (mediaId: string, payload: Partial<any>, files?: any) => {
  const isMediaExist = await Media_Model.findOne({ _id: mediaId, isDeleted: { $ne: true } });
  if (!isMediaExist) {
    throw new AppError(404, "Media not found or deleted");
  }

  if (files?.file?.[0]) {
    const fileUpload = await uploadToCloudinary(files.file[0]);
    payload.fileUrl = fileUpload.url;
  }

  if (files?.coverImage?.[0]) {
    const coverUpload = await uploadToCloudinary(files.coverImage[0]);
    payload.coverImage = coverUpload.url;
  }

  const result = await Media_Model.findOneAndUpdate(
    { _id: mediaId, isDeleted: { $ne: true } },
    payload,
    { new: true }
  );
  
  return result;
};

const soft_delete_media_from_db = async (mediaId: string) => {
  const result = await Media_Model.findOneAndUpdate(
    { _id: mediaId, isDeleted: { $ne: true } },
    { isDeleted: true },
    { new: true }
  );
  if (!result) {
    throw new AppError(404, "Media not found");
  }
  return result;
};

const increment_view_count = async (mediaId: string) => {
  const result = await Media_Model.findOneAndUpdate(
    { _id: mediaId, isDeleted: { $ne: true } },
    { $inc: { views: 1 } },
    { new: true }
  );
  if (!result) {
    throw new AppError(404, "Media not found");
  }
  return result;
};

const toggle_favorite_media = async (mediaId: string, userEmail: string) => {
  const user = await User_Model.findOne({ email: userEmail });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  
  const media = await Media_Model.findOne({ _id: mediaId, isDeleted: { $ne: true } });
  if (!media) {
    throw new AppError(404, "Media not found or deleted");
  }
  
  const isFavorited = user.favoriteMedia?.some(id => id.toString() === mediaId.toString());
  
  if (isFavorited) {
    await User_Model.findByIdAndUpdate(user._id, {
      $pull: { favoriteMedia: mediaId },
    });
    return { favorited: false };
  } else {
    await User_Model.findByIdAndUpdate(user._id, {
      $addToSet: { favoriteMedia: mediaId },
    });
    return { favorited: true };
  }
};

const get_single_media_from_db = async (mediaId: string) => {
  const result = await Media_Model.findOne({ _id: mediaId, isDeleted: { $ne: true } });
  if (!result) {
    throw new AppError(404, "Media not found or deleted");
  }
  return result;
};

export const media_service = {
  get_single_media_from_db,
  add_media_into_db,
  update_media_in_db,
  soft_delete_media_from_db,
  increment_view_count,
  toggle_favorite_media,
};
