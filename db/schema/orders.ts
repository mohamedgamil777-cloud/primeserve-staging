import { pgTable, text, timestamp, numeric, integer, uuid, real, boolean } from "drizzle-orm/pg-core";
import { users } from "./users";
import { addresses } from "./addresses";
import { createSelectSchema } from "drizzle-zod";
import { stores } from "./stores";

export const ORDER_STATUSES = ['pending',"processing", 'paid', 'shipped', 'delivered', 'cancelled'] as const;
export const orders = pgTable('orders', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id),
    addressId: uuid('address_id').notNull().references(() => addresses.id),
    storeId: uuid('store_id').notNull().references(() => stores.id),
    code: text('code').notNull(),
    status: text('status',{"enum":ORDER_STATUSES}).notNull().default('pending'),
    productsCount: integer('products_count').notNull(),
    subtotal: real('subtotal').notNull().default(0),
    // for historical accuracy
    rewardDiscount: real('reward_discount').notNull().default(0),
    promotionDiscount: real('promotion_discount').notNull().default(0),
    shippingCost: real('shipping_cost').notNull().default(0),
    freeShipping: boolean('free_shipping').default(false),
    //
    totalAmount: real('total_amount').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});


  
export const selectOrderSchema = createSelectSchema(orders);
  