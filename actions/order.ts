"use server"
import { genId } from "@/lib/utils"
import { db } from "@/db"
import { and, eq } from "drizzle-orm"
import { getSession } from "@/lib/auth-server"
import { addresses, cartItems, carts, customerCategorySpending, customerPointLogs, customerPoints, customerRewardRedemptions, orderItems, orders, pointEarningMethods, products, promotionCodes, promotionCodeUsages } from "@/db/schema"
import { errorMsgs } from "@/lib/error"
import { getTenantId } from "@/lib/tenant"
import { adjustCustomerTier } from "@/db/lib/tier"
import { orderStatusUpdates } from "@/db/schema/orderStatusUpdates"
import { NewOrderEmail } from "@/components/mail/NewOrderEmail"
import { formatDate } from "@/lib/date"
import { Resend } from "resend"
import { getLocalizedValue } from "@/types/internationalization"


export const confirmOrder = async (addressId:string,rewardId?:string,promotionCodeId?:string) => {
	let orderId = ""
	const [session,storeId] = await Promise.all([
		getSession(),
		getTenantId()
	])
	if(!session) return {"error":errorMsgs.NotAuthenticated}
	try {
		const [existingAddress] = await db.select({"id":addresses.id}).from(addresses).where(
			and(
				eq(addresses.id,addressId),
				eq(addresses.userId,session.user_id),
				eq(addresses.storeId,storeId),
			)
		)
		if(!existingAddress) return {"error":"Please select the address where the order should be shipped to."}
		const [userCart] = await db.select().from(carts).where(
			and(
				eq(carts.userId,session.user_id),
				eq(carts.storeId,storeId),
			)
		)
		const [userCartItems,_storeCartSettings] = await Promise.all([
			!userCart ? [] : db.query.cartItems.findMany(
				{
					"where":(cartItems,{eq})=>eq(cartItems.cartId,userCart.id),
					"with":{
						"product":true
					}
				}
	
			),
			db.query.storeCartSettings.findFirst(
				{
					"where":(storeCartSettings,{eq})=>eq(storeCartSettings.storeId,storeId),
				}	
			)
		]) 
		if(userCartItems.length === 0) return {"error":"Your cart is empty. Please add items to your cart before checkout"}
		
		const itemsCount = userCartItems.reduce((acc,cur)=>acc + cur["quantity"],0) 
		const subtotal = userCartItems.reduce((acc,cur)=>acc + (
			cur["quantity"] * cur["product"]["price"] * (100 - cur["product"]["discountPercentage"]) / 100 
		) ,0)


		if (!!_storeCartSettings?.minPurchaseAmount && subtotal < _storeCartSettings.minPurchaseAmount) return {
			"error":`Minimum order amount is $${_storeCartSettings.minPurchaseAmount?.toFixed(2)}`
		}

		// Validate maximum purchase amount
		if (!!_storeCartSettings?.maxPurchaseAmount && subtotal > _storeCartSettings.maxPurchaseAmount) return {
			"error":`Maximum order amount is $${_storeCartSettings?.maxPurchaseAmount.toFixed(2)}`
		}

		// Validate minimum items per order
		if (!!_storeCartSettings?.minItemsPerOrder && itemsCount < _storeCartSettings.minItemsPerOrder) return {
			"error":`Minimum ${_storeCartSettings.minItemsPerOrder} item${_storeCartSettings.minItemsPerOrder !== 1 ? 's' : ''} per order`
		}

		// Validate maximum items per order
		if (!!_storeCartSettings?.maxItemsPerOrder && itemsCount > _storeCartSettings.maxItemsPerOrder) return {
			"error":`Maximum ${_storeCartSettings.maxItemsPerOrder} item${_storeCartSettings.maxItemsPerOrder !== 1 ? 's' : ''} per order`
		}


		const [appliedReward,appliedPromoCode,usedPromotion] = await Promise.all([
			(!rewardId || !_storeCartSettings?.rewardEnabled) ? undefined : db.query.customerRewardRedemptions.findFirst({
				"columns":{
					"id":true
				},
				"with":{
					"reward":{
						"columns":{
							"value":true,
							"type":true,
						}
					}
				},
				"where":(customerRewardRedemptions,{and,eq,gt})=>and(
					eq(customerRewardRedemptions.id,rewardId),
					eq(customerRewardRedemptions.customerId,session.user_id),
					eq(customerRewardRedemptions.storeId,storeId),
					eq(customerRewardRedemptions.used,false),
					gt(customerRewardRedemptions.expiresAt,new Date()),
				)
			}),
			(!promotionCodeId || !_storeCartSettings?.promotionEnabled) ? undefined : db.query.promotionCodes.findFirst({
				"columns":{
					"id":true,
					"code":true,
					"value":true,
					"type":true,
					"usageLimit":true,
					"usageCount":true,
					"minPurchase":true
				},
				"where":(promotionCodes,{eq,and})=>and(
					eq(promotionCodes.id,promotionCodeId),
					eq(promotionCodes.isActive,true),
					eq(promotionCodes.storeId,storeId),
				)
			}),
			!promotionCodeId ? undefined : db.query.promotionCodeUsages.findFirst({
				"where":(promotionCodeUsages,{eq,and})=>and(
					eq(promotionCodeUsages.promotionCodeId,promotionCodeId),				
					eq(promotionCodeUsages.customerId,session.user_id),				
				)
			}),
		]) 

		const rewardDiscount = (
			appliedReward && appliedReward.reward.type === "discount" 
			? (appliedReward.reward.value ?? 0) 
			: 0
		)

		const promotionDiscount = (
			!usedPromotion && !!appliedPromoCode && (!appliedPromoCode.usageLimit || appliedPromoCode.usageCount < appliedPromoCode.usageLimit)
			?
			(
				appliedPromoCode.type === "fixed"
				?
				(appliedPromoCode.value ?? 0)
				:
				appliedPromoCode.type === "percentage"
				?
				subtotal * ( (appliedPromoCode.value ?? 0) / 100 )
				:
				0
			)
			:
			0
		)

		//TODO: handle shipping cost and free shipping reward & promo codes
		const shipping = 0
		const shippingDiscount = (
			(!usedPromotion && appliedPromoCode?.type === "shipping")
			||
			(appliedReward?.reward?.type === "shipping")
			?
			shipping
			:
			0
		)

		//TODO: take into account shipping, and tax
		const orderTotalAmount = (
			subtotal + shipping - rewardDiscount - promotionDiscount - shippingDiscount
		)
		const productsCount = userCartItems.reduce((acc,cur)=>acc + cur["quantity"],0)
		
		await db.transaction(async tx=>{
			const [newOrder] = await tx.insert(orders).values({
				"addressId":existingAddress.id,
				"code":genId(8),
				"status":"pending",
				"userId":session.user_id,
				"storeId":storeId,
				"totalAmount":orderTotalAmount,
				subtotal,
				rewardDiscount,
				promotionDiscount,
				productsCount,
				"freeShipping": appliedReward?.reward?.type === "shipping" || (!usedPromotion && appliedPromoCode?.type === "shipping")
			}).returning()
			orderId = newOrder.code
	
			await tx.insert(orderStatusUpdates).values({
				"status":"pending",
				"date":new Date(),
				"orderId":newOrder.id,
				"storeId":storeId,
			})
	
			await tx.insert(orderItems).values(
				userCartItems.map(cartItem=>({
					"orderId":newOrder.id,
					"productId": cartItem.product.id,
					"quantity": cartItem.quantity,
					"price": cartItem.product.price,
					"nameI18n": cartItem.product.nameI18n,
					"mainImage": cartItem.product.mainImage,
				}))
			)
			await tx.delete(cartItems).where(eq(cartItems.cartId,userCart.id))
			// update stock
			await Promise.all(userCartItems.map(async cartItem=>(
				await tx.update(products).set({
					"stock":Math.max((cartItem.product.stock ?? 0) - cartItem.quantity,0)
				}).where(eq(products.id,cartItem.product.id))
			)))
			// record category spending
			const groupedSpendings: Record<
				string,
				{ totalAmount: number; totalQuantity: number }
			> = {}
	
			for (const item of userCartItems) {
				const categoryId = item.product.categoryId
				const amount = item.quantity * item.product.price
				if (!groupedSpendings[categoryId]) {
					groupedSpendings[categoryId] = {
						totalAmount: 0,
						totalQuantity: 0,
					}
				}
				groupedSpendings[categoryId].totalAmount += amount
				groupedSpendings[categoryId].totalQuantity += item.quantity
			  }
			await tx.insert(customerCategorySpending).values(
				Object.entries(groupedSpendings).map(ent=>(
					{
						"storeId":storeId,
						"orderId":newOrder.id,
						"customerId":session.user_id,
						"date":new Date().toISOString(),
						"amount":ent[1]["totalAmount"],
						"categoryId":ent[0]
					}
				))
			)
			// mark reward as used if was used
			// only discount & shipping can be used with orders
			if(appliedReward?.reward.type === "discount" || appliedReward?.reward.type === "shipping"){
				await tx.update(customerRewardRedemptions)
					.set({"used":true})
					.where(eq(customerRewardRedemptions.id,appliedReward.id))
			}
	
			// add a log of using the promocode
			if(!usedPromotion && !!appliedPromoCode) await Promise.all([
				tx.insert(promotionCodeUsages).values({
					"customerId":session.user_id,
					"orderId":newOrder.id,
					"promotionCodeId":appliedPromoCode.id,
					"usedAt":new Date(),
					"storeId":storeId
				}),
				tx.update(promotionCodes)
					.set({
						"usageCount":appliedPromoCode.usageCount + 1
					})
					.where(eq(promotionCodes.id,appliedPromoCode.id))
	
			])
			
			// update customer points
			const [customerTier,purchaseReward] = await Promise.all([
				tx.query.customerPoints.findFirst({
					"with":{
						"tier":{
							"columns":{
								"pointsMultiplier":true,
							}
						}
					},
					"columns":{"points":true},
					"where":(customerPoints,{eq})=>eq(customerPoints.customerId,session.user_id)
				}),
				tx.query.pointEarningMethods.findFirst({
					"columns":{
						"id":true,
						"pointsPerDollar":true,
						"totalEarned":true,
						"totalPointsEarned":true,
					},
					"where":(pointEarningMethods,{and,eq})=>and(
						eq(pointEarningMethods.storeId,storeId),
						eq(pointEarningMethods.isActive,true),
						eq(pointEarningMethods.type,"purchase"),
					)
				})
			]) 
			if(purchaseReward){
				const earnedPoints = Math.floor(purchaseReward.pointsPerDollar * orderTotalAmount * (customerTier?.tier?.pointsMultiplier ?? 1))
				await Promise.all([
					tx.update(customerPoints).set({
						"points":(customerTier?.points ?? 0) + earnedPoints
					}).where(eq(customerPoints.customerId,session.user_id)),
					tx.insert(customerPointLogs).values({
						"type":"earn",
						"customerId":session.user_id,
						"methodId":purchaseReward.id,
						"points":earnedPoints,
						"storeId":storeId,
						"createdAt":new Date()
					}),
					tx.update(pointEarningMethods)
						.set({
							"totalEarned":purchaseReward.totalEarned + 1,
							"totalPointsEarned":purchaseReward.totalPointsEarned + earnedPoints
						})
						.where(eq(pointEarningMethods.id,purchaseReward.id))
				])
				await adjustCustomerTier(session.user_id,storeId)
			}
			// notifiy the admin about the order
			const [emailPrefs,buyer] = await Promise.all([
				db.query.storeEmailPreferences.findFirst({
					"where":(storeEmailPreferences,{eq})=>eq(storeEmailPreferences.storeId,storeId),
					"columns":{
						"resendApiKey":true,
						"notifyOnNewOrder":true,
						"orderNotificationEmail":true,
						"fromEmail":true,
						"emailSenderName":true
					}
				}),
				db.query.users.findFirst({
					"where":(users,{eq})=>eq(users.id,session.user_id),
					"columns":{
						"firstName":true,
						"lastName":true,
					}
				})

			]) 
			if(emailPrefs && emailPrefs.resendApiKey && emailPrefs.notifyOnNewOrder && emailPrefs.orderNotificationEmail){
				const resend = new Resend(emailPrefs.resendApiKey);
				const { data, error } = await resend.emails.send({
					from: `${emailPrefs.emailSenderName} <${emailPrefs.fromEmail}>`,
					to: emailPrefs.orderNotificationEmail,
					subject: `New Order Received - #${newOrder.code}`,
					react: NewOrderEmail({
						orderId: newOrder.id,
						orderCode: newOrder.code,
						customerName: `${buyer?.firstName} ${buyer?.lastName}`,
						orderDate: formatDate(newOrder.createdAt),
						totalAmount: newOrder.totalAmount.toLocaleString(),
						orderItems: userCartItems.map(orderItem=>({
							"name":getLocalizedValue(orderItem.product.nameI18n,"en") ?? "",
							"price":orderItem.product.price.toLocaleString(),
							"quantity":orderItem.quantity
						})),
					}),
				}); 
				if(error) console.error(error)
			}
		})
		return {
			success: true,
			orderId
		}
	} 
	catch (error) {
		if((error as Error).message === "NEXT_REDIRECT") throw error
		console.error(error)
		return {"error":"something went wrong, try again later."}		
	}	

}


