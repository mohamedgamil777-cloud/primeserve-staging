"use server"
import fs from "fs/promises"
import sharp from "sharp"
import fsExtra from 'fs-extra';
import path from "path";
import { and, eq } from "drizzle-orm";

// On Vercel the file system is read-only, so uploaded images go into the database instead.
const useDbStorage = () => !!process.env.VERCEL || process.env.IMAGE_STORAGE === "db"

async function getImageStore() {
    const { db } = await import("@/db")
    const { uploadedImages } = await import("@/db/schema/uploadedImages")
    return { db, uploadedImages }
}

export async function saveImg(buffer:Buffer,width:number,path:string) {
    try{
        await fs.unlink(path)
    }catch{
        // Do nothing this error means there is no file with that path
    }
    const dir = path.split("/").slice(0,-1).join("/")
    await fsExtra.ensureDir(dir)
    await sharp(buffer,{"failOnError":false,"failOn":"none"})
        .resize({width})
        .webp({"quality":100})
        .toFile(path)
}

export async function safeSaveImg(buffer:Buffer,width:number,dir:string,fileName:string) {
    if (useDbStorage()) {
        const data = await sharp(buffer,{"failOnError":false,"failOn":"none"})
            .resize({width})
            .webp({"quality":100})
            .toBuffer()
        const section = path.basename(dir)
        const { db, uploadedImages } = await getImageStore()
        await db.insert(uploadedImages)
            .values({ section, name: fileName, data })
            .onConflictDoUpdate({ target: [uploadedImages.section, uploadedImages.name], set: { data } })
        return
    }
    try{
        await fs.unlink(path.join(dir,fileName))
    }catch{
        // Do nothing this error means there is no file with that path
    }
    await fsExtra.ensureDir(dir)
    await sharp(buffer,{"failOnError":false,"failOn":"none"})
        .resize({width})
        .webp({"quality":100})
        .toFile(path.join(dir,fileName))
}

export async function saveImgFromFile(width:number,dir:string,fileName:string,file?:File) {
    try {
        if(!file) return undefined
        const buffer = Buffer.from(await file.arrayBuffer());
        await safeSaveImg(buffer,width,dir,fileName)
        return fileName      
    } catch (error) {
        console.error(error)
        return undefined
    }
}


export async function saveFile(file:Buffer|File,path:string) {
    await fs.writeFile(path,file as unknown as string)
}


export async function safeUnlink(filePath:string) {
    if (useDbStorage()) {
        try {
            const { db, uploadedImages } = await getImageStore()
            await db.delete(uploadedImages).where(and(
                eq(uploadedImages.section, path.basename(path.dirname(filePath))),
                eq(uploadedImages.name, path.basename(filePath)),
            ))
        } catch {
            // Ignore: the image may only exist as a bundled file
        }
        return
    }
    try{
        await fs.unlink(filePath)
    }catch{
        // Do nothing this error means there is no file with that path
    }
}


// export async function saveImgFromFile(file:File,path:string,width?:number,quality:number=80) {
//     const bytes = await file.arrayBuffer()
//     const buffer = Buffer.from(bytes)
//     await saveImg(buffer,path,width,quality)
// }
