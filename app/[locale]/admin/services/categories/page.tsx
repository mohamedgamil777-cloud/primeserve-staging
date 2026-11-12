"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Plus,
  Search,
  Eye,
  Settings,
  Wrench,
} from "lucide-react"
import ServiceCategoryCreator from "@/components/admin/services/service-category-creator"
import { useServiceCategories } from "@/hooks/use-service-categories"
import ServiceCategoryRow from "@/components/admin/services/service-category-row"
import { MotionTableRow, TableSkeleton } from "@/components/common/infinite-scroll-table"
import { EmptyServiceCategories } from "@/components/admin/services/empty-service-categories"
import { Skeleton } from "@/components/ui/skeleton"
import { useLocale } from "@/hooks/use-locale"
import { getLocalizedValue } from "@/types/internationalization"


export default function AdminServiceCategoriesPage() {
  const locale = useLocale()
  const [searchTerm, setSearchTerm] = useState("")
  const { data, isLoading } = useServiceCategories()
  const filteredCategories = (data ?? []).filter((category) =>
    !getLocalizedValue(category.nameI18n,locale)
    ||
    getLocalizedValue(category.nameI18n,locale)?.toLowerCase().includes(searchTerm.toLowerCase()),
  )


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Service Categories</h1>
          <p className="text-muted-foreground">Manage service categories and their organization</p>
        </div>
        <ServiceCategoryCreator>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </ServiceCategoryCreator>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.length}</div>
            <p className="text-xs text-muted-foreground">{data?.filter((c) => c.isActive).length} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.reduce((sum, category) => sum + Number(category.servicesCount), 0)}
            </div>
            <p className="text-xs text-muted-foreground">Across all categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Services/Category</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(data?.reduce((sum, category) => sum + Number(category.servicesCount), 0) ?? 0  / (data?.length ?? 1))}
            </div>
            <p className="text-xs text-muted-foreground">Per category</p>
          </CardContent>
        </Card>
      </div>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>Manage your service categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="rounded-md border">
            {
              filteredCategories.length === 0 && !isLoading
              ?
              <EmptyServiceCategories/>
              :
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Services</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    isLoading
                    ?
                    <>
                      {
                        Array().fill(null,0,10).map((_,idx)=>(
                          <MotionTableRow
                            key={idx}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.7 }}
                            transition={{ duration: 0.3, delay: idx * 0.03 }}
                          >                      
                            {[0,1,2,3,4,5,6].map((col,_idx) =>
                              <TableCell key={`${idx}-${_idx}`}>
                                <Skeleton className="h-4 w-full" />
                              </TableCell>
                            )}
                          </MotionTableRow>
                        ))
                      }
                    </>
                    :
                    data?.map((category) => (
                        <ServiceCategoryRow key={category.id} category={category}/>
                      )
                    )
                  }
                </TableBody>  
              </Table>
            }
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