export const cancelOrder = async (orderId:string) => {
	const [session,storeId] = await Promise.all([
		getSession(),
		getTenantId()
	])
	if(!session) return {"error":errorMsgs.NotAuthenticated}
	try {
		await db.transaction(async tx=>{
			//TODO: maybe un-use any used promotion codes or rewards or make store owner
			// control if we should return them on cancelation or not and warn customer about that
			// in order cancelation dialog
			//TODO: update customer points

			const [order] = await tx.update(orders)
				.set({
					"status":"cancelled"
				})
				.where(and(
					eq(orders.id,orderId),
					eq(orders.userId,session.user_id)
				)).returning()
			if(!order) return {"success":true}

			const items = await tx.select({"productId":orderItems.productId,"quantity":orderItems.quantity})
				.from(orderItems)
				.where(eq(orderItems.orderId,order.id))

			await Promise.all([
				tx.insert(orderStatusUpdates).values({
					"status":"cancelled",
					"date":new Date(),
					"orderId":order.id,
					"storeId":storeId,
				}),
				// delete category spending
				tx.delete(customerCategorySpending)
					.where(eq(customerCategorySpending.orderId,order.id)),
				items.map(async item=>{
					if(!item.productId) return
					const [product] = await tx.select({"stock":products.stock})
						.from(products) 
						.where(eq(products.id,item.productId))
					if(!product) return
					await tx.update(products)
						.set({
							"stock":(product.stock ?? 0) + (item.quantity ?? 0)
						})
						.where(eq(products.id,item.productId))
				})
			])
		})
	} 
	catch (error) {
		if((error as Error).message === "NEXT_REDIRECT") throw error
		console.error(error)
		return {"error":"something went wrong, try again later."}		
	}
	return {"success":true}	
}
