"use server";

import ContactFormEmail from "@/components/mail/ContactFormEmail";
import MessageReplyEmail from "@/components/mail/message-reply-email";
import { db } from "@/db";
import { messages } from "@/db/schema/messages";
import { getSession } from "@/lib/auth-server";
import { errorMsgs } from "@/lib/error";
import { getTenantId } from "@/lib/tenant";
import { hardSanitizeForDom, hardSanitizeIfExistsForDom } from "@/lib/utils";
import { contactUsformSchema, validateResendApiKey } from "@/types/mail";
import { Resend } from "resend";
import { z } from "zod";


export async function submitContactForm(values: z.infer<typeof contactUsformSchema>) {
  try {
    const [storeId,session] = await Promise.all([
      getTenantId(),
      getSession()
    ]) 

    await db.insert(messages).values({
      storeId,
      "email":values.email,
      "userId":session?.user_id,
      "message":hardSanitizeForDom(values.message),
      "name":hardSanitizeForDom(values.name),
      "updatedAt":new Date(),
      "createdAt":new Date(),
      "phone":hardSanitizeIfExistsForDom(values.phone),
      "category":values.category,
      "subject":hardSanitizeForDom(values.subject)
    })

    const emailPrefs = await db.query.storeEmailPreferences.findFirst({
      "where":(storeEmailPreferences,{eq})=>eq(storeEmailPreferences.storeId,storeId),
      "columns":{
        "resendApiKey":true,
        "fromEmail": true,
        "replyToEmail": true,
        "emailSenderName": true,      
        "customerMessageNotificationEmail": true,      
        "notifyOnCustomerMessage":true
      }
    })
    if(
      !emailPrefs
      ||
      !validateResendApiKey(emailPrefs?.resendApiKey)
      ||
      !emailPrefs.notifyOnCustomerMessage
      ||
      !emailPrefs.customerMessageNotificationEmail
    ) return {"success":true}
    const resend = new Resend(emailPrefs.resendApiKey!);
    const { data, error } = await resend.emails.send({
      from: `${emailPrefs.emailSenderName} <${emailPrefs.fromEmail}>`,
      to: [emailPrefs.customerMessageNotificationEmail], // Your support email
      subject: `New Contact Form Submission: ${values.subject}`,
      react: ContactFormEmail({ ...values }), // Your custom React email template
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return {"error":"something went wrong, try again later."}
  }
}

export async function replyToMessage(messageId:string,replyText:string) {
  try {
    const [storeId,session] = await Promise.all([
      getTenantId(),
      getSession()
    ]) 

    if(!session || session.user_role !== "seller" || !session.stores.includes(storeId)) return {"error":errorMsgs.NotAuthorized}

    const [emailPrefs,message] = await Promise.all([
      db.query.storeEmailPreferences.findFirst({
        "where":(storeEmailPreferences,{eq})=>eq(storeEmailPreferences.storeId,storeId),
        "columns":{
          "resendApiKey":true,
          "fromEmail": true,
          "replyToEmail": true,
          "emailSenderName": true,      
          "customerMessageNotificationEmail": true,      
          "notifyOnCustomerMessage":true
        }
      }),
      db.query.messages.findFirst({
        "where":(messages,{eq,and})=>and(
          eq(messages.storeId,storeId),
          eq(messages.id,messageId),
        ),
        "columns":{
          "name":true,
          "email": true,
          "subject": true,
        }
      }),
    ]) 
    if(
      !emailPrefs
      ||
      !validateResendApiKey(emailPrefs?.resendApiKey)
      ||
      !message
    ) return {"success":true}

    const resend = new Resend(emailPrefs.resendApiKey!);
    const { data, error } = await resend.emails.send({
      from: `${emailPrefs.emailSenderName} <${emailPrefs.fromEmail}>`,
      to: [message.email], // Your support email
      subject: `A reply to your message: "${message.subject}"`,
      react: MessageReplyEmail({
        "username":message.name,
        "replyText":replyText,
        "logoUrl":"https://primsrv.com/imgs/logo.png"
      }),
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return {"error":"something went wrong, try again later."}
  }
}
