"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Layers, Plus, Search, Trash2 } from "lucide-react"
import Link from "next/link"
import { AdminCategoriesEmpty } from "@/components/categories/admin-empty-states"
import { useCategories } from "@/hooks/use-categories"
import { DetailedCategory } from "@/types/category"
import { ExistingSubCategory } from "@/types/subcategory"
import { useLocale } from "@/hooks/use-locale"
import { getLocalizedValue } from "@/types/internationalization"
import { DeleteSubcategoryDialog } from "@/components/admin/categories/delete-subcategory-dialog"
import { DeleteCategoryDialog } from "@/components/admin/categories/delete-category-dialog"

export default function CategoriesPage() {
  const locale = useLocale()
  const { data } = useCategories()

  const mainCategories = data ?? []
  const subcategories = mainCategories.flatMap(i=>i.subcategories)

  // Function to get parent category name
  const getParentName = (parentId: string | null) => {
    if (!parentId) return "—"
    const parent = mainCategories.find((c) => c.id === parentId)
    return parent ? getLocalizedValue(parent.nameI18n,locale) : parentId
  }

  const CategoryTable = ({ data }: { data: DetailedCategory[] }) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {getLocalizedValue(category.nameI18n,locale)}
                </div>
              </TableCell>
              <TableCell>{getLocalizedValue(category.descriptionI18n,locale)}</TableCell>
              <TableCell>{category.subcategories.reduce((acc,cur)=>acc+cur["productCount"],0)}</TableCell>
              <TableCell>{category.featured && <Badge variant="secondary">Featured</Badge>}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/${locale}/admin/categories/${category.id}`}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Link>
                  </Button>
                  <DeleteCategoryDialog category={category}>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </DeleteCategoryDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
  const SubCategoryTable = ({ data }: { data: ExistingSubCategory[] }) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Products</TableHead>
            <TableHead>Parent</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {(category as ExistingSubCategory).categoryId && (
                    <Badge variant="outline" className="mr-1">
                      Sub
                    </Badge>
                  )}
                  {getLocalizedValue(category.nameI18n,locale)}
                </div>
              </TableCell>
              <TableCell>{getLocalizedValue(category.descriptionI18n,locale)}</TableCell>
              <TableCell>{(category).productCount}</TableCell>
              <TableCell>{getParentName(category.categoryId)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/${locale}/admin/subcategories/${category.id}`}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Link>
                  </Button>
                  <DeleteSubcategoryDialog subcategory={category}>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </DeleteSubcategoryDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">Manage your product categories and collections.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/${locale}/admin/subcategories/new`}>
              <Layers className="mr-2 h-4 w-4" />
              Add Subcategory
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/${locale}/admin/categories/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search categories..." className="w-full pl-8" />
        </div>
      </div>

      <Tabs defaultValue="main" className="w-full">
        <TabsList className="mb-4">
          {/* <TabsTrigger value="all">All Categories</TabsTrigger> */}
          <TabsTrigger value="main">Main Categories</TabsTrigger>
          <TabsTrigger value="sub">Subcategories</TabsTrigger>
        </TabsList>

        {/* <TabsContent value="all">
          {displayAllCategories.length === 0 ? <AdminCategoriesEmpty /> : <CategoryTable data={displayAllCategories} />}
        </TabsContent> */}

        <TabsContent value="main">
          {mainCategories.length === 0 ? (
            <AdminCategoriesEmpty
              title="No Main Categories Found"
              description="You haven't created any main categories yet. Main categories are top-level categories that can contain subcategories."
            />
          ) : (
            <CategoryTable data={mainCategories} />
          )}
        </TabsContent>

        <TabsContent value="sub">
          {subcategories.length === 0 ? (
            <AdminCategoriesEmpty
              title="No Subcategories Found"
              description="You haven't created any subcategories yet. Subcategories are nested under main categories to create a hierarchy."
            />
          ) : (
            <SubCategoryTable data={subcategories} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
