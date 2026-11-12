"use server"
import fs from "fs/promises"
import sharp from "sharp"
import fsExtra from 'fs-extra';
import path from "path";

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


export async function safeUnlink(path:string) {
    try{
        await fs.unlink(path)
    }catch{
        // Do nothing this error means there is no file with that path
    }
}


// export async function saveImgFromFile(file:File,path:string,width?:number,quality:number=80) {
//     const bytes = await file.arrayBuffer()
//     const buffer = Buffer.from(bytes)
//     await saveImg(buffer,path,width,quality)
// }
