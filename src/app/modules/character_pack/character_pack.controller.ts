import { Request, Response } from "express";
import catchAsync from "../../utils/catch_async";
import { sendResponse } from "../../utils/send_response";
import { character_pack_service } from "./character_pack.service";
import { AppError } from "../../utils/app_error";

const create_character_pack = catchAsync(async (req: Request, res: Response) => {
  const files = req.files as any;
  if (!files?.cover?.[0]?.buffer) {
    throw new Error("No cover file buffer found");
  }
  const result = await character_pack_service.create_pack_into_db(req.body, req.files);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Character pack created successfully",
    data: result,
  });
});

const get_all_character_pack = catchAsync(async (req: Request, res: Response) => {
  const result = await character_pack_service.get_all_character_pack_from_db();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Retrieve all character pack successfully",
    data: result,
  });
});

const get_single_character_pack = catchAsync(async (req: Request, res: Response) => {
  const packId = req?.params?.id;

  if (!packId) {
    throw new AppError(404, "Character pack id not found");
  }
  const result = await character_pack_service.get_single_character_pack_from_db(packId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Character pack retrieve successfully",
    data: result,
  });
});

const update_pack = catchAsync(async (req: Request, res: Response) => {
  const packId = req.params.id;
  const result = await character_pack_service.update_pack_in_db(packId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Character pack updated successfully",
    data: result,
  });
});

const soft_delete_pack = catchAsync(async (req: Request, res: Response) => {
    const packId = req.params.id;
    await character_pack_service.soft_delete_pack_from_db(packId);
  
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Character pack deleted successfully",
      data: null,
    });
});
  
const increment_view = catchAsync(async (req: Request, res: Response) => {
    const packId = req.params.id;
    const result = await character_pack_service.increment_view_count(packId);
  
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Character pack view count incremented successfully",
      data: result,
    });
});
  
const toggle_favorite = catchAsync(async (req: Request, res: Response) => {
    const packId = req.params.id;
    const userEmail = req.user?.email;
  
    if (!userEmail) throw new AppError(401, "Unauthorized");
  
    const result = await character_pack_service.toggle_favorite_pack(packId, userEmail);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: result.favorited ? "Character pack added to favorites" : "Character pack removed from favorites",
      data: result,
    });
});

export const character_pack_controller = {
  create_character_pack,
  get_all_character_pack,
  get_single_character_pack,
  update_pack,
  soft_delete_pack,
  increment_view,
  toggle_favorite
};
