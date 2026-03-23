import { AppError } from "../../utils/app_error";
import { Media_Model } from "./media.schema";
import { User_Model } from "../auth/auth.schema";

const update_media_in_db = async (mediaId: string, payload: Partial<any>) => {
  const result = await Media_Model.findByIdAndUpdate(mediaId, payload, {
    new: true,
  });
  if (!result) {
    throw new AppError(404, "Media not found");
  }
  return result;
};

const soft_delete_media_from_db = async (mediaId: string) => {
  const result = await Media_Model.findByIdAndUpdate(
    mediaId,
    { isDeleted: true },
    { new: true }
  );
  if (!result) {
    throw new AppError(404, "Media not found");
  }
  return result;
};

const increment_view_count = async (mediaId: string) => {
  const result = await Media_Model.findByIdAndUpdate(
    mediaId,
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

export const media_service = {
  update_media_in_db,
  soft_delete_media_from_db,
  increment_view_count,
  toggle_favorite_media,
};
