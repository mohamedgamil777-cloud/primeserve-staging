"use client";
import React from 'react';
import { motion } from "framer-motion";
import { Button, buttonVariants } from '../ui/button';
import { Crown, ArrowRight, PieChart, Bell, Target, Wallet } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import budgetIcon from "@/public/imgs/budget.png"
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';

type Props = {}

export default function BudgetManagementAd({}: Props) {
  const t = useTranslations()
  const locale = useLocale()
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative flex h-full flex-col overflow-hidden rounded-3xl bg-[#0B1F33] p-6 text-white shadow-xl sm:p-8"
    >
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Wallet className="h-6 w-6 shrink-0 text-[#F26522]" />
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{t('smart-budget-manager')}</h2>
          </div>
          <p className="font-medium text-white/80">
            {t('take-control-of-your-spending-and-save-smarter-with-every-purchase')}
          </p>
        </div>
        <Image alt={t('smart-budget-manager')} height={160} width={160} src={budgetIcon} className="h-24 w-24 shrink-0 object-contain sm:h-36 sm:w-36"/>
      </div>

      <div className="relative z-10 mt-4 grid gap-3 sm:grid-cols-2">
        {[
          { icon: <PieChart className="h-4 w-4" />, text: t('real-time-spending-analytics') },
          { icon: <Bell className="h-4 w-4" />, text: t('custom-budget-alerts') },
          { icon: <Target className="h-4 w-4" />, text: t('personalized-savings-goals') },
          { icon: <Wallet className="h-4 w-4" />, text: t('e-commerce-spending-tracker') },
        ].map((feature, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
              {feature.icon}
            </div>
            <span className="text-sm text-gray-200">{feature.text}</span>
          </div>
        ))}
      </div>

      <div className="relative z-10 mt-auto flex flex-wrap items-center gap-4 pt-6">
        <Link 
          href={`/${locale}/account/budget`}
          className={cn(buttonVariants({"variant":"default"}),"group h-11 gap-2 rounded-xl bg-[#F26522] px-5 text-white hover:bg-[#d9541a]")}
        >
          <Crown className="h-4 w-4" />
          <span className="font-semibold">{t('start-now')}</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
        </Link>
        <p className="text-sm text-gray-400">
          {t('used-by-50-000-smart-shoppers')}
        </p>
      </div>
    </motion.div>
  )
}