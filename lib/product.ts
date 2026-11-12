export const genProductImageUrl = (productImage?:string|null) => productImage ? `/api/imgs/products/${productImage}`  : "/placeholder.png"


export const productPriceRanges = {
    "all":"All Prices",
    "under-50":"Under 50 EGP",
    "50-100":"50 - 100 EGP",
    "over-100":"Over 100 EGP",
} as const

export type ProductPriceRange = keyof typeof productPriceRanges