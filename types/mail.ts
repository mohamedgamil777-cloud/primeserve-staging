import { insertContactMessageSchema } from "@/db/schema/messages";
import { insertStoreEmailPreferencesSchema, selectStoreEmailPreferencesSchema } from "@/db/schema/storeEmailPreferences";
import { z } from "zod";

export const validateResendApiKey = (apiKey?:string|null) => {
  return !!apiKey && apiKey.startsWith("re_") && apiKey.length > 10
};

export const contactUsformSchema = insertContactMessageSchema.pick({
  "name":true,
  "email":true,
  "category":true,
  "subject":true,
  "message":true,
  "phone":true,
})

type StoreEmailPreferencesSchema =  z.infer<typeof selectStoreEmailPreferencesSchema>

export const storeEmailProviderConfigSchema = insertStoreEmailPreferencesSchema.pick({
  "resendApiKey":true,
  "fromEmail":true,
  "emailSenderName":true,
  "replyToEmail":true,
})

export type EmailProviderConfig = Pick<StoreEmailPreferencesSchema,"resendApiKey"|"fromEmail"|"emailSenderName"|"replyToEmail">

export const storeAdminEmailNotificationsConfigSchema = insertStoreEmailPreferencesSchema.pick({
  notifyOnNewOrder: true,
  notifyOnOrderStatusChange: true,
  orderNotificationEmail: true,

  notifyOnServiceRequest: true,
  notifyOnServiceStatusChange: true,
  serviceNotificationEmail: true,

  notifyOnCustomerMessage: true,
  customerMessageNotificationEmail: true,
})

export type AdminEmailNotificationsConfig = Pick<StoreEmailPreferencesSchema,"notifyOnNewOrder"|"notifyOnOrderStatusChange"|"orderNotificationEmail"|"notifyOnServiceRequest"|"notifyOnServiceStatusChange"|"serviceNotificationEmail"|"notifyOnCustomerMessage"|"customerMessageNotificationEmail">

export const storeAuthSupportSettingsSchema = insertStoreEmailPreferencesSchema.pick({
  supportPasswordReset: true,
  supportEmailVerification: true,
  supportPromotionalEmails: true,
})

export type StoreAuthSupportSettings = Pick<StoreEmailPreferencesSchema,"supportPasswordReset"|"supportEmailVerification"|"supportPromotionalEmails">

export const storeCustomerEmailNotificationsConfigSchema = insertStoreEmailPreferencesSchema.pick({
  notifyCustomerOnOrderStatusChange: true,
  notifyCustomerOnServiceStatusChange: true,
})

export type AdminCustomerNotificationsConfig = Pick<StoreEmailPreferencesSchema,"notifyCustomerOnOrderStatusChange"|"notifyCustomerOnServiceStatusChange">