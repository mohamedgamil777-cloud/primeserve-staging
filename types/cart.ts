import { selectCartItemSchema } from "@/db/schema/cartItems"
import { z } from "zod"
import { ProductItem } from "./product"
import { ExistingCategory } from "./category"

export type ExistingCartItem = z.infer<typeof selectCartItemSchema>
export type DetailedCartItem = Pick<ExistingCartItem,"quantity"> & {
    "product":Pick<ProductItem,"id"|"mainImage"|"price"|"discountPercentage"|"nameI18n"|"stock"> & {
        "category":Pick<ExistingCategory,"nameI18n">
    }
}