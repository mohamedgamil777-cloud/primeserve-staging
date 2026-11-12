import { TranslatedText } from "./internationalization"
import { ExistingProduct } from "./product"

export const wishlistSorts = {
    "date-desc":"Date Added (Newest)",
    "date-asc":"Date Added (Oldest)",
    "price-low":"Price (Low to High)",
    "price-high":"Price (High to Low)",
} as const

export type WishlistSort = keyof typeof wishlistSorts


export const wishlistStockStatuses = {
    "all":"All Items",
    "in-stock":"In Stock",
    "out-of-stock":"Out of Stock"
}

export type WishlistStockFilter = keyof typeof wishlistStockStatuses


export type WishlistItem = Pick<ExistingProduct,"id"|"nameI18n"|"price"|"mainImage"> & {
    category: TranslatedText,
    addedOn: Date,
    inStock: boolean,
}


export type WishListFilters = {
    'query'?:string,
    'customerId'?:string,
    'sort'?:WishlistSort,
    'stockFilter'?:WishlistStockFilter,
}