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
import { AlertTriangle, Package, ShoppingCart, Star, Trash2 } from "lucide-react"
import { ProductItem } from "@/types/product"
import { deleteProduct } from "@/actions/product"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { getLocalizedValue } from "@/types/internationalization"
import { useLocale } from "@/hooks/use-locale"

interface DeleteProductDialogProps {
  product: ProductItem
}

export function DeleteProductDialog({ product, children }: PropsWithChildren<DeleteProductDialogProps>) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const t = useTranslations()
  const locale = useLocale()

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const res = await deleteProduct(product.id)
      if(res.error) toast.error(res.error)
      else{
        await queryClient.invalidateQueries({"queryKey":["products"]})
        toast.success(t('product-has-been-deleted-successfully'))
        setIsOpen(false)
      } 
    } catch (error) {
      toast.error(t('failed-to-delete-product'))
    } finally {
      setIsDeleting(false)
    }
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
              <AlertDialogTitle className="text-left">{t('delete-product')}</AlertDialogTitle>
              <AlertDialogDescription className="text-left">{t('this-action-cannot-be-undone-0')}</AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="space-y-4">
          {/* Product Info */}
          <div className="rounded-lg border p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h4 className="font-medium">{getLocalizedValue(product.nameI18n,locale)}</h4>
                <p className="text-sm text-muted-foreground">{getLocalizedValue(product.category.nameI18n,locale)}</p>
                <p className="text-sm font-medium">EGP {product.price.toFixed(2)}</p>
              </div>
              <Badge variant={(product.stock ?? 0) > 0 ? "default" : "destructive"}>{product.stock} {t('in-stock')}</Badge>
            </div>
          </div>

          {/* Warning Section */}
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="font-medium text-destructive">{t('warning-this-will-permanently')}</span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span>{t('remove-the-product-from-your-store')}</span>
              </div>

              
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                <span>{t('affect-existing-orders-order-history-will-remain')}</span>
              </div>
              

              
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-muted-foreground" />
                <span>
                  {t('delete-all-customer-reviews-of-this-product')}
                </span>
              </div>
              

              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <span>{t('remove-from-all-customer-wishlists-and-carts')}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Impact Summary */}
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-2">{t('what-happens-next-0')}</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>{t('product-will-be-immediately-removed-from-your-store')}</li>
              <li>{t('customers-will-no-longer-be-able-to-purchase-this-item')}</li>
              <li>{t('product-data-and-analytics-will-be-permanently-deleted')}</li>
              <li>{t('this-action-cannot-be-reversed')}</li>
            </ul>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e)=>{
              e.preventDefault()
              handleDelete()
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : t('delete-product')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
