"use server"
import { z } from "zod"
import { loginSchema, registerSchema, updatePasswordSchema } from "@/types/auth"
import { cookies } from "next/headers"
import * as argon2 from "@node-rs/argon2"
import { db } from "@/db"
import { generateSession, getSession, logout } from "@/lib/auth-server"
import { UserRole, users } from "@/db/schema/users"
import { hardSanitizeForDom, hardSanitizeIfExistsForDom } from "@/lib/utils"
import { and, eq } from "drizzle-orm"
import { getTenantId } from "@/lib/tenant"
import { customerPointLogs, customerPoints, pointEarningMethods, userPreferences } from "@/db/schema"
import { errorMsgs } from "@/lib/error"
import { addMinutes } from "date-fns"
import VerifyEmail from "@/components/mail/verify-email"
import { Resend } from "resend"


export const signup = async (values: z.infer<typeof registerSchema>) => {
	try {
		registerSchema.parse(values)
	} catch (error) {
		return {
			error: (error as Error)?.message,
		}
	}
	const storeId = await getTenantId()
	const {firstName,lastName,email:_email,password} = values

	try {
		const email = _email.toLowerCase().trim()
		const [userExists] = await db.select({"id":users.id}).from(users).where(eq(users.email,email))
		if(userExists) return {"error":"There is already a user with the given email, if it belongs to you try loging in instead."}

		const hashedPassword = await argon2.hash(password)
		const [newUser] = await db.insert(users).values({
			"firstName":hardSanitizeForDom(firstName).trim(),
			"lastName":hardSanitizeForDom(lastName).trim(),
			"email":email.trim(),
			"phone":hardSanitizeIfExistsForDom(values.phone),
			"password":hashedPassword,
			"role": "customer",
			storeId
		}).returning()

		await db.insert(userPreferences).values({
			userId:newUser.id,
		})

		// loyalty system setup
		const [
			lowestTier,
			signupReward
		] = await Promise.all([
			db.query.tiers.findFirst({
				"columns":{"id":true,},
				"where":(tiers,{eq,and})=>and(
					eq(tiers.storeId,storeId),
					eq(tiers.minPoints,0),
					eq(tiers.isActive,true),
				)
			}),
			db.query.pointEarningMethods.findFirst({
				"columns":{
					"id":true,
					"pointsAwarded":true,
					"totalEarned":true,
					"totalPointsEarned":true,
				},
				"where":(pointEarningMethods,{and,eq})=>and(
					eq(pointEarningMethods.storeId,storeId),
					eq(pointEarningMethods.isActive,true),
					eq(pointEarningMethods.type,"signup"),
				)
			})
		]) 

		await db.insert(customerPoints).values(
			{
				"customerId":newUser.id,
				"points":0,
				"storeId":storeId,
				"tierId":lowestTier?.id
			}
		)

		if(signupReward){
			await Promise.all([
				db.update(customerPoints)
					.set({"points":signupReward.pointsAwarded})
					.where(eq(customerPoints.customerId,newUser.id)),
				db.insert(customerPointLogs).values({
					"type":"earn",
					"customerId":newUser.id,
					"methodId":signupReward.id,
					"points":signupReward.pointsAwarded,
					"storeId":storeId,
					"createdAt":new Date()
				}),
				db.update(pointEarningMethods)
					.set({
						"totalEarned":signupReward.totalEarned + 1,
						"totalPointsEarned":signupReward.totalPointsEarned + signupReward.pointsAwarded
					})
					.where(eq(pointEarningMethods.id,signupReward.id))
			])
		}


		const {session,expires} = await generateSession({"user_id":newUser.id,"user_role":newUser.role,"stores":[]});
		(await cookies()).set(
			"session", session, { expires, httpOnly: true }
		)

		return {
			success: true,
			data: {
				userId:String(newUser.id),
			},
		}
	} catch (error) {
		console.error(`signup:: ${(error as Error)?.message}`)
		return {
			error: "something went wrong, try again later.",
		}
	}
}




export const signin = async (values: z.infer<typeof loginSchema>) => {
	let userRole:UserRole = "customer"
	try {
		loginSchema.parse(values)
	} catch (error) {
		return {
		error: (error as Error).message,
		}
	}

	try {
		values.email = values.email.toLowerCase().trim()

		const existingUser = await db.query.users.findFirst({
			"where":(users,{eq})=>eq(users.email,values.email),
			"columns":{
				"password":true,
				"role":true,
				"id":true
			},
			"with":{
				"storeUsers":{
					"columns":{
						"storeId":true,
						"role":true
					}
				}
			}
		})

		if (!existingUser || !existingUser.password) {
			return {
				error: "هناك خطأ في البريد الإلكتروني أو كلمة السر",
			}
		}
	
		const isValidPassword = await argon2.verify(
			existingUser.password,
			values.password
		)
		if (!isValidPassword) {
			return {
				error: "هنا خطأ في البريد الإلكتروني أو كلمة السر",
			}
		}
		userRole = existingUser.role
		const {session,expires} = await generateSession({"user_id":existingUser.id,"user_role":existingUser.role,"stores":existingUser.storeUsers.map(store=>store.storeId)});
		(await cookies()).set(
			"session", session, { expires, httpOnly: true }
		)
	} catch (error) {
		if((error as Error).message === "NEXT_REDIRECT") throw error
		console.error(`signin :: ${(error as Error)?.message || error}`)
		return {"error":"something went wrong, try again later."}		
	}	
	return {
		success: "Logged in successfully. you will be redirected to the dashboard.",
		userRole
	}
}

