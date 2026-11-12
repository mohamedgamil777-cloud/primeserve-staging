"use client"
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { AccountDeletionDialog } from '../account/account-deletion-dialog'
import { useTranslations } from 'next-intl'

type Props = {}

export default function CustomerDeleteAccountSection({}: Props) {
  const t = useTranslations()
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-destructive">{t('danger-zone')}</CardTitle>
        <CardDescription>{t('irreversible-and-destructive-actions')}</CardDescription>
      </CardHeader>
      <CardContent>
        <AccountDeletionDialog/>
      </CardContent>
    </Card>
  )
}