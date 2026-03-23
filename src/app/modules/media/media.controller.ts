import { Request, Response } from "express";
import catchAsync from "../../utils/catch_async";
import { sendResponse } from "../../utils/send_response";
import { media_service } from "./media.service";
import { AppError } from "../../utils/app_error";

const update_media = catchAsync(async (req: Request, res: Response) => {
  const mediaId = req.params.id;
  const result = await media_service.update_media_in_db(mediaId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Media updated successfully",
    data: result,
  });
});

const soft_delete_media = catchAsync(async (req: Request, res: Response) => {
  const mediaId = req.params.id;
  await media_service.soft_delete_media_from_db(mediaId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Media deleted successfully",
    data: null,
  });
});

const increment_view = catchAsync(async (req: Request, res: Response) => {
  const mediaId = req.params.id;
  const result = await media_service.increment_view_count(mediaId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Media view count incremented successfully",
    data: result,
  });
});

const toggle_favorite = catchAsync(async (req: Request, res: Response) => {
  const mediaId = req.params.id;
  const userEmail = req.user?.email;

  if (!userEmail) {
    throw new AppError(401, "Unauthorized");
  }

  const result = await media_service.toggle_favorite_media(mediaId, userEmail);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: result.favorited ? "Media added to favorites" : "Media removed from favorites",
    data: result,
  });
});

export const media_controller = {
  update_media,
  soft_delete_media,
  increment_view,
  toggle_favorite,
};
