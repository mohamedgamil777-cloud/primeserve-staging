"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, TrendingUp, TrendingDown, Bell } from "lucide-react"
import BudgetCreator from "@/components/budgets/budget-creator"
import BudgetCard from "@/components/budgets/budget-card"
import { useBudgets } from "@/hooks/use-budgets"
import EmptyBudgetslist from "@/components/budgets/empty-budgets"
import { useCategories } from "@/hooks/use-categories"
import React from "react"
import BudgetLoading from "@/app/[locale]/(public)/account/budget/loading"
import { useTranslations } from "next-intl"
import { getLocalizedValue } from "@/types/internationalization"
import { useLocale } from "@/hooks/use-locale"

export default function CustomerBudgetManagementPage() {
  const t = useTranslations()
  const locale = useLocale()
  const { data:categories, isLoading:isLoadingCategories } = useCategories()
  const { data:budgets, isLoading } = useBudgets()
  const totalBudget = budgets?.reduce((sum, budget) => sum + budget.amount, 0) ?? 0
  const totalSpent = budgets?.reduce((sum, budget) => sum + budget.spent, 0) ?? 0
  const remainingBudget = totalBudget - totalSpent

  const recentTransactions = [
    { id: 1, description: "Classic White T-Shirt", amount: 29.99, category: "clothing", date: "2024-01-15" },
    { id: 2, description: "Wireless Headphones", amount: 89.99, category: "electronics", date: "2024-01-14" },
    { id: 3, description: "Coffee Mug Set", amount: 24.99, category: "home", date: "2024-01-13" },
    { id: 4, description: "Running Shoes", amount: 120.0, category: "clothing", date: "2024-01-12" },
    { id: 5, description: "Book Collection", amount: 45.99, category: "books", date: "2024-01-11" },
  ]



  if(isLoading || isLoadingCategories) return <BudgetLoading/>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('budget-management')}</h1>
          <p className="text-muted-foreground">{t('track-and-manage-your-spending-budgets')}</p>
        </div>
        <BudgetCreator/>
      </div>

      {/* Budget Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('total-budget')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBudget.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{t('across-all-active-budgets')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('total-spent')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {((totalSpent / totalBudget) * 100).toFixed(1)}{t('of-total-budget')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('remaining')}</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${remainingBudget.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{t('available-to-spend')}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="budgets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="budgets">{t('active-budgets')}</TabsTrigger>
          <TabsTrigger disabled value="analytics">{t('analytics')}</TabsTrigger>
          <TabsTrigger disabled value="transactions">{t('recent-transactions')}</TabsTrigger>
          <TabsTrigger disabled value="alerts">{t('alerts-and-settings')}</TabsTrigger>
        </TabsList>

        <TabsContent value="budgets" className="space-y-4">
          <div className="grid gap-4">
            {
              (!budgets || budgets.length === 0) 
              ?
              <EmptyBudgetslist/>
              :
              budgets?.map((budget) => <BudgetCard key={budget.id} budget={budget}/>)
            }
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('spending-by-category')}</CardTitle>
                <CardDescription>{t('your-spending-breakdown-this-month')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {
                    budgets?.map((budget) => (
                      <React.Fragment key={budget.id}>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">{getLocalizedValue(categories?.find(cat=>cat.id === budget.categoryId)?.nameI18n,locale)}</span>
                          <span className="text-sm font-medium">${budget.spent}</span>
                        </div>
                        <Progress value={(budget.spent / budget.amount)*100} className="h-2" />
                      </React.Fragment>
                    ))

                  }
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('monthly-trends')}</CardTitle>
                <CardDescription>{t('your-spending-patterns-over-time')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">January 2024</span>
                    <span className="text-sm font-medium">$320.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">December 2023</span>
                    <span className="text-sm font-medium">$450.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">November 2023</span>
                    <span className="text-sm font-medium">$280.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">October 2023</span>
                    <span className="text-sm font-medium">$195.00</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('recent-transactions')}</CardTitle>
              <CardDescription>{t('your-latest-purchases-and-their-budget-impact')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.category} • {transaction.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${transaction.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('budget-alerts')}</CardTitle>
                <CardDescription>{t('configure-when-you-want-to-be-notified')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">75% Budget Warning</p>
                    <p className="text-sm text-muted-foreground">Alert when 75% of budget is spent</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Bell className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">90% Budget Warning</p>
                    <p className="text-sm text-muted-foreground">Alert when 90% of budget is spent</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Bell className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t('budget-exceeded')}</p>
                    <p className="text-sm text-muted-foreground">{t('alert-when-budget-is-exceeded')}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Bell className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{t('notification-preferences')}</CardTitle>
                <CardDescription>{t('choose-how-you-want-to-receive-alerts')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t('email-notifications')}</p>
                    <p className="text-sm text-muted-foreground">{t('receive-alerts-via-email')}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    {t('enable')}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t('push-notifications')}</p>
                    <p className="text-sm text-muted-foreground">{t('receive-alerts-on-your-device')}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    {t('enable')}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t('weekly-summary')}</p>
                    <p className="text-sm text-muted-foreground">{t('weekly-budget-summary-email')}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    {t('enable')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
