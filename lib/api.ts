import type { Product } from "@/types"

// Mock data for products
const products: Product[] = [
  {
    id: "1",
    name: "Classic White T-Shirt",
    description: "A timeless classic white t-shirt made from premium cotton.",
    price: 29.99,
    category: "Men",
    images: ["/placeholder.png?height=600&width=400", "/placeholder.png?height=600&width=400"],
    rating: 4.5,
    reviewCount: 128,
    isNew: false,
    discountPercentage: 0,
    variants: [
      { id: "1-s", name: "Small", inStock: true },
      { id: "1-m", name: "Medium", inStock: true },
      { id: "1-l", name: "Large", inStock: true },
      { id: "1-xl", name: "X-Large", inStock: false },
    ],
  },
  {
    id: "2",
    name: "Slim Fit Jeans",
    description: "Modern slim fit jeans with a comfortable stretch.",
    price: 59.99,
    category: "Men",
    images: ["/placeholder.png?height=600&width=400", "/placeholder.png?height=600&width=400"],
    rating: 4.2,
    reviewCount: 95,
    isNew: false,
    discountPercentage: 15,
    variants: [
      { id: "2-30", name: "30", inStock: true },
      { id: "2-32", name: "32", inStock: true },
      { id: "2-34", name: "34", inStock: true },
      { id: "2-36", name: "36", inStock: true },
    ],
  },
  {
    id: "3",
    name: "Floral Summer Dress",
    description: "Light and breezy floral dress perfect for summer days.",
    price: 49.99,
    category: "Women",
    images: ["/placeholder.png?height=600&width=400", "/placeholder.png?height=600&width=400"],
    rating: 4.8,
    reviewCount: 156,
    isNew: true,
    discountPercentage: 0,
    variants: [
      { id: "3-xs", name: "XS", inStock: true },
      { id: "3-s", name: "S", inStock: true },
      { id: "3-m", name: "M", inStock: true },
      { id: "3-l", name: "L", inStock: false },
    ],
  },
  {
    id: "4",
    name: "Leather Crossbody Bag",
    description: "Stylish leather crossbody bag with multiple compartments.",
    price: 79.99,
    category: "Accessories",
    images: ["/placeholder.png?height=600&width=400", "/placeholder.png?height=600&width=400"],
    rating: 4.6,
    reviewCount: 87,
    isNew: false,
    discountPercentage: 20,
    variants: [
      { id: "4-black", name: "Black", inStock: true },
      { id: "4-brown", name: "Brown", inStock: true },
      { id: "4-tan", name: "Tan", inStock: false },
    ],
  },
  {
    id: "5",
    name: "Running Sneakers",
    description: "Lightweight running sneakers with superior cushioning.",
    price: 89.99,
    category: "Shoes",
    images: ["/placeholder.png?height=600&width=400", "/placeholder.png?height=600&width=400"],
    rating: 4.7,
    reviewCount: 213,
    isNew: true,
    discountPercentage: 0,
    variants: [
      { id: "5-8", name: "8", inStock: true },
      { id: "5-9", name: "9", inStock: true },
      { id: "5-10", name: "10", inStock: true },
      { id: "5-11", name: "11", inStock: true },
    ],
  },
  {
    id: "6",
    name: "Oversized Sweater",
    description: "Cozy oversized sweater for those chilly days.",
    price: 69.99,
    category: "Women",
    images: ["/placeholder.png?height=600&width=400", "/placeholder.png?height=600&width=400"],
    rating: 4.4,
    reviewCount: 76,
    isNew: false,
    discountPercentage: 10,
    variants: [
      { id: "6-s", name: "Small", inStock: true },
      { id: "6-m", name: "Medium", inStock: true },
      { id: "6-l", name: "Large", inStock: false },
    ],
  },
  {
    id: "7",
    name: "Aviator Sunglasses",
    description: "Classic aviator sunglasses with UV protection.",
    price: 129.99,
    category: "Accessories",
    images: ["/placeholder.png?height=600&width=400", "/placeholder.png?height=600&width=400"],
    rating: 4.9,
    reviewCount: 142,
    isNew: false,
    discountPercentage: 0,
    variants: [
      { id: "7-gold", name: "Gold", inStock: true },
      { id: "7-silver", name: "Silver", inStock: true },
      { id: "7-black", name: "Black", inStock: true },
    ],
  },
  {
    id: "8",
    name: "Denim Jacket",
    description: "Versatile denim jacket that goes with everything.",
    price: 79.99,
    category: "Men",
    images: ["/placeholder.png?height=600&width=400", "/placeholder.png?height=600&width=400"],
    rating: 4.3,
    reviewCount: 98,
    isNew: true,
    discountPercentage: 0,
    variants: [
      { id: "8-s", name: "Small", inStock: false },
      { id: "8-m", name: "Medium", inStock: true },
      { id: "8-l", name: "Large", inStock: true },
      { id: "8-xl", name: "X-Large", inStock: true },
    ],
  },
]

// Simulate API calls with delays
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function fetchFeaturedProducts(): Promise<Product[]> {
  await delay(800) // Simulate network delay
  return products.slice(0, 8)
}

export async function fetchProductById(id: string): Promise<Product | undefined> {
  await delay(500)
  return products.find((product) => product.id === id)
}

export async function fetchProductsByCategory(category: string): Promise<Product[]> {
  await delay(800)
  return products.filter((product) => product.category.toLowerCase() === category.toLowerCase())
}

export async function searchProducts(query: string): Promise<Product[]> {
  await delay(600)
  const lowercaseQuery = query.toLowerCase()
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery),
  )
}
