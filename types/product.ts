import { selectProductSchema } from "@/db/schema/products";
import { z } from "zod";
import { ExistingCategory } from "./category";
import { ProductPriceRange } from "@/lib/product";

export type ExistingProduct = z.infer<typeof selectProductSchema>
export type ProductStatus = "active"|"out-of-stock"|"low-stock"
export type ProductSort = "price-low-high"|"price-high-low"|"newest"|"rating"|"featured"

export type ProductFilters = {
    query?:string,
    status?:ProductStatus,
    categoryId?:string,
    categoryIds?:string,
    subcategoryIds?:string,
    sort?:ProductSort,
    priceRange?:ProductPriceRange
}


export type ProductItem = Omit<ExistingProduct,"storeId"|"updatedAt"|"createdAt"|"hasVariants"> & {
    "category":Pick<ExistingCategory,"nameI18n">,
    "isExtended"?:boolean
}


export type ExcelProduct =  {
  id: string;
  name: string;
  description: string|null;
  stock: number;
  // Add other product fields as needed
}