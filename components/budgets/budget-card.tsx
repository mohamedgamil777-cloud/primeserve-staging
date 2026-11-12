import { DetailedBudget } from '@/types/budget'
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { AlertTriangle, Edit, Trash2 } from 'lucide-react'
import { Progress } from '../ui/progress'
import { useCategories } from '@/hooks/use-categories'
import BudgetCreator from './budget-creator'
import { deleteBudget } from '@/actions/budget'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { getLocalizedValue } from '@/types/internationalization'
import { useLocale } from '@/hooks/use-locale'

type Props = {
  budget:DetailedBudget
}

const getBudgetStatusColor = (status: string) => {
  switch (status) {
    case "danger":
      return "destructive"
    case "warning":
      return "secondary"
    default:
      return "default"
  }
}

export default function BudgetCard({budget}: Props) {
  const t = useTranslations()
  const locale = useLocale()
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)
  const { data:categories } = useCategories()
  const percentage = (budget.spent / budget.amount) * 100
  const handleDeletingBudget = async ()=>{
    try {
      setIsLoading(true)
      const res = await deleteBudget(budget.id)
      if(res.error) toast.error(res.error)
      else{
        queryClient.invalidateQueries({"queryKey":["budgets"]})
        toast.success(`"${budget.name}" budget has been deleted successfully.`)
      }
    } catch (error) {
      toast.error(t('something-went-wrong-try-again-later'))
    }
    setIsLoading(false)
    
  }
  return (
    <Card key={budget.id}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{budget.name}</CardTitle>
            <CardDescription>
              {budget.period} budget • {getLocalizedValue(categories?.find(cat=>cat.id === budget.categoryId)?.nameI18n,locale)}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getBudgetStatusColor(budget.status)}>
              {budget.status === "over" ? t('over-budget') : budget.status === "warning" ? t('near-limit') : t('on-track')}
            </Badge>
            <BudgetCreator budget={budget}>
              <Button disabled={isLoading} variant="ghost" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </BudgetCreator>
            <Button onClick={handleDeletingBudget} disabled={isLoading} variant="ghost" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span>{t("spent")}: ${budget.spent.toFixed(2)}</span>
          <span>{t("budget")}: ${budget.amount.toFixed(2)}</span>
        </div>
        <Progress
          value={percentage}
          className={cn(`h-2`,budget.status === "over" ? "bg-red-100" : budget.status === "warning" ? "bg-yellow-100" : "bg-green-100")}
        />
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>{percentage.toFixed(1)}% {t("used")}</span>
          <span>${(budget.amount - budget.spent).toFixed(2)} {t("remaining")}</span>
        </div>
        {budget.status === "over" && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertTriangle className="h-4 w-4" />
            <span>{t('youve-exceeded-this-budget-by')}{(budget.spent - budget.amount).toFixed(2)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}