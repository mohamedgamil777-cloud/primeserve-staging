"use client"
import { ExistingAddress } from '@/types/address'
import React, { useState } from 'react'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Edit, Trash2 } from 'lucide-react'
import EditAddressDialog from './edit-address-dialog'
import AddressDeleter from './address-deleter'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { markAddressAsDefault } from '@/actions/address'
import { useTranslations } from 'next-intl'

type Props = {
  address:ExistingAddress
}

export default function AddressCard({address}: Props) {
  const t = useTranslations()
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()
  const handleMarkAddressAsDefault = async ()=>{
    setIsLoading(true)
    try {
      const res = await markAddressAsDefault(address.id)
      if(res.error) toast.error(res.error)
      else{
        await queryClient.invalidateQueries({"queryKey":["addresses"]})
        toast.success(`Address "${address.name}" has been set as default successfully.`)
      } 
    } catch (error) {
      toast.error(t('something-went-wrong-try-again-later'))
    }
    setIsLoading(false)
  }
  return (
    <div key={address.id} className="rounded-lg border p-4 h-full flex flex-col justify-between">
      <div>

        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{address.name}</h3>
            {address.isDefault && <Badge variant="outline">{t('default')}</Badge>}
          </div>
          <div className="flex gap-1">
            <EditAddressDialog address={address}>
              <Button disabled={isLoading} variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
                <span className="sr-only">{t('edit')}</span>
              </Button>
            </EditAddressDialog>
            <AddressDeleter
              address={address}
            >
              <Button disabled={isLoading} variant="ghost" size="icon">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">{t('delete')}</span>
              </Button>
            </AddressDeleter>
          </div>
        </div>
        <div className="space-y-1 text-sm">
          <p>
            {address.firstName} {address.lastName}
          </p>
          <p>{address.address}</p>
          <p>
            {address.city}, {address.state} {address.zipCode}
          </p>
          <p>{address.country}</p>
          <p className="pt-2">{address.phone}</p>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        {!address.isDefault && (
          <Button disabled={isLoading} onClick={handleMarkAddressAsDefault} variant="outline" size="sm">
            {t('set-as-default')}
          </Button>
        )}
        <EditAddressDialog address={address}>
          <Button disabled={isLoading} variant="outline" size="sm">
            {t('edit')}
          </Button>
        </EditAddressDialog>
      </div>
    </div>
  )
}