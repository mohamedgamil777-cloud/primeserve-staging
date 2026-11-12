"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { submitContactForm } from "@/actions/mail"; // Your server action
import { contactUsformSchema } from "@/types/mail";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { messageCategory, messageCategoryLabels } from "@/db/schema/messages";
import { useTranslations } from "next-intl";

export default function ContactUsForm() {
  const t = useTranslations()
  const { data } = useCurrentUser()
  const [isSending, setIsSending] = useState(false)
  const form = useForm<z.infer<typeof contactUsformSchema>>({
    resolver: zodResolver(contactUsformSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      category: "general",
      message: "",
    },
  });

  useEffect(()=>{
    if(data) form.reset({
      "name":`${data.firstName} ${data.lastName}`
    })
  },[data])

  // Handle form submission
  async function onSubmit(values: z.infer<typeof contactUsformSchema>) {
    setIsSending(true)
    try {
      const res = await submitContactForm(values);
      toast.success(t('message-sent-successfully-well-get-back-to-you-within-24-hours'));
      form.reset();
    } catch (error) {
      toast.error(t('failed-to-send-message-please-try-again'));
    }
    setIsSending(false)
  }

  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight mb-6">{t('send-us-a-message')}</h2>
      <p className="text-muted-foreground mb-8">
        {t('fill-out-the-form-below-and-well-get-back-to-you-within-24-hours-for-urgent-matters-please-call-our-customer-service-line')}
      </p>
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('full-name')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('your-name')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('email-address-1')}</FormLabel>
                      <FormControl>
                        <Input placeholder="your@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category Field */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('category')}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className=" w-full">
                            <SelectValue placeholder={t('select-a-category')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {
                            messageCategory.map(mc=>(
                              <SelectItem key={mc} value={mc}>{messageCategoryLabels[mc]}</SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Subject Field */}
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('subject')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('subject-of-your-message')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>


              {/* Message Field */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('message')}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('your-message-here')}
                        rows={6}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button disabled={isSending} type="submit" className="w-full">
                <Send className="h-4 w-4 mr-2" />
                {t('send-message')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}