import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateAddressSchema } from "@/db/schema/addresses";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { supportedCountries } from "@/db/schema/addresses";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateAddress } from "@/actions/address";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useTranslations } from "next-intl";

type AddressFormValues = z.infer<typeof updateAddressSchema>;

type Props = {
  address?: Partial<AddressFormValues>;
  children?: React.ReactNode;
};

export default function EditAddressDialog({ address, children }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data } = useCurrentUser()
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient();
  const t = useTranslations()

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(updateAddressSchema),
    defaultValues: {
      id: address?.id,
      name: address?.name ?? "",
      firstName: !address?.id ? (address?.firstName ?? data?.firstName ?? "")  : (address?.firstName ?? ""),
      lastName: !address?.id ? (address?.lastName ?? data?.lastName ?? "") : (address?.lastName ?? ""),
      address: address?.address ?? "",
      city: address?.city ?? "",
      state: address?.state ?? "",
      zipCode: address?.zipCode ?? "",
      country: address?.country ?? "Egypt",
      phone: address?.phone ?? "",
      isDefault: address?.isDefault ?? false,
    },
  });



  async function onSubmit(values: AddressFormValues) {
    setIsSubmitting(true)
    try {
      const res = await updateAddress(values)
      if(res.error) toast.error(res.error)
      else{
        await queryClient.invalidateQueries({"queryKey":["addresses"]})
        toast.success(`Address "${values.name}" has been ${values.id ? "updated" : "added"} successfully.`)
        setIsOpen(false)
        form.reset();
      }
    } catch (error) {
      toast.error(t('something-went-wrong-try-again-later'))
    }
    setIsSubmitting(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children ?? (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {address?.id ? t('edit') : t('add')} {t('address')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[95%] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>{address?.id ? t('edit-address') : t('add-new-address')}</DialogTitle>
          <DialogDescription>
            {address?.id
              ? t('update-your-address-details')
              : t('add-a-new-shipping-or-billing-address-to-your-account')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form 
            onSubmit={(e)=>{
              e.stopPropagation()
              e.preventDefault()
              form.handleSubmit(onSubmit)()
            }} 
            className="space-y-4"
          >
              <div className="grid grid-cols-2 gap-4">
                  <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>{t('first-name')}</FormLabel>
                              <FormControl>
                                  <Input {...field} />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
                  <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>{t('last-name')}</FormLabel>
                              <FormControl>
                                  <Input {...field} />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
              </div>

              <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                      <FormItem>
                          <FormLabel>{t('address-nickname-e-g-home-work')}</FormLabel>
                          <FormControl>
                              <Input {...field} />
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                  )}
              />

              <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                      <FormItem>
                          <FormLabel>{t('street-address')}</FormLabel>
                          <FormControl>
                              <Input {...field} />
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                  )}
              />

              <div className="grid grid-cols-2 gap-4">
                  <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>{t('city')}</FormLabel>
                              <FormControl>
                                  <Input {...field} />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
                  <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>{t('state-province')}</FormLabel>
                              <FormControl>
                                  <Input {...field} />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>{t('zip-postal-code')}</FormLabel>
                              <FormControl>
                                  <Input {...field} />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
                  <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>{t('country')}</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                      <SelectTrigger className=" w-full">
                                          <SelectValue placeholder={t('select-country')} />
                                      </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                      {supportedCountries.map((c) => (
                                          <SelectItem key={c} value={c}>
                                              {c}
                                          </SelectItem>
                                      ))}
                                  </SelectContent>
                              </Select>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
              </div>

              <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                      <FormItem>
                          <FormLabel>{t('phone-number')}</FormLabel>
                          <FormControl>
                              <Input {...field} />
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                  )}
              />

              <FormField
                control={form.control}
                name="isDefault"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>{t('set-as-default-address')}</FormLabel>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {address?.id ? t('update-address') : t('save-address')}
                </Button>
              </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
