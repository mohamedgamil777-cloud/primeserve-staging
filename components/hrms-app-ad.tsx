"use client"
import React from 'react'
import { Badge } from './ui/badge'
import { Button, buttonVariants } from './ui/button'
import { motion } from "framer-motion"
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import hrAppIcon from "@/public/imgs/hr_app_ico.png"

type Props = {}

export default function HrmsAppAd({}: Props) {
  const t = useTranslations()
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden rounded-3xl bg-[#1c2a35] p-8 text-white"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-4">
          <Badge className="bg-white/20 text-white hover:bg-white/30 rounded-xl">{t('premium')}</Badge>
          <h2 className="text-3xl font-bold">{t('human-resources-management-system')}</h2>
          <p className="max-w-[600px] text-white/80">
            {t('unleash-your-creativity-with-our-cutting-edge-comprehensive-suite-of-professional-hr-tools-and-resources-bundled-in-one-awesome-app')}
          </p>
          <div className="flex flex-wrap gap-3">
            <a 
              target='_blank'
              href={"https://hrms.codmium.com/"}
              className={cn(buttonVariants({"variant":"default"}),"rounded-2xl bg-white text-indigo-700 hover:bg-white/90")}
            >
              {t('explore-plans')}
            </a>
            <a 
              target='_blank'
              href={"https://hrms.codmium.com/"}
              className={cn(buttonVariants({"variant":"outline"}),"rounded-2xl bg-transparent border-white text-white hover:bg-white/10")}
            >
              {t('take-a-tour')}
            </a>
          </div>
        </div>
        <Image alt={t('budgetm-managment')} height={240} width={240} src={hrAppIcon}/>        
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
      </div>
    </motion.div>
  )
}