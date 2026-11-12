import { relations } from "drizzle-orm";
import { users } from "./users";
import { storeUsers } from "./storeUsers";
import { stores } from "./stores";
import { products } from "./products";
import { categories } from "./categories";
import { subcategories } from "./subcategories";
import { productImages } from "./productImages";
import { variantTypes } from "./variantTypes";
import { variantCombinations } from "./variantCombinations";
import { variantOptions } from "./variantOptions";
import { cartItems } from "./cartItems";
import { carts } from "./carts";
import { wishlistItems } from "./wishlistItems";
import { wishlists } from "./wishlists";
import { addresses } from "./addresses";
import { orders } from "./orders";
import { orderItems } from "./orderItems";
import { productStockSubscriptions } from "./productStockSubscriptions";
import { userPreferences } from "./userPreferences";
import { accountDeletionRequests } from "./accountDeletionRequests";
import { serviceCategories } from "./serviceCategories";
import { services } from "./services";
import { serviceImages } from "./serviceImages";
import { additionalServiceOptions } from "./additionalServiceOptions";
import { serviceRequests } from "./serviceRequests";
import { storeTaxSettings } from "./storeTaxSettings";
import { storeShippingMethods } from "./storeShippingMethods";
import { storePaymentMethods } from "./storePaymentMethods";
import { storeBranches } from "./storeBranches";
import { branchBusinessHours } from "./branchBusinessHours";
import { teamMembers } from "./teamMembers";
import { aboutPageContent } from "./aboutPageContent";
import { storeAssets } from "./storeAssets";
import { privacyPolicy } from "./privacyPolicy";
import { contactInformation } from "./contactInformation";
import { faqCategories } from "./faqCategories";
import { faqs } from "./faqs";
import { storeDisplaySettings } from "./storeDisplaySettings";
import { rewards } from "./rewards";
import { customerRewardRedemptions } from "./customerRedemptions";
import { customerPointLogs } from "./customerPointLogs";
import { customerPoints } from "./customerPoints";
import { tiers } from "./tiers";
import { pointEarningMethods } from "./pointEarningMethods";
import { promotionCodeUsages } from "./promotionCodeUsages";
import { promotionCodes } from "./promotionCodes";
import { orderStatusUpdates } from "./orderStatusUpdates";
import { storeCartSettings } from "./storeCartSettings";
import { storeEmailPreferences } from "./storeEmailPreferences";
import { messages } from "./messages";

export const tenantUserRelations = relations(storeUsers, ({ one }) => ({
    user: one(users, {
        fields: [storeUsers.userId],
        references: [users.id],
    }),
    store: one(stores, {
        fields: [storeUsers.storeId],
        references: [stores.id],
    }),
}));


// products
export const productRelations = relations(products, ({ one, many }) => ({
    category: one(categories, {
        fields: [products.categoryId],
        references: [categories.id],
    }),
    subcategory: one(subcategories, {
        fields: [products.subcategoryId],
        references: [subcategories.id],
    }),
    images: many(productImages),
    variantTypes: many(variantTypes),
    variantCombinations: many(variantCombinations),
}));

// categories
export const categoryRelations = relations(categories, ({ many }) => ({
    subcategories: many(subcategories),
    products: many(products),
}));

// subcategories
export const subcategoryRelations = relations(subcategories, ({ one, many }) => ({
    category: one(categories, {
        fields: [subcategories.categoryId],
        references: [categories.id],
    }),
    products: many(products),
}));

// productImages
export const imageRelations = relations(productImages, ({ one }) => ({
    product: one(products, {
        fields: [productImages.productId],
        references: [products.id],
    }),
}));

// variantTypes
export const variantTypeRelations = relations(variantTypes, ({ one, many }) => ({
    product: one(products, {
        fields: [variantTypes.productId],
        references: [products.id],
    }),
    options: many(variantOptions),
}));

// variantOptions
export const variantOptionRelations = relations(variantOptions, ({ one }) => ({
    variantType: one(variantTypes, {
        fields: [variantOptions.variantTypeId],
        references: [variantTypes.id],
    }),
}));

