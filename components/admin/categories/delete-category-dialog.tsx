"use client"

import { PropsWithChildren, useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, Layers, Package, Trash2, Users } from "lucide-react"
import { DetailedCategory } from "@/types/category"
import { deleteCategory } from "@/actions/category"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { getLocalizedValue } from "@/types/internationalization"
import { genCategoriesQueryKeys } from "@/hooks/use-categories"
import { useLocale } from "@/hooks/use-locale"

interface DeleteCategoryDialogProps {
  category: DetailedCategory
}

export function DeleteCategoryDialog({ category, children }: PropsWithChildren<DeleteCategoryDialogProps>) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const locale = useLocale()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const res = await deleteCategory(category.id)
      if(res.error) toast.error(res.error)
      else{
        await queryClient.invalidateQueries({"queryKey":genCategoriesQueryKeys()})
        setIsOpen(false)
        toast.success(`Category "${getLocalizedValue(category.nameI18n,locale)}" has been deleted successfully.`)
      } 
    } catch (error) {
      toast.error("Something went wrong, try again later.")
    }
    setIsDeleting(false)
  }

  const totalAffectedProducts = category.subcategories.reduce((acc,cur)=>acc + cur["productCount"],0) ?? 0

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-lg max-h-[90%] overflow-y-scroll">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <Trash2 className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <AlertDialogTitle className="text-left">Delete Category</AlertDialogTitle>
              <AlertDialogDescription className="text-left">
                This will permanently delete the category and all its contents.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="space-y-4">
          {/* Category Info */}
          <div className="rounded-lg border p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{getLocalizedValue(category.nameI18n,locale)}</h4>
                  {category.featured && <Badge variant="secondary">Featured</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{getLocalizedValue(category.descriptionI18n,locale)}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Package className="h-4 w-4" />
                <span>{totalAffectedProducts} products</span>
              </div>
              <div className="flex items-center gap-1">
                <Layers className="h-4 w-4" />
                <span>{category.subcategories.length} subcategories</span>
              </div>
              {/* <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{category.orders} orders</span>
              </div> */}
            </div>
          </div>

          {/* Critical Warning */}
          <div className="rounded-lg border-2 border-destructive bg-destructive/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <span className="font-semibold text-destructive">CRITICAL: Cascade Deletion</span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="bg-background rounded p-3 border">
                <p className="font-medium mb-2">This will permanently delete:</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span>• Main category</span>
                    <Badge variant="destructive">1 item</Badge>
                  </div>
                  {category.subcategories.length > 0 && (
                    <div className="flex items-center justify-between">
                      <span>• All subcategories</span>
                      <Badge variant="destructive">{category.subcategories.length} items</Badge>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span>• All products in category & subcategories</span>
                    <Badge variant="destructive">~{totalAffectedProducts} items</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>• All product reviews and ratings</span>
                    <Badge variant="destructive">All data</Badge>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-950/20 rounded p-3 border border-yellow-200 dark:border-yellow-800">
                <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">Additional Impact:</p>
                <ul className="text-yellow-700 dark:text-yellow-300 space-y-1">
                  <li>• Products removed from all customer carts and wishlists</li>
                  <li>• Category removed from navigation and search</li>
                  <li>• All category-specific promotions will be disabled</li>
                  <li>• Analytics data for this category will be lost</li>
                </ul>
              </div>
            </div>
          </div>

          <Separator />

          {/* Final Warning */}
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium text-destructive mb-1">
              ⚠️ This action affects {totalAffectedProducts}+ products and cannot be undone
            </p>
            <p className="text-xs text-muted-foreground">
              Consider moving products to another category before deletion
            </p>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e)=>{
              e.preventDefault()
              handleDelete()
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : `Delete Category & ${totalAffectedProducts}+ Items`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
