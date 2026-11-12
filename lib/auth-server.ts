"use server"
import { UserRole } from "@/db/schema/users";
// import env from "@/env";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const SESSION_LIFE_TIME = 1000 * 60 * 60 * 24
//Don't use env as it will cause an error use process.env instead
const key = new TextEncoder().encode(process.env.JWT_SECRET_KEY);


export type DecryptedJWT = {
    "user_id":string,
    "user_role":UserRole,
    "stores":string[],
    "expires": Date,
}

  

export async function encrypt(payload: DecryptedJWT) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1 day from now")
        .sign(key);
}

export async function decrypt(input: string): Promise<DecryptedJWT|undefined> {
    try {
        const { payload } = await jwtVerify(input, key, {
            algorithms: ["HS256"],
        });        
        return payload as DecryptedJWT;
    } catch (error) {
        console.error(error)
        return
    }
}

export async function generateSession(sessionData: Omit<DecryptedJWT,"expires">) {
    // Create the session
    const expires = new Date(Date.now() + SESSION_LIFE_TIME);
    const session = await encrypt({ ...sessionData, expires });
    return {session,expires}
}


export async function logout() {
    // Destroy the session
    (await cookies()).set("session", "", { expires: new Date(0) });
}

export async function getSession() {
    const session = (await cookies()).get("session")?.value;
    if (!session) return null;
    const parsed =  await decrypt(session);
    if(!parsed) return null
    if(new Date(parsed.expires).getTime() <= new Date().getTime()) return null
    return parsed
}

export async function updateSession(request: NextRequest) {
    const session = request.cookies.get("session")?.value;
    if (!session) return;

    // Refresh the session so it doesn't expire
    const parsed = await decrypt(session);
    const res = NextResponse.next();
    if(parsed?.expires && new Date(parsed?.expires).getTime() > new Date().getTime()){
        parsed.expires = new Date(Date.now() + SESSION_LIFE_TIME);
        res.cookies.set({
            name: "session",
            value: await encrypt(parsed),
            httpOnly: true,
            expires: parsed.expires,
        });
    }else{
        res.cookies.set({
            name: "session",
            value: "",
            httpOnly: true,
            expires: new Date(0),
        });
    }
    return res;
}