// variantCombinations
export const variantCombinationRelations = relations(variantCombinations, ({ one }) => ({
    product: one(products, {
        fields: [variantCombinations.productId],
        references: [products.id],
    }),
}));



export const cartRelations = relations(carts, ({ many }) => ({
    items: many(cartItems),
}));

export const cartItemRelations = relations(cartItems, ({ one }) => ({
    cart: one(carts, { fields: [cartItems.cartId], references: [carts.id] }),
    product: one(products, { fields: [cartItems.productId], references: [products.id] }),
    variant: one(variantCombinations, {
        fields: [cartItems.variantCombinationId],
        references: [variantCombinations.id],
    }),
}));

export const wishlistRelations = relations(wishlists, ({ many }) => ({
    items: many(wishlistItems),
}));

export const wishlistItemRelations = relations(wishlistItems, ({ one }) => ({
    wishlist: one(wishlists, { fields: [wishlistItems.wishlistId], references: [wishlists.id] }),
    product: one(products, { fields: [wishlistItems.productId], references: [products.id] }),
    variant: one(variantCombinations, {
        fields: [wishlistItems.variantCombinationId],
        references: [variantCombinations.id],
    }),
}));



// --- Address Relations ---

export const addressRelations = relations(addresses, ({ one, many }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),
  orders: many(orders),
  serviceRequests: many(serviceRequests),
}));




// --- Orders Relations ---

export const orderRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  address: one(addresses, {
    fields: [orders.addressId],
    references: [addresses.id],
  }),
  items: many(orderItems),
  statusUpdates: many(orderStatusUpdates),
}));

export const orderStatusUpdatesRelations = relations(orderStatusUpdates, ({ one }) => ({
  store: one(stores, {
    fields: [orderStatusUpdates.storeId],
    references: [stores.id],
  }),
  order: one(orders, {
    fields: [orderStatusUpdates.orderId],
    references: [orders.id],
  }),
}))

// --- Order Items Relations ---

export const orderItemRelations = relations(orderItems, ({ one }) => ({
    order: one(orders, {
        fields: [orderItems.orderId],
        references: [orders.id],
    }),
    product: one(products, {
        fields: [orderItems.productId],
        references: [products.id],
    }),
    variantCombination: one(variantCombinations, {
        fields: [orderItems.variantCombinationId],
        references: [variantCombinations.id],
    }),
}));



export const productStockSubscriptionsRelations = relations(productStockSubscriptions, ({ one }) => ({
    product: one(products, {
        fields: [productStockSubscriptions.productId],
        references: [products.id],
    }),

    user: one(users, {
        fields: [productStockSubscriptions.userId],
        references: [users.id],
    }),

    store: one(stores, {
        fields: [productStockSubscriptions.storeId],
        references: [stores.id],
    }),
}));


export const userRelations = relations(users, ({ one, many }) => ({
  storeUsers: many(storeUsers),
  preferences: one(userPreferences, {
    fields: [users.id],
    references: [userPreferences.userId],
  }),
  deletionRequests: many(accountDeletionRequests),
  redeemedRewards: many(customerRewardRedemptions),
  rewardPoints:one(customerPoints, {
    fields: [users.id],
    references: [customerPoints.customerId],
  }),
  rewardPointLogs: many(customerPointLogs),
  messages: many(messages),
}));

export const contactMessagesRelations = relations(messages, ({ one }) => ({
  user: one(users, {
    fields: [messages.userId],
    references: [users.id],
  }),
  store: one(stores, {
    fields: [messages.storeId],
    references: [stores.id],
  }),
}));

export const userPreferencesRelations = relations(userPreferences, ({ one }) => ({
  user: one(users, {
    fields: [userPreferences.userId],
    references: [users.id],
  }),
}));



