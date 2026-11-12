"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useLocale } from "@/hooks/use-locale"
import { TopProduct } from "@/types/analytics"
import { getLocalizedValue } from "@/types/internationalization"

export function TopProducts({topProducts}:{topProducts:TopProduct[]}) {
  const locale = useLocale()
  return (
    <div className="space-y-8">
      {topProducts.map((product, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={product.image || "/placeholder.png"} alt={getLocalizedValue(product.nameI18n,locale)} />
            <AvatarFallback>{getLocalizedValue(product.nameI18n,locale)?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{getLocalizedValue(product.nameI18n,locale)}</p>
            <p className="text-sm text-muted-foreground">{product.sales} sales</p>
          </div>
          <div className="ml-auto font-medium">{product.revenue}</div>
        </div>
      ))}
    </div>
  )
}
