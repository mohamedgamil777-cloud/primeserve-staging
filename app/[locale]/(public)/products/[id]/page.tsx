"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { useParams } from "next/navigation"
import { fetchProductById } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/hooks/use-cart"
import { Heart, Minus, Plus, Share2, ShoppingCart, Star, Truck, Bell } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { BackInStockDialog } from "@/components/product/back-in-stock-dialog"

export default function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState("")
  const [showBackInStockDialog, setShowBackInStockDialog] = useState(false)
  const { addItems } = useCart()

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
  })

  const { data: relatedProducts, isLoading: isLoadingRelated } = useQuery({
    queryKey: ["relatedProducts", product?.category],
    queryFn: () => fetchProductById("1"), // Mock related products
    enabled: !!product,
  })

  const handleAddToCart = () => {
    if (product) {
      // Add the product to cart multiple times based on quantity
      for (let i = 0; i < quantity; i++) {
        // addItem(product)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full rounded-xl" />
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full rounded-lg" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-6 w-1/3" />
            </div>
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-1/3" />
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-16 rounded-md" />
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container flex items-center justify-center px-4 py-24 md:px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <p className="text-muted-foreground">The product you are looking for does not exist.</p>
          <Button asChild className="mt-4">
            <a href="/products">Back to Products</a>
          </Button>
        </div>
      </div>
    )
  }

  const discountedPrice = product.discountPercentage > 0 ? product.price * (1 - product.discountPercentage / 100) : null
  const isOutOfStock = true

  return (
    <>
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-xl border bg-muted">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={product.images[selectedImage]}
                alt={product.name}
                className={`h-full w-full object-cover ${isOutOfStock ? "grayscale" : ""}`}
              />
              {product.discountPercentage > 0 && (
                <div className="absolute left-2 top-2 rounded-md bg-red-500 px-2 py-1 text-xs font-medium text-white">
                  {product.discountPercentage}% OFF
                </div>
              )}
              {isOutOfStock && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                  <div className="text-center space-y-3">
                    <div className="text-lg font-semibold text-muted-foreground">Out of Stock</div>
                    <Button
                      variant="outline"
                      onClick={() => setShowBackInStockDialog(true)}
                      className="bg-background/90 backdrop-blur-sm"
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Notify When Available
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`relative aspect-square overflow-hidden rounded-lg border ${
                    selectedImage === index ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image || "/placeholder.png"}
                    alt={`${product.name} ${index + 1}`}
                    className={`h-full w-full object-cover ${isOutOfStock ? "grayscale" : ""}`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <div className="mt-2 flex items-center gap-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {product.isNew && <span className="text-green-500">New Arrival</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {discountedPrice ? (
                <>
                  <span className="text-2xl font-bold">EGP {discountedPrice.toFixed(2)}</span>
                  <span className="text-lg text-muted-foreground line-through">EGP {product.price.toFixed(2)}</span>
                </>
              ) : (
                <span className="text-2xl font-bold">EGP {product.price.toFixed(2)}</span>
              )}
            </div>
            <p className="text-muted-foreground">{product.description}</p>

            {!isOutOfStock && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="font-medium">Size</div>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        className={`rounded-md border px-3 py-1 text-sm ${
                          selectedVariant === variant.id
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-input bg-background"
                        } ${!variant.inStock ? "cursor-not-allowed opacity-50" : ""}`}
                        onClick={() => variant.inStock && setSelectedVariant(variant.id)}
                        disabled={!variant.inStock}
                      >
                        {variant.name}
                        {!variant.inStock && " - Out of Stock"}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-medium">Quantity</div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{quantity}</span>
                    <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" variant="outline" className="flex-1">
                <Heart className="mr-2 h-5 w-5" />
                Add to Wishlist
              </Button>
              {isOutOfStock ? (
                <Button size="lg" variant="outline" className="flex-1" onClick={() => setShowBackInStockDialog(true)}>
                  <Bell className="mr-2 h-5 w-5" />
                  Notify When Available
                </Button>
              ) : (
                <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={!selectedVariant}>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
              )}
            </div>
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">Free shipping on orders over $50</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4 space-y-4">
              <p>{product.description}</p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl
                nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl
                nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.
              </p>
            </TabsContent>
            <TabsContent value="details" className="mt-4 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="font-medium">Product Details</h3>
                  <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    <li>Material: Premium quality</li>
                    <li>Care: Machine wash cold</li>
                    <li>Origin: Imported</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Shipping Information</h3>
                  <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    <li>Free standard shipping on orders over $50</li>
                    <li>Express shipping available</li>
                    <li>International shipping available</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-4 space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Customer Reviews</h3>
                  <Button>Write a Review</Button>
                </div>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2 rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">Customer {i + 1}</div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, j) => (
                            <Star
                              key={j}
                              className={`h-4 w-4 ${j < 4 + (i % 2) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies
                        lacinia, nisl nisl aliquam nisl, eu aliquam nisl nisl sit amet nisl.
                      </p>
                      <div className="text-xs text-muted-foreground">Posted on {new Date().toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold">Related Products</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {isLoadingRelated
              ? Array(4)
                  .fill(null)
                  .map((_, index) => (
                    <div key={index} className="space-y-3">
                      <Skeleton className="aspect-square w-full rounded-xl" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-1/4" />
                      </div>
                    </div>
                  ))
              : [product, product, product, product].map((relatedProduct, index) => (
                  <ProductCard key={`${relatedProduct.id}-${index}`} product={relatedProduct as any} index={index} />
                ))}
          </div>
        </div>
      </div>

      {/* <BackInStockDialog product={product} /> */}
    </>
  )
}
