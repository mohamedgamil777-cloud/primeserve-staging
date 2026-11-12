'use client'

import React, { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { useCategories } from '@/hooks/use-categories'
import { budgetPeriods, insertCustomerBudgetSchema } from '@/db/schema/customerBudgets'
import { DetailedBudget } from '@/types/budget'
import { toast } from 'sonner'
import { updateBudget } from '@/actions/budget'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useLocale } from '@/hooks/use-locale'
import { getLocalizedValue } from '@/types/internationalization'

type FormValues = z.infer<typeof insertCustomerBudgetSchema>

export default function BudgetCreator({ children, budget }: { children?: React.ReactNode, budget?:Partial<DetailedBudget> }) {
  const t = useTranslations()
  const locale = useLocale()
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()
  const { data:categories } = useCategories()
  const [isOpen, setIsOpen] = useState(false)


  const form = useForm<FormValues>({
    resolver: zodResolver(insertCustomerBudgetSchema),
    defaultValues: {
      id: budget?.id,
      name: budget?.name ?? "",
      amount: budget?.amount ?? 0,
      period: budget?.period ?? 'monthly',
      categoryId: budget?.categoryId,
    },
  })

  async function onSubmit(values: FormValues) {
    try {
      setIsLoading(true)
      const res = await updateBudget(values)
      if(res.error) toast.error(res.error)
      else{
        queryClient.invalidateQueries({"queryKey":["budgets"]})
        toast.success(`"${values.name}" budget has been ${values.id ? "updated" : "created"} successfully.`)
        setIsOpen(false)
      }
    } catch (error) {
      toast.error(t('something-went-wrong-try-again-later'))
    }
    setIsLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children ?? (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('create-budget')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('create-new-budget')}</DialogTitle>
          <DialogDescription>
            {t('set-up-a-new-budget-to-track-your-spending-in-a-specific-category-or-time-period')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('budget-name')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('e-g-monthly-groceries')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('budget-amount')}</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      {...field} 
                      onChange={(e)=>field.onChange(parseFloat(e.target.value))} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('period')}</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className=' w-full'>
                        <SelectValue placeholder={t('select-period')} />
                      </SelectTrigger>
                      <SelectContent>
                        {
                          budgetPeriods.map(period=>(
                            <SelectItem 
                              key={period} 
                              value={period}
                            >
                              {period.at(0)?.toUpperCase()}{period.slice(1)}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('category')}</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className=' w-full'>
                        <SelectValue placeholder={t('select-category')} />
                      </SelectTrigger>
                      <SelectContent>
                        {
                          categories?.map(category=>(
                            <SelectItem key={category.id} value={category.id}>{getLocalizedValue(category.nameI18n,locale)?.at(0)?.toUpperCase()}{getLocalizedValue(category.nameI18n,locale)?.slice(1)}</SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button disabled={isLoading} type="submit">{t('create-budget')}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
