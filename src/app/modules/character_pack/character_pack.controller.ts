import { Request, Response } from "express";
import catchAsync from "../../utils/catch_async";
import { sendResponse } from "../../utils/send_response";
import { character_pack_service } from "./character_pack.service";

const create_character_pack = catchAsync(async (req: Request, res: Response) => {
    const result = await character_pack_service.create_pack_into_db(req.body, req.files);

    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Character pack created successfully",
        data: result,
    });
});

export const character_pack_controller = {
    create_character_pack,
};