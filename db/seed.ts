import { seedPointEarningMethods } from "./seeds/pointEarningMethods";
import { seedPromotionCodes } from "./seeds/promotionCodes";
import { seedRewards } from "./seeds/rewards";
import { seedServiceCategories } from "./seeds/serviceCategories";
import { seedServices } from "./seeds/services";
import { seedStoreEmailPreferences } from "./seeds/storeEmailPreferences";
import { seedStores } from "./seeds/stores";
import { seedTiers } from "./seeds/tiers";

seedStores()
	.then(() => console.log("🎉 Done Seedings stores!"))
	.then(async()=>await seedStoreEmailPreferences())
	.then(() => console.log("🎉 Done Seedings Email Preferences!"))
	.then(async()=>await seedServiceCategories())
	.then(() => console.log("🎉 Done Seedings Service Categories!"))
	.then(async()=>await seedServices())
	.then(() => console.log("🎉 Done Seedings Services!"))
	.then(async()=>await seedRewards())
	.then(() => console.log("🎉 Done Seedings Rewards!"))
	.then(async()=>await seedTiers())
	.then(() => console.log("🎉 Done Seedings Tiers!"))
	.then(async()=>await seedPointEarningMethods())
	.then(() => console.log("🎉 Done Seedings Points Earning Methods!"))
	.then(async()=>await seedPromotionCodes())
	.then(() => console.log("🎉 Done Seedings Promotion Codes!"))
	.then(() => console.log("🎉 All Seedings are complete!"))
	.catch((err) => console.error("❌ Error during seeding:", err));