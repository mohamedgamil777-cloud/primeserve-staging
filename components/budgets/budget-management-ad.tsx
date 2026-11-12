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
      className="relative overflow-hidden rounded-3xl bg-[#1c2a35] p-8 text-white shadow-xl"
    >
      {/* Subtle decorative elements */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-black/10"></div>
      <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-black/5"></div>

      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Wallet className="h-6 w-6" />
            <h2 className="text-3xl font-bold tracking-tight">{t('smart-budget-manager')}</h2>
          </div>
          
          <p className="text-lg font-medium text-white">
            {t('take-control-of-your-spending-and-save-smarter-with-every-purchase')}
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: <PieChart className="h-5 w-5" />, text: t('real-time-spending-analytics') },
              { icon: <Bell className="h-5 w-5" />, text: t('custom-budget-alerts') },
              { icon: <Target className="h-5 w-5" />, text: t('personalized-savings-goals') },
              { icon: <Wallet className="h-5 w-5" />, text: t('e-commerce-spending-tracker') },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/10">
                  {feature.icon}
                </div>
                <span className="text-gray-200">{feature.text}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-start justify-center gap-4">
            <Link 
              href={`/${locale}/account/budget`}
              className={cn(buttonVariants({"variant":"default","size":"lg"}),"group flex w-full min-w-[220px] items-center justify-between rounded-2xl bg-white px-6 py-5 text-emerald-700 shadow-lg hover:bg-white/90 hover:shadow-emerald-500/20 md:w-auto")}
            >
              <div className="flex items-center">
                <Crown className="mr-2 h-5 w-5" />
                <span className="font-semibold">{t('start-now')}</span>
              </div>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <p className="text-center text-sm text-gray-400 md:text-right">
              {t('used-by-50-000-smart-shoppers')}
            </p>
          </div>

        </div>

        <Image alt={t('budgetm-managment')} height={240} width={240} src={budgetIcon}/>
      </div>
    </motion.div>
  )
}