"use client"
import { useTranslations } from "next-intl"
import { Search } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { useLocale } from 'next-intl'

type Props = {}

export default function EmptyWishlist({}: Props) {
  const tu = useTranslations("ui")
  const locale = useLocale()
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <Search className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">{tu("wishlistEmpty")}</h3>
      <p className="text-muted-foreground mt-2 mb-6">{tu("wishlistEmptyText")}</p>
      <Button asChild>
        <Link href={`/${locale}/products`}>{tu("browseProducts")}</Link>
      </Button>
    </div>
  )
}