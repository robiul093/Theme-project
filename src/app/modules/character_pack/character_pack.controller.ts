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

export const character_pack_controller = {
  create_character_pack,
  get_all_character_pack,
  get_single_character_pack,
};
