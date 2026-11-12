"use client";
import { z } from "zod";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { insertPrivacyPolicySchema, selectPrivacyPolicySchema } from "@/db/schema/privacyPolicy";
import { updateStorePrivacyPolicy } from "@/actions/store";
import { useState } from "react";


type PrivacyPolicyFormValues = z.infer<typeof insertPrivacyPolicySchema>;

export function StorePrivacyPolicyForm({initialData}:{initialData?:Partial<z.infer<typeof selectPrivacyPolicySchema>>}) {
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<PrivacyPolicyFormValues>({
    resolver: zodResolver(insertPrivacyPolicySchema),
    defaultValues: {
      lastUpdated: initialData?.lastUpdated ?? "",
      overview: initialData?.overview ?? "",
      introduction: initialData?.introduction ?? "",
      dataCollection: initialData?.dataCollection ?? "",
      dataUsage: initialData?.dataCollection ?? "",
      dataSecurity: initialData?.dataSecurity ?? "",
      cookies: initialData?.cookies ?? "",
      thirdParty: initialData?.thirdParty ?? "",
      contact: initialData?.contact ?? "",
      dataRetention: initialData?.dataRetention ?? "",
      childrenPrivacy:  initialData?.childrenPrivacy ?? "",
      internationalDataTransfers: initialData?.internationalDataTransfers ?? "",
      changesToThisPolicy: initialData?.changesToThisPolicy ?? ""
    }
  });

  const onSubmit = async (data: PrivacyPolicyFormValues) => {
    setIsLoading(true)
    try {
      const res = await updateStorePrivacyPolicy(data)
      if (res.error) toast.error(res.error)
      else if (res.success) toast.success("Store Privacy policy saved successfully.")
    } catch (error) {
      toast.error("Something went wrong, try again later.")
    }
    setIsLoading(false)
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Privacy Policy</CardTitle>
            <CardDescription>
              Manage your privacy policy content.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="lastUpdated"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Updated Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value!} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(
              [
                ["overview", "Overview"],
                ["introduction", "Introduction"],
                ["dataCollection", "Data Collection"],
                ["dataUsage", "Data Usage"],
                ["dataSecurity", "Data Security"],
                ["cookies", "Cookies Policy"],
                ["thirdParty", "Third Party Information"],
                // ["contact", "Contact Information"],
                ["dataRetention", "Data Retention"],
                ["childrenPrivacy", "Children's Privacy"],
                ["internationalDataTransfers", "International Data Transfers"],
                ["changesToThisPolicy", "Changes to This Policy"],
                
              ] as const
            ).map(([key, label]) => (
              <FormField
                key={key}
                control={form.control}
                name={key}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      <Textarea rows={2} {...field} value={field.value ?? ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button disabled={isLoading} type="submit">Save Changes</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