export const changePassword = async (values: z.infer<typeof updatePasswordSchema>) => {
	try {
		updatePasswordSchema.parse(values)
	} catch (error) {
		return {
			error: (error as Error).message,
		}
	}

	try {
		const session = await getSession()
		if(!session?.user_id) return {"error":errorMsgs.NotAuthenticated}

		const user = await db.query.users.findFirst({
			"where":(users,{eq})=>eq(users.id,session.user_id),
			"columns":{
				"password":true,
				"id":true
			},
		})

		if(!user || !(await argon2.verify(user.password,values.currentPassword))) return {"error":"Wrong Password"}
		await db.update(users).set({
			"password":await argon2.hash(values.newPassword)
		}).where(eq(users.id,session.user_id))

	} catch (error) {
		if((error as Error).message === "NEXT_REDIRECT") throw error
		console.error(`signin :: ${(error as Error)?.message || error}`)
		return {"error":"something went wrong, try again later."}		
	}	
	return {
		success: true,
	}
}

export const signout = async () => {
	try {
		await logout()
	} catch (error) {
		console.error(`signout :: ${(error as Error).message}`)
		if((error as Error).message === "NEXT_REDIRECT") throw error
		return {
			error: "something went wrong, try again later.",
		}
	}
	return {
		"success":true
	}
}


export async function verifyEmail(token: string) {
	const session = await getSession()
	if(!session) return {"error":errorMsgs.NotAuthenticated}

	try {

		const [user] = await db.select({"verificationTokenExpires":users.verificationTokenExpires})
			.from(users)
			.where(
				and(
					eq(users.id, session.user_id),
					eq(users.verificationToken, token),
				)
			);
	
		if (!user) return {
			"error":'Invalid verification token'
		}
	
		if (!user.verificationTokenExpires || new Date() > user.verificationTokenExpires) return {
			"error":'Verification token has expired'
		}
	
		// Update user as verified and clear token
		await db.update(users)
			.set({
				verified: true,
				verificationToken: null,
				verificationTokenExpires: null,
				updatedAt: new Date(),
			})
			.where(eq(users.id, session.user_id));


	} catch (error) {
		console.error(`signout :: ${(error as Error).message}`)
		if((error as Error).message === "NEXT_REDIRECT") throw error
		return {
			error: "something went wrong, try again later.",
		}
	}
	return {
		"success":true
	}	
}



export async function resendVerificationEmail() {
	const [storeId,session] = await Promise.all([
	  getTenantId(),
	  getSession()
	]) 
	if(!session) return {"error":errorMsgs.NotAuthenticated}

	try {
		const [emailPrefs,[user]] = await Promise.all([
			db.query.storeEmailPreferences.findFirst({
				"where":(storeEmailPreferences,{eq})=>eq(storeEmailPreferences.storeId,storeId),
				"columns":{
					"resendApiKey":true,
					"fromEmail": true,
					"replyToEmail": true,
					"emailSenderName": true,      
				}
			}),
			db.select(
				{
					"id":users.id,
					"email":users.email,
					"verified":users.verified,
					"verificationToken":users.verificationToken,
					"verificationTokenExpires":users.verificationTokenExpires,
				}
			)
			.from(users)
			.where(eq(users.id, session.user_id))
		]) 

		
		if (!user || !emailPrefs?.resendApiKey) return {success:true}
		if (user.verified) return {"error":'Email is already verified'}
		
		// Generate new token if expired or doesn't exist
		let verificationToken = user.verificationToken;
		let verificationTokenExpires = user.verificationTokenExpires;
		
		if (!verificationToken || !verificationTokenExpires || new Date() > verificationTokenExpires) {
			verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
			verificationTokenExpires = addMinutes(new Date(), 10);
			
			await db.update(users)
			.set({
				verificationToken,
				verificationTokenExpires,
				updatedAt: new Date(),
			})
			.where(eq(users.id, user.id));
		}

		const resend = new Resend(emailPrefs.resendApiKey!);
		const { data, error } = await resend.emails.send({
			from: `${emailPrefs.emailSenderName} <${emailPrefs.fromEmail}>`,
			to: [user.email],
			subject: `Verifiy your Email to keep using PrimeServe Services`,
			react: VerifyEmail({
				"verificationCode":verificationToken,
				"logoUrl":"https://primsrv.com/imgs/logo.png"
			}),
		});

		if (error) console.error(error.message)
	} catch (error) {
		console.error(`signout :: ${(error as Error).message}`)
		if((error as Error).message === "NEXT_REDIRECT") throw error
		return {
			error: "something went wrong, try again later.",
		}
	}
	return {
		"success":true
	}	
}