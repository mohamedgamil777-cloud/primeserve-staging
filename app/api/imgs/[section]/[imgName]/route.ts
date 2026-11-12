import path from "path";
import fs from "fs/promises"
import { notFound } from "next/navigation";
import { NextRequest } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { uploadedImages } from "@/db/schema/uploadedImages";

const supportedSections = ["categories","products","team","services","users","stores","serviceCategories"]

// Images uploaded on Vercel live in the database (see lib/utils-server.ts).
async function readFromDb(section: string, name: string) {
    try {
        const [img] = await db.select({ data: uploadedImages.data, contentType: uploadedImages.contentType })
            .from(uploadedImages)
            .where(and(eq(uploadedImages.section, section), eq(uploadedImages.name, name)))
        return img
    } catch (error) {
        console.log(error)
        return undefined
    }
}

// To handle a GET request to /api
export async function GET(request:NextRequest,context: { params: Promise<{ section: string; imgName: string }> }) {
    const {section,imgName:imagePath} = await context.params
    try {
        try {
            if(!supportedSections.includes(section)) throw Error(`unknown section ${section}`)
            const filePath = path.resolve(".", `public/imgs/${section}/${path.basename(imagePath)}`)
            const imageBuffer = await fs.readFile(filePath);
            return new Response(imageBuffer, { headers: { 'content-type': 'image/webp' } });
        } catch (error) {
            if (supportedSections.includes(section)) {
                const img = await readFromDb(section, path.basename(imagePath))
                if (img) {
                    return new Response(new Uint8Array(img.data), {
                        headers: { 'content-type': img.contentType, 'cache-control': 'public, max-age=31536000, immutable' },
                    });
                }
            }
            console.log(error)
            const filePath = path.resolve(".", "public/placeholder.png");
            const imageBuffer = await fs.readFile(filePath);
            return new Response(imageBuffer, { headers: { 'content-type': 'image/png' } });
        }
    } catch (error) {
        notFound()
    }
}
