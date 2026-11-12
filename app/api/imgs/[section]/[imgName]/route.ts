import path from "path";
import fs from "fs/promises"
import { notFound } from "next/navigation";
import { NextRequest } from "next/server";


// To handle a GET request to /api
export async function GET(request:NextRequest,context: { params: Promise<{ section: string; imgName: string }> }) {
    const {section,imgName:imagePath} = await context.params
    const supportedSections = ["categories","products","team","services","users","stores"]
    try {
        try {       
            if(!supportedSections.includes(section)) throw Error(`unknown section ${section}`)     
            const filePath = path.resolve(".", `public/imgs/${section}/${imagePath}`)
            const imageBuffer = await fs.readFile(filePath);
            return new Response(imageBuffer, { headers: { 'content-type': 'image/webp' } });
        } catch (error) {
            console.log(error)
            const filePath = path.resolve(".", "public/placeholder.png");
            const imageBuffer = await fs.readFile(filePath);
            return new Response(imageBuffer, { headers: { 'content-type': 'image/svg' } });
        }
    } catch (error) {
        notFound()
    }
}