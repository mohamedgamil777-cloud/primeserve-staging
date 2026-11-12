"use client"
import React from 'react'
import { Badge } from './ui/badge'
import { Button, buttonVariants } from './ui/button'
import { motion } from "framer-motion"
import { cn } from '@/lib/utils'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import hrAppIcon from "@/public/imgs/hr_app_ico.png"

type Props = {}

export default function HrmsAppAd({}: Props) {
  const t = useTranslations()
  const locale = useLocale()
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex h-full flex-col overflow-hidden rounded-3xl bg-[#0B1F33] p-6 text-white sm:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <Badge className="bg-white/20 text-white hover:bg-white/30 rounded-xl">{t('premium')}</Badge>
          <h2 className="text-2xl font-bold sm:text-3xl">{t('human-resources-management-system')}</h2>
        </div>
        <Image alt={t('human-resources-management-system')} height={160} width={160} src={hrAppIcon} className="h-24 w-24 shrink-0 object-contain sm:h-36 sm:w-36"/>
      </div>
      <p className="mt-4 text-white/80">
        {t('unleash-your-creativity-with-our-cutting-edge-comprehensive-suite-of-professional-hr-tools-and-resources-bundled-in-one-awesome-app')}
      </p>
      <div className="mt-auto flex flex-wrap gap-3 pt-6">
        <Link
          href={`/${locale}/employee-experience`}
          className={cn(buttonVariants({"variant":"default"}),"h-11 rounded-xl bg-[#F26522] px-5 text-white hover:bg-[#d9541a]")}
        >
          {t('take-a-tour')}
        </Link>
      </div>
        {/* <div className="hidden lg:block">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="relative h-40 w-40"
          >
            <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-md" />
            <div className="absolute inset-4 rounded-full bg-white/20" />
            <div className="absolute inset-8 rounded-full bg-white/30" />
            <div className="absolute inset-12 rounded-full bg-white/40" />
            <div className="absolute inset-16 rounded-full bg-white/50" />
          </motion.div>
        </div> */}
    </motion.div>
  )
}