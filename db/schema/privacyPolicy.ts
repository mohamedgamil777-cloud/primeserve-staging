import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { stores } from "./stores";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const privacyPolicy = pgTable('privacy_policy', {  
  lastUpdated: text('last_updated'),
  overview: text('overview'),
  introduction: text('introduction'),
  dataCollection: text('data_collection'),
  dataUsage: text('data_usage'),
  dataSecurity: text('data_security'),
  cookies: text('cookies'),
  thirdParty: text('third_party'),
  contact: text('contact'),
  dataRetention: text('data_retention'),
  childrenPrivacy: text('children_privacy'),
  internationalDataTransfers: text('international_data_transfers'),
  changesToThisPolicy: text('changes_to_this_policy'),
  storeId: uuid("store_id").notNull().references(() => stores.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})


export const insertPrivacyPolicySchema = createInsertSchema(privacyPolicy).omit({
  "createdAt":true,
  "updatedAt":true,
  "storeId":true
})
  
export const selectPrivacyPolicySchema = createSelectSchema(privacyPolicy);
  