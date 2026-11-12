"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription, Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmailProviderConfig, storeEmailProviderConfigSchema, validateResendApiKey } from "@/types/mail";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateStoreEmailProviderConfig } from "@/actions/store";

interface Props {
  initialData?:Partial<EmailProviderConfig>
}

export function StoreEmailProviderConfigForm({ initialData }: Props) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const form = useForm<z.infer<typeof storeEmailProviderConfigSchema>>({
    resolver: zodResolver(storeEmailProviderConfigSchema),
    defaultValues: {
      resendApiKey: initialData?.resendApiKey ?? "",
      fromEmail: initialData?.fromEmail ?? "",
      replyToEmail: initialData?.replyToEmail ?? "",
      emailSenderName: initialData?.emailSenderName ?? "",
    },
  });

 
 
  const validateApiKey = async () => {
    const apiKey = form.watch("resendApiKey");
    const isValid = validateResendApiKey(apiKey)
    if (isValid) toast.success("API key validated successfully!");
    else toast.error("Invalid API key format");
  };

  const onSubmit = async(values:z.infer<typeof storeEmailProviderConfigSchema>)=>{
    setIsSubmitting(true)
    try {
      const res = await updateStoreEmailProviderConfig(values)
      if(res.error) toast.error(res.error)
      else{
        toast.success("Your email provider config has been updated successfully.")
        router.refresh()
      }
    } catch (error) {
      toast.error("something went wrong, try again later.")
    }
    setIsSubmitting(false)
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Email Provider Configuration</CardTitle>
            <CardDescription>
              Configure your email service provider to enable automated emails and notifications.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="resendApiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resend API Key</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="re_xxxxxxxxxxxxxxxxxxxxxxxxxx"
                          onChange={(e) => {
                            field.onChange(e);
                            if (e.target.value === "") {
                              form.setValue("resendApiKey", "");
                            }
                          }}
                        />
                      </FormControl>
                      <Button
                        variant="outline"
                        onClick={validateApiKey}
                        disabled={!form.getValues("resendApiKey")}
                        type="button"
                      >
                        Validate
                      </Button>
                    </div>
                    <FormDescription>
                      Get your API key from{" "}
                      <a
                        href="https://resend.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Resend.com
                      </a>
                      . Without this key, email features will be limited or disabled.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="fromEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From Email Address</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="noreply@yourstore.com" />
                    </FormControl>
                    <FormDescription>Email address that appears as sender</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="replyToEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reply-To Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="support@yourstore.com" />
                    </FormControl>
                    <FormDescription>Where customer replies will be sent</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emailSenderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sender Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Your Store Name" />
                    </FormControl>
                    <FormDescription>Display name for email sender</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button disabled={isSubmitting} type={"submit"}>Save Changes</Button>
          </CardFooter>  
        </Card>
      </form>
    </Form>
  );
}