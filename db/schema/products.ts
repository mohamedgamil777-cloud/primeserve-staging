import { pgTable, uuid, text, numeric, boolean, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { stores } from "./stores";
import { createOptionalTranslatedFieldSchema, createTranslatedFieldSchema, TranslatedText } from "@/types/internationalization";
import { subcategories } from "./subcategories";
import { categories } from "./categories";

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),

  nameI18n: jsonb("name_i18n").$type<TranslatedText>().notNull().default({}),
  descriptionI18n: jsonb("description_i18n").$type<TranslatedText>().default({}),

  mainImage: text("main_image").notNull(),
  price: integer("price").notNull(),
  stock: integer("stock"),
  isNew: boolean("is_new").default(false),
  discountPercentage: integer("discount_percentage").notNull().default(0),
  rating: integer("rating").default(0),
  reviewCount: integer("review_count").default(0),
  hasVariants: boolean("has_variants").default(false),

  categoryId: uuid("category_id").notNull().references(()=>categories.id,{"onDelete":"cascade"}),
  subcategoryId: uuid("subcategory_id").notNull().references(()=>subcategories.id,{"onDelete":"cascade"}),
  storeId: uuid("store_id").references(() => stores.id).notNull(),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});


export const insertProductSchema = createInsertSchema(products, {
  id: z.string().optional(),
  price: z.coerce.number().positive({ message: "Price must be a positive number." }),
  categoryId: z.string().min(1, { message: "Please select a category." }),
  subcategoryId: z.string().min(1, { message: "Please select a subcategory." }),
  discountPercentage: z.coerce.number().min(0).max(100, { message: "Discount must be between 0 and 100%." }),
  mainImage: z.any().optional(),
})
  .omit({
    hasVariants: true,
    createdAt: true,
    rating: true,
    reviewCount: true,
    storeId: true,
  })
  .extend({
    nameI18n: createTranslatedFieldSchema(2, "Name"),
    descriptionI18n: createOptionalTranslatedFieldSchema(10, "Description"),
    variantTypes: z
      .array(
        z.object({
          name: z.string().min(1, { message: "Variant type name is required." }),
          options: z.array(z.string()).min(1, { message: "At least one option is required." }),
        }),
      )
      .optional(),
    variantCombinations: z
      .array(
        z.object({
          id: z.string(),
          combination: z.record(z.string(), z.string()),
          price: z.coerce.number().min(0),
          stock: z.coerce.number().min(0),
          sku: z.string().optional(),
          barcode: z.string().optional(),
          isActive: z.boolean().default(true),
        }),
      )
      .optional(),
    images: z.array(z.any()).optional(),
  });
  
export const selectProductSchema = createSelectSchema(products);
  