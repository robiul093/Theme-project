import { Plan_Model } from "./plan.schema";
import { IPlan } from "./plan.interface"



const create_plan_into_db = async (payload: IPlan) => {
    const { name } = payload;
    const is_plan_exist = await Plan_Model.findOne({ name });
    if (is_plan_exist) {
        throw new Error("Plan already exists");
    }
    const result = await Plan_Model.create(payload);
    return result;
}

export const Plan_Service = {
    create_plan_into_db
}