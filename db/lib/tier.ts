import { and, eq } from "drizzle-orm";
import { db } from "..";
import { customerPoints, tiers } from "../schema";

export async function adjustCustomerTier(customerId:string,storeId:string) {
    const [
        customerTier,
        storeTiers
    ] = await Promise.all([
        db.query.customerPoints.findFirst({
            "where":(customerPoints,{eq,and})=>and(
                eq(customerPoints.customerId,customerId),
                eq(customerPoints.storeId,storeId),
            )
        }),
        db.query.tiers.findMany({
            "where":(tiers,{eq,and})=>and(
                eq(tiers.storeId,storeId),
                eq(tiers.isActive,true),
            ),
            "columns":{
                "id":true,
                "minPoints":true,
                "maxPoints":true,
                "memberCount":true,
            }
        })
    ])
    if(!customerTier){
        const lowestTier = storeTiers.find(tier=>tier.minPoints === 0)
        await db.insert(customerPoints).values(
            {
                "customerId":customerId,
                "points":0,
                "storeId":storeId,
                "tierId":lowestTier?.id
            }
        )
        if(lowestTier?.id) await db.update(tiers)
            .set({"memberCount":lowestTier.memberCount + 1})
            .where(eq(tiers.id,lowestTier.id))
    }else{
        const currentTier = storeTiers.find(tier=>tier.id === customerTier.tierId)
        if(!currentTier || !(currentTier.minPoints >= customerTier.points && (currentTier.maxPoints ?? Number.POSITIVE_INFINITY) <= customerTier.points)){
            const newTier = storeTiers.find(tier=>tier.minPoints >= customerTier.points && (tier.maxPoints ?? Number.POSITIVE_INFINITY) <= customerTier.points)
            if(newTier){
                await Promise.all([
                    db.update(customerPoints).set({
                        "tierId":newTier.id
                    }).where(
                        and(
                            eq(customerPoints.customerId,customerId),
                            eq(customerPoints.storeId,storeId),
                        )
                    ),
                    await db.update(tiers).set({
                        "memberCount":newTier.memberCount + 1
                    }).where(eq(tiers.id,newTier.id))
                ]) 
                if(currentTier?.id) await db.update(tiers).set({
                    "memberCount":currentTier.memberCount - 1
                }).where(eq(tiers.id,currentTier.id))
            }
        }
    }
}