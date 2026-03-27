import { Request, Response } from "express";
import catchAsync from "../../utils/catch_async";
import { sendResponse } from "../../utils/send_response";
import { Plan_Service } from "./plan.service";
import { IPlan } from "./plan.interface";
import { AppError } from "../../utils/app_error";


const plan_create = catchAsync(async (req: Request, res: Response) => {
    const payload: IPlan = req.body;
    if (!payload) {
        throw new AppError(400, "Payload is required");
    }
    const result = await Plan_Service.create_plan_into_db(payload);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Plan created successfully",
        data: result,
    });
})

export const Plan_Controller = {
    plan_create
}