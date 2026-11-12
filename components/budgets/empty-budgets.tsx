"use client"
import { Search } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import BudgetCreator from './budget-creator'
import { useTranslations } from 'next-intl'

type Props = {}

export default function EmptyBudgetslist({}: Props) {
  const t = useTranslations()
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <Search className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">{t('no-budgets-defined')}</h3>
      <p className="text-muted-foreground mt-2 mb-6">{t('you-haven-not-defined-any-budgets-yet-start-by-adding-your-first-budget')}</p>
      <BudgetCreator/>
    </div>
  )
}