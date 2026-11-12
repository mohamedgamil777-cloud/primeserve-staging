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
import { AlertTriangle, ArrowRight, Layers, Package, Trash2, Users } from "lucide-react"
import { deleteSubCategory } from "@/actions/subcategory"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { genCategoriesQueryKeys, useCategories } from "@/hooks/use-categories"
import { ExistingSubCategory } from "@/types/subcategory"
import { useLocale } from "@/hooks/use-locale"
import { getLocalizedValue } from "@/types/internationalization"

interface DeleteSubcategoryDialogProps {
  subcategory:  Pick<ExistingSubCategory,"id"|"nameI18n"|"productCount"|"descriptionI18n">,
}

export function DeleteSubcategoryDialog({ subcategory, children }: PropsWithChildren<DeleteSubcategoryDialogProps>) {
  const locale = useLocale()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const { data:categories } = useCategories()
  const parentCategory = categories?.find(cat=>cat.subcategories.find(sc=>sc.id === subcategory.id))


  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const res = await deleteSubCategory(subcategory.id)
      if(res.error) toast.error(res.error)
      else{
        await queryClient.invalidateQueries({"queryKey":genCategoriesQueryKeys()})
        toast.success(`Sub Category "${getLocalizedValue(subcategory.nameI18n,locale)}" has been deleted successfully.`)
        setIsOpen(false)
      } 
    } catch (error) {
      toast.error("Something went wrong, try again later.")
    }
    setIsDeleting(false)
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md max-h-[90%] overflow-y-scroll">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <Trash2 className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <AlertDialogTitle className="text-left">Delete Subcategory</AlertDialogTitle>
              <AlertDialogDescription className="text-left">
                This will permanently delete the subcategory and all its products.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="space-y-4">
          {/* Subcategory Info */}
          <div className="rounded-lg border p-4">
            <div className="space-y-2">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{parentCategory ? getLocalizedValue(parentCategory?.nameI18n,locale) : ""}</span>
                <ArrowRight className="h-3 w-3" />
                <span className="font-medium text-foreground">{getLocalizedValue(subcategory.nameI18n,locale)}</span>
                {parentCategory?.featured && (
                  <Badge variant="secondary" className="ml-2">
                    Featured
                  </Badge>
                )}
              </div>

              <p className="text-sm text-muted-foreground">{getLocalizedValue(subcategory.descriptionI18n,locale)}</p>

              <div className="flex items-center gap-4 pt-2 text-sm">
                <div className="flex items-center gap-1">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span>{subcategory.productCount} products</span>
                </div>
                {/* <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{subcategory.orders} orders</span>
                </div> */}
              </div>
            </div>
          </div>

          {/* Warning Section */}
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="font-medium text-destructive">This will permanently delete:</span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-muted-foreground" />
                <span>The subcategory "{getLocalizedValue(subcategory.nameI18n,locale)}"</span>
              </div>

              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span>All products in this subcategory</span>
              </div>

              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <span>All product reviews and ratings</span>
              </div>

              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>Related products from customer carts & wishlists</span>
              </div>
            </div>
          </div>

          {/* Impact Note */}
          {parentCategory?.featured && (
            <div className="rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 p-3">
              <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">Featured Subcategory Impact</span>
              </div>
              <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                This subcategory is featured on your homepage and will be removed from all promotional displays.
              </p>
            </div>
          )}

          <Separator />

          {/* Final Summary */}
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-2">What happens next:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Subcategory will be removed from navigation</li>
              <li>All {subcategory.productCount} products will be permanently deleted</li>
              <li>Parent category "{parentCategory ? getLocalizedValue(parentCategory.nameI18n,locale) : ''}" will remain unchanged</li>
              <li>This action cannot be reversed</li>
            </ul>
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
            {isDeleting ? "Deleting..." : `Delete Subcategory & ${subcategory.productCount} Products`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
