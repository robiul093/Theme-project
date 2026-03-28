import { Plan_Model } from "../modules/plan/plan.schema";
import { Plan_Service } from "../modules/plan/plan.service";
import { plan_duration_type } from "../../constants/plan.constant";

const initialPlans = [
    {
        name: "Silver",
        price: 29,
        duration: 1,
        duration_type: plan_duration_type.MONTHLY,
        description: "Standard plan with essential features.",
        is_active: true,
    },
    {
        name: "Gold",
        price: 49,
        duration: 1,
        duration_type: plan_duration_type.MONTHLY,
        description: "Premium plan with all features included.",
        is_active: true,
    },
];

export const seedPlans = async () => {
    try {
        const existingPlans = await Plan_Model.countDocuments();
        if (existingPlans === 0) {
            console.log("Seeding plans...");
            for (const plan of initialPlans) {
                //@ts-ignore
                await Plan_Service.create_plan_into_db(plan);
            }
            console.log("Plans seeded successfully.");
        } else {
            console.log("Plans already exist. Skipping seed.");
        }
    } catch (error) {
        console.error("Error seeding plans:", error);
    }
};
