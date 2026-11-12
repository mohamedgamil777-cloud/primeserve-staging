export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  images: string[]
  rating: number
  reviewCount: number
  isNew: boolean
  discountPercentage: number
  variants: ProductVariant[]
}

export interface ProductVariant {
  id: string
  name: string
  inStock: boolean
}

export interface Category {
  id: string
  name: string
  image: string
  count: number
}
