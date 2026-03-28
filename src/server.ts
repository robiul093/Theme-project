import mongoose from "mongoose";
import { app } from "./app";
import config from "./app/config";
import { seedPlans } from "./app/DB/plan_seeder";

async function main() {
  try {
    await mongoose.connect(config.database_url!);
    console.log("Database connected successfully");

    // Seed default plans on startup
    await seedPlans();

    app.listen(config.port, () => {
      console.log(`Server listening on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
