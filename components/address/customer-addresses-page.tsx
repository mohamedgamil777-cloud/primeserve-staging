"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import EditAddressDialog from "@/components/address/edit-address-dialog"
import { useAddresses } from "@/hooks/use-addresses"
import EmptyAddresses from "@/components/address/empty-addresses"
import AddressCard from "@/components/address/address-card"
import { range } from "@/lib/utils"
import AddressCardSkeleton from "@/components/address/address-card-skeleton"
import { useTranslations } from "next-intl"

export default function CustomerAddressesPage() {
  const { data, isLoading } = useAddresses()
  const t = useTranslations()
  const addresses = data ?? []
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('my-addresses')}</h1>
          <p className="text-muted-foreground">{t('manage-your-shipping-and-billing-addresses')}</p>
        </div>
        <EditAddressDialog/>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('saved-addresses')}</CardTitle>
          <CardDescription>{t('your-shipping-and-billing-addresses')}</CardDescription>
        </CardHeader>
        <CardContent>
          {
            isLoading
            ?
            <div className="grid gap-6 md:grid-cols-2">
              {
                range(0,6).map(idx=>(
                  <AddressCardSkeleton key={idx}/>
                ))
              }  
            </div>
            :
            addresses.length === 0 ? (
              <EmptyAddresses/>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {addresses.map((address) => (
                <AddressCard address={address} key={address.id}/>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