export const deletionRequestRelations = relations(accountDeletionRequests, ({ one }) => ({
  user: one(users, {
    fields: [accountDeletionRequests.userId],
    references: [users.id],
  }),
//   processedByUser: one(users, {
//     fields: [accountDeletionRequests.processedBy],
//     references: [users.id],
//   }),
}));



export const serviceCategoriesRelations =  relations(serviceCategories, ({ many }) => ({
  services: many(services),
}));

export const servicesRelations =  relations(services, ({ one, many }) => ({
  category: one(serviceCategories, {
    fields: [services.categoryId],
    references: [serviceCategories.id],
  }),
  images: many(serviceImages),
  addOns: many(additionalServiceOptions),
  requests: many(serviceRequests),
}));

export const serviceRequestsRelations = relations(serviceRequests, ({ one }) => ({
  service: one(services, {
    fields: [serviceRequests.serviceId],
    references: [services.id],
  }),
  customer: one(users, {
    fields: [serviceRequests.userId],
    references: [users.id],
  }),
  address: one(addresses, {
    fields: [serviceRequests.addressId],
    references: [addresses.id],
  }),
}));

export const serviceImagesRelations = relations(serviceImages, ({ one }) => ({
  service: one(services, {
    fields: [serviceImages.serviceId],
    references: [services.id],
  }),
}));

export const additionalServiceOptionsRelations = relations(additionalServiceOptions, ({ one }) => ({
  service: one(services, {
    fields: [additionalServiceOptions.serviceId],
    references: [services.id],
  }),
}));


export const storesRelations = relations(stores, ({ one, many }) => ({
  storeUsers: many(storeUsers),
  aboutPageContent: one(aboutPageContent, {
    fields: [stores.id],
    references: [aboutPageContent.storeId],
  }),
  contactInformation: one(contactInformation,{
    fields: [stores.id],
    references: [contactInformation.storeId],
  }),
  faqCategories: many(faqCategories),
  faqs: many(faqs),
  privacyPolicy: many(privacyPolicy),
  storeAssets: one(storeAssets, {
    fields: [stores.id],
    references: [storeAssets.storeId],
  }),
  storeBranches: many(storeBranches),
  storePaymentMethods: many(storePaymentMethods),
  storeShippingMethods: many(storeShippingMethods),
  storeTaxSettings: one(storeTaxSettings, {
    fields: [stores.id],
    references: [storeTaxSettings.storeId],
  }),
  storeDisplaySettings: one(storeDisplaySettings, {
    fields: [stores.id],
    references: [storeDisplaySettings.storeId],
  }),
  cartSettings: one(storeCartSettings, {
    fields: [stores.id],
    references: [storeCartSettings.storeId],
  }),
  emailPreferences: one(storeEmailPreferences, {
    fields: [stores.id],
    references: [storeEmailPreferences.storeId],
  }),
  teamMembers: many(teamMembers),
  messages: many(messages),
}))

export const faqCategoriesRelations = relations(faqCategories, ({ many, one }) => ({
  store: one(stores, {
    fields: [faqCategories.storeId],
    references: [stores.id],
  }),
  faqs: many(faqs),
}))

export const faqsRelations = relations(faqs, ({ one }) => ({
  category: one(faqCategories, {
    fields: [faqs.categoryId],
    references: [faqCategories.id],
  }),
  store: one(stores, {
    fields: [faqs.storeId],
    references: [stores.id],
  }),
}))

export const contactInformationRelations = relations(contactInformation, ({ one }) => ({
  store: one(stores, {
    fields: [contactInformation.storeId],
    references: [stores.id],
  }),
}))

export const privacyPolicyRelations = relations(privacyPolicy, ({ one }) => ({
  store: one(stores, {
    fields: [privacyPolicy.storeId],
    references: [stores.id],
  }),
}))

export const storeAssetsRelations = relations(storeAssets, ({ one }) => ({
  store: one(stores, {
    fields: [storeAssets.storeId],
    references: [stores.id],
  }),
}))

