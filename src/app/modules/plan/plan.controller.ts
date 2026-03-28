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

const update_plan = catchAsync(async (req: Request, res: Response) => {
    const { name, description } = req.body;
    if(!name && !description){
        throw new AppError(400, "Name or description are required");
    }
    const { id } = req.params;
    const result = await Plan_Service.update_plan_in_db(id, req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Plan updated successfully",
        data: result,
    });
});

const toggle_plan = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await Plan_Service.toggle_plan_status(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Plan status toggled successfully",
        data: result,
    });
});

const get_active_plans = catchAsync(async (req: Request, res: Response) => {
    const result = await Plan_Service.get_active_plans();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Active plans fetched successfully",
        data: result,
    });
});

export const Plan_Controller = {
    plan_create,
    update_plan,
    toggle_plan,
    get_active_plans,
}