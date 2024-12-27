import connectDB from "../config/database";
import { seedClickEvents } from "./click-events";
import { seedShortUrls } from "./shortUrls";
import { seedUsers } from "./user";

export const seedInit = async () => {
  try {
    console.log("Starting seed initialization...");

    // Connect to the database
    console.log("Connecting to the database...");
    await connectDB();
    console.log("Database connection established.");

    // User creation
    console.log("Running pre-DB Users creation script...");
    await seedUsers(20);
    console.log("User creation completed successfully.");

    // ShortUrls script
    console.log("Running ShortUrls Creation script...");
    await seedShortUrls(100);
    console.log("ShortUrls Creation completed successfully.");

    // Click Events script
    console.log("Running ClickEvents Creation script...");
    await seedClickEvents(2000);
    console.log("ClickEvents Creation completed successfully.");

    console.log("Seed initialization completed.");

    process.exit(0); // Exit the process once the seeding is done
  } catch (error) {
    console.error("Error during seed initialization:", error);
    process.exit(1); // Exit with an error code if something goes wrong
  }
};

seedInit();
