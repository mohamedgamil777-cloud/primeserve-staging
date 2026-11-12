"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Edit, Plus, Search, Trash2 } from "lucide-react"
import Link from "next/link"
import { useProducts } from "@/hooks/use-products"
import InfiniteScrollTable from "@/components/common/infinite-scroll-table"
import { useCategories } from "@/hooks/use-categories"
import { LOW_STOCK_QUANTITY } from "@/lib/consts"
import { AdminProductsEmpty } from "@/components/product/admin-products-empty"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { parseAsString, useQueryState } from "nuqs"
import { ProductStatus } from "@/types/product"
import { DeleteProductDialog } from "@/components/admin/products/delete-product-dialog"
import { useLocale } from "@/hooks/use-locale"
import { getLocalizedValue } from "@/types/internationalization"
import { AdminStockExcelManager } from "@/components/admin/products/admin-stock-excel-manager"

export default function ProductsPage() {
  const locale = useLocale()
  const [q, setQ] = useQueryState("q",parseAsString.withDefault(""))
  const [category, setCategory] = useQueryState("category",parseAsString.withDefault("all"))
  const [status, setStatus] = useQueryState("status",parseAsString.withDefault("all"))
  const debouncedQuery = useDebouncedValue(q,1000)

  const query = useProducts({
    "query":debouncedQuery ?? undefined,
    "categoryId":category === "all" ? undefined : category,
    "status":status === "all" ? undefined : (status as ProductStatus)
  })

  const { data:categories } = useCategories()
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory and listings.</p>
        </div>
        <div className=" flex flex-row gap-4">
          <Link href={`/${locale}/admin/products/new`}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </Link>
          <AdminStockExcelManager/>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search products..." 
            className="w-full pl-8" 
            value={q}
            onChange={(e)=>setQ(e.target.value)}
          />
        </div>
        <Select value={category} onValueChange={(newVal)=>setCategory(newVal)} defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {
              categories?.map(cat=>(
                <SelectItem value={cat.id}>{getLocalizedValue(cat.nameI18n,locale)}</SelectItem>
              ))
            }
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(newVal:ProductStatus)=>setStatus(newVal)} defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="low-stock">Low Stock</SelectItem>
            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <InfiniteScrollTable
          query={query}
          cols={[
            {
              "order":1,
              "cellClassName":()=>"text-left",
              "head":"Product",
              "cell":(allProducts,product)=>(
                getLocalizedValue(product.nameI18n,locale)
              )
            },
            {
              "order":2,
              "head":"Category",
              "cellClassName":()=>"text-left",
              "cell":(allProducts,product)=>(
                `${categories?.find(cat=>cat.id === product.categoryId)?.nameI18n[locale]} - ${categories?.find(cat=>cat.id === product.categoryId)?.subcategories.find(cat=>cat.id === product.subcategoryId)?.nameI18n[locale]}`
              )
            },
            {
              "order":3,
              "head":"Price",
              "cellClassName":()=>"text-left",
              "cell":(allProducts,product)=>(
                `EGP ${product.price.toLocaleString()}`
              )
            },
            {
              "order":4,
              "head":"Stock",
              "cell":(allProducts,product)=>(
                product.stock?.toLocaleString()
              ),
              "cellClassName":()=>"text-left",
            },
            {
              "order":5,
              "head":"Status",
              "cell":(allProducts,product)=>{
                const status = product.stock! > LOW_STOCK_QUANTITY ? "active" : product.stock! > 0 ? "low-stock" : "out-of-stock"
                return (
                  <Badge
                    variant={
                      status === "active"
                        ? "default"
                        : status === "low-stock"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {status === "active"
                      ? "Active"
                      : status === "low-stock"
                        ? "Low Stock"
                        : "Out of Stock"}
                  </Badge>
                )
              },
              "cellClassName":()=>"text-left",
            },
            {
              "order":6,
              "head":"Actions",
              "cellClassName":()=>"text-right",
              "headClassName":"text-right",
              "cell":(allProducts,product)=>(
                <div className="flex justify-end gap-2">
                  <Link href={`/${locale}/admin/products/${product.id}`}>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  </Link>
                  <DeleteProductDialog product={product}>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </DeleteProductDialog>
                </div>
              )
            },
          ]}
          emptyStateComponent={<AdminProductsEmpty/>}
        />
      </div>
    </div>
  )
}
