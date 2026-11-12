"use client"
import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useCart } from '@/hooks/use-cart';
import { Button } from '../ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { motion } from "framer-motion"
import Link from 'next/link';
import { genProductImageUrl } from '@/lib/product';
import { useTranslations } from 'next-intl';
import { getLocalizedValue } from '@/types/internationalization';
import { useLocale } from '@/hooks/use-locale';


type Props = {}

export default function CartItemsTable({}: Props) {
  const t = useTranslations()
  const locale = useLocale()
  const { data:items, isLoading, updateItemQuantity, removeItem } = useCart()
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">{t('product')}</TableHead>
          <TableHead className="text-right">{t('unit-price')}</TableHead>
          <TableHead className="text-center">{t('quantity')}</TableHead>
          <TableHead className="text-right">{t('total')}</TableHead>
          <TableHead className="text-right">{t('actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          // Loading skeleton rows
          [...Array(3)].map((_, idx) => (
            <TableRow key={idx}>
              <TableCell>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-md bg-muted" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 rounded bg-muted" />
                    <div className="h-3 w-24 rounded bg-muted" />
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="h-4 w-16 rounded bg-muted ml-auto" />
              </TableCell>
              <TableCell>
                <div className="flex justify-center items-center gap-2">
                  <div className="h-8 w-8 rounded bg-muted" />
                  <div className="h-4 w-8 rounded bg-muted" />
                  <div className="h-8 w-8 rounded bg-muted" />
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="h-4 w-16 rounded bg-muted ml-auto" />
              </TableCell>
              <TableCell className="text-right">
                <div className="h-8 w-8 rounded bg-muted ml-auto" />
              </TableCell>
            </TableRow>
          ))
        ) : items?.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="h-24 text-center">
              {t('your-cart-is-empty')}
            </TableCell>
          </TableRow>
        ) : (
          items?.map((item, index) => (
            <motion.tr
              key={`${item.product.id}-${index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <TableCell>
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                    <img
                      src={genProductImageUrl(item.product.mainImage)}
                      alt={getLocalizedValue(item.product.nameI18n,locale)}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium">
                      <Link href={`/${locale}/products/${item.product.id}`} className="hover:underline">
                        {getLocalizedValue(item.product.nameI18n,locale)}
                      </Link>
                    </h4>
                    <p className="text-sm text-muted-foreground">{getLocalizedValue(item.product.category.nameI18n,locale)}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right">
                {item.product.discountPercentage > 0 ? (
                  <div className="flex flex-col items-end">
                    <span className="font-medium">
                      ${(item.product.price * (1 - item.product.discountPercentage / 100)).toFixed(2)}
                    </span>
                    <span className="text-xs text-muted-foreground line-through">
                      ${item.product.price.toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <span>${item.product.price.toFixed(2)}</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex justify-center items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateItemQuantity({
                      productId: item.product.id,
                      newQuantity: item.quantity - 1
                    })}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <p>{item.quantity}</p>
                  {/* <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                      const newQuantity = parseInt(e.target.value);
                      if (!isNaN(newQuantity)) {
                        updateItemQuantity({
                          productId: item.product.id,
                          newQuantity: Math.max(1, newQuantity)
                        });
                      }
                    }}
                    className="w-12 text-center"
                    min={1}
                  /> */}
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={item.quantity >= (item.product.stock ?? 0)}
                    onClick={() => updateItemQuantity({
                      productId: item.product.id,
                      newQuantity: item.quantity + 1
                    })}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">
                ${(item.product.price * (1 - (item.product.discountPercentage ?? 0) / 100) * item.quantity).toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => removeItem(item.product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">{t('remove')}</span>
                </Button>
              </TableCell>
            </motion.tr>
          ))
        )}
      </TableBody>
    </Table>
  )
}