export const aboutPageContentRelations = relations(aboutPageContent, ({ one }) => ({
  store: one(stores, {
    fields: [aboutPageContent.storeId],
    references: [stores.id],
  }),
}))

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  store: one(stores, {
    fields: [teamMembers.storeId],
    references: [stores.id],
  }),
}))

export const storeBranchesRelations = relations(storeBranches, ({ one, many }) => ({
  store: one(stores, {
    fields: [storeBranches.storeId],
    references: [stores.id],
  }),
  businessHours: many(branchBusinessHours),
}))

export const storeBusinessHoursRelations = relations(branchBusinessHours, ({ one }) => ({
  branch: one(storeBranches, {
    fields: [branchBusinessHours.branchId],
    references: [storeBranches.id],
  }),
}))

export const storePaymentMethodsRelations = relations(storePaymentMethods, ({ one }) => ({
  store: one(stores, {
    fields: [storePaymentMethods.storeId],
    references: [stores.id],
  }),
}))

export const storeShippingMethodsRelations = relations(storeShippingMethods, ({ one }) => ({
  store: one(stores, {
    fields: [storeShippingMethods.storeId],
    references: [stores.id],
  }),
}))

export const storeTaxSettingsRelations = relations(storeTaxSettings, ({ one }) => ({
  store: one(stores, {
    fields: [storeTaxSettings.storeId],
    references: [stores.id],
  }),
}))


export const storeDisplaySettingsRelations = relations(storeDisplaySettings, ({ one }) => ({
  store: one(stores, {
    fields: [storeDisplaySettings.storeId],
    references: [stores.id],
  }),
}));


export const storeCartSettingsRelations = relations(storeCartSettings, ({ one }) => ({
  store: one(stores, {
    fields: [storeCartSettings.storeId],
    references: [stores.id],
  }),
}));


export const rewardsRelations = relations(rewards, ({ many }) => ({
  redemptions: many(customerRewardRedemptions),
  pointLogs: many(customerPointLogs),
}));


export const tiersRelations = relations(tiers, ({ many }) => ({
  customers: many(customerPoints),
}));

export const earningMethodsRelations = relations(pointEarningMethods, ({ many }) => ({
  pointLogs: many(customerPointLogs),
}));

export const customerPointsRelations = relations(customerPoints, ({ one, many }) => ({
  tier: one(tiers, {
    fields: [customerPoints.tierId],
    references: [tiers.id],
  }),
  pointLogs: many(customerPointLogs),
  redemptions: many(customerRewardRedemptions),
}));


export const customerPointLogsRelations = relations(customerPointLogs, ({ one }) => ({
  customer: one(customerPoints, {
    fields: [customerPointLogs.customerId],
    references: [customerPoints.customerId],
  }),
  method: one(pointEarningMethods, {
    fields: [customerPointLogs.methodId],
    references: [pointEarningMethods.id],
  }),
  reward: one(rewards, {
    fields: [customerPointLogs.rewardId],
    references: [rewards.id],
  }),
}));

export const customerRedemptionsRelations = relations(customerRewardRedemptions, ({ one }) => ({
  customer: one(customerPoints, {
    fields: [customerRewardRedemptions.customerId],
    references: [customerPoints.customerId],
  }),
  reward: one(rewards, {
    fields: [customerRewardRedemptions.rewardId],
    references: [rewards.id],
  }),
  order: one(orders, {
    fields: [customerRewardRedemptions.orderId],
    references: [orders.id],
  }),
}));

export const promotionCodeUsagesRelations = relations(promotionCodeUsages, ({ one }) => ({
  store: one(stores, {
    fields: [promotionCodeUsages.storeId],
    references: [stores.id],
  }),
  promotionCode: one(promotionCodes, {
    fields: [promotionCodeUsages.promotionCodeId],
    references: [promotionCodes.id],
  }),
  customer: one(users, {
    fields: [promotionCodeUsages.customerId],
    references: [users.id],
  }),
  order: one(orders, {
    fields: [promotionCodeUsages.orderId],
    references: [orders.id],
  }),
}))
