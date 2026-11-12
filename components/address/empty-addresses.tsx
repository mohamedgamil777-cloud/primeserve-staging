"use client"
import { MapPin } from 'lucide-react'
import React from 'react'
import EditAddressDialog from './edit-address-dialog'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

type Props = {
  className?:string,
  description?:string
}

export default function EmptyAddresses({className,description}: Props) {
  const t = useTranslations()
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center",className)}>
      <div className="rounded-full bg-muted p-6 mb-4">
        <MapPin className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">{t('no-addresses-saved')}</h3>
      <p className="text-muted-foreground mt-2 mb-6">
        {
          description
          ??
          t('add-a-shipping-or-billing-address-to-your-account')
        }
      </p>
      <EditAddressDialog>
        <Button>{t('add-address')}</Button>
      </EditAddressDialog>
    </div>

  )
}