import { selectUserPreferencesSchema } from "@/db/schema/userPreferences";
import { z } from "zod";

export type UserPreferences = z.infer<typeof selectUserPreferencesSchema>
export type UserEmailPreferences = Pick<UserPreferences,"newsletter"|"orderUpdates"|"promotions"|"recommendations">
export type UserPrivacyPreferences = Pick<UserPreferences,"orderHistoryVisible"|"profileVisible"|"reviewsVisible"|"wishlistVisible">