import { wishlistItems, products, categories } from '@/db/schema';
import { and, eq, ilike, gte } from 'drizzle-orm';
import { desc, asc } from 'drizzle-orm/sql';
import { db } from '..';
import { WishlistItem, WishlistSort, WishlistStockFilter } from '@/types/wishlist';

type WishlistFilters = {
    wishlistId: string;
    query?: string;
    inStock?: WishlistStockFilter;
    sort?: WishlistSort;
    page?: number;
    limit?: number;
};

export async function getUserWishlist({
    wishlistId,
    query,
    inStock,
    sort = "date-desc",
    page = 1,
    limit = 10,
}: WishlistFilters):Promise<WishlistItem[]> {
    const offset = (page - 1) * limit;


const rawWishlist = await db
    .select({
        id: products.id,
        nameI18n: products.nameI18n,
        price: products.price,
        stock: products.stock,
        addedAt: wishlistItems.addedAt,
        mainImage: products.mainImage, // assumes a single image field. Change this if you store images separately.
        category: categories.nameI18n,
    })
    .from(wishlistItems)
    .innerJoin(products, eq(wishlistItems.productId, products.id))
    .innerJoin(categories, eq(products.categoryId, categories.id)) // adjust based on your schema
    .where(and(
        eq(wishlistItems.wishlistId, wishlistId),
        // query ? ilike(products.name, `%${query}%`) : undefined,
        inStock === "in-stock" ? gte(products.stock, 1) : inStock === "out-of-stock" ? eq(products.stock, 0) : undefined,
    ))
    .orderBy(
        sort === 'date-desc' ? desc(wishlistItems.addedAt)
        : sort === 'date-asc' ? asc(wishlistItems.addedAt)
        : sort === 'price-high' ? desc(products.price)
        : asc(products.price)
    )
    .offset(offset)
    .limit(limit);

    const wishlist = rawWishlist.map(item => ({
        id: item.id,
        nameI18n: item.nameI18n,
        price: item.price,
        mainImage: item.mainImage,
        category: item.category,
        addedOn: item.addedAt,
        inStock: !item.stock || item.stock < 0 ? false : true,
    }));

    return wishlist;
}
