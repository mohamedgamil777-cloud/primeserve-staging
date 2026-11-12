import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDate } from "./date"
import { Stream } from "stream"


export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}


/**
 * removes invalid chars instead of encoding them
 */
export function hardSanitizeForDom(text:string){
    const map = {
        '&': '',
        '<': '',
        '>': '',
        '"': '',
        "'": '',
        "$": '',
        // "/": ''
    };
    const reg = /[$&<>"']/ig;
    return String(text).replace(reg, (match)=>(map[match as keyof typeof map]));
}
/**
 * removes invalid chars instead of encoding them
 */
export function hardSanitizeIfExistsForDom(text:string|null|undefined){
    if(!text) return
    const map = {
        '&': '',
        '<': '',
        '>': '',
        '"': '',
        "'": '',
        "$": '',
        // "/": ''
    };
    const reg = /[$&<>"']/ig;
    return String(text).replace(reg, (match)=>(map[match as keyof typeof map]));
}
export function sanitizeUrl(text:string){
    const map = {
        '{': '',
        '}': '',
        '<': '',
        '>': '',
        '"': '',
        "'": '',
        "$": '',
    };
    const reg = /[}{$<>"']/ig;
    return String(text).replace(reg, (match)=>(map[match as keyof typeof map]));
}


export interface IPoint{
    lat:number,
    lng:number
}


export function leftPadDatePart(part:number){
  const p = "" + part
  return p.length < 2 ? "0" + p : p
}




export type MultiLangString = {
    "arabic_text": string,
    "english_text": string
}



export function hashString(str:string){
    let hash = 0;
    if (str.length == 0) return hash;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash<<5)-hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

/**
 * comapcts long numbers using scientific notation
 */
export function compactNumber(num:number,fractionDigits:number=2):string{
    return num > 1_000_000 ? `${(num / 1_000_000).toFixed(fractionDigits)}M` : num > 1_000 ? `${(num / 1_000).toFixed(fractionDigits)}K` : String(num)
}

export function genSlug(text:string){
    return hardSanitizeForDom(text).trim().replaceAll("  "," ").replaceAll(" ","-")
}

export function uniqueMergeArrays<T>(arr1:T[],arr2:T[]){
    return Array.from(new Set([...arr1,...arr2]))
}


export function dateDiffInDays(a:Date, b:Date) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }


export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    // Convert degrees to radians
    const toRadians = (degree: number) => (degree * Math.PI) / 180;

    const earthRadiusKm = 6371; // Radius of the Earth in kilometers

    const dLat = toRadians(lat2 - lat1); // Delta latitude
    const dLon = toRadians(lon2 - lon1); // Delta longitude

    // Convert latitudes to radians
    const radLat1 = toRadians(lat1);
    const radLat2 = toRadians(lat2);

    // Haversine formula
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(radLat1) * Math.cos(radLat2) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distanceKm = earthRadiusKm * c; // Distance in kilometers
    return distanceKm * 1000; // Convert to meters
}


export function genId(length:number=6) {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    let counter = 0
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
      counter += 1
    }
    return result
}

export const getLocalDate = (date:Date,local:Intl.LocalesArgument)=> new Date(date).toLocaleString(local,{weekday: 'long',year: 'numeric',month: 'short',day: 'numeric',})
export const getLocalArabicDate = (date:Date)=> new Date(date).toLocaleString('ar-EG',{weekday: 'long',year: 'numeric',month: 'short',day: 'numeric',})
export const getFullLocalArabicDate = (date:Date)=> new Date(date).toLocaleString('ar-EG',{weekday: 'long',year: 'numeric',month: 'short',day: 'numeric',hour12:true,hour:"2-digit","minute":"2-digit","second":"2-digit"})


const
    persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
    hinduNumbers  = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];


export function toArabicNumber(str:string){
    if(typeof str === 'string')
    {
        for(var i=0; i<10; i++)
        {
            str = str.replace(persianNumbers[i], String(i)).replace(hinduNumbers[i], String(i));
        }
    }
    return str;
};



export function generateDateRange(startDate?: Date, endDate?: Date): string[] {
    if(!startDate) return []
    const dateStrings: string[] = [];
    const currentDate = new Date(startDate);

    if(!endDate) return [formatDate(currentDate)]
    if(formatDate(startDate) === formatDate(endDate)) return [formatDate(startDate)]
    const _endDate = new Date(endDate)
    while (currentDate <= _endDate) {
        dateStrings.push(formatDate(currentDate)); // Format as YYYY-MM-DD
        currentDate.setDate(currentDate.getDate() + 1); // Increment day
    }

    return dateStrings;
}


export const badgeColors = {"تخطيط":"bg-blue-500","ميكانيكا":"bg-pink-700","الهندسي":"bg-green-500"}
export const getOfficeBadgeColor = (officeTitle:string) => (badgeColors[officeTitle as keyof typeof badgeColors] ?? "bg-yellow-600")



export async function stream2buffer(stream: Stream): Promise<Buffer> {

    return new Promise < Buffer > ((resolve, reject) => {
        
        const _buf = Array < any > ();

        stream.on("data", chunk => _buf.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(_buf)));
        stream.on("error", err => reject(`error converting stream - ${err}`));

    });
} 





export function range(start: number, end: number): number[] {
    const result: number[] = [];
    for (let i = start; i <= end; i++) {
        result.push(i);
    }
  
    return result;
}


export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
        return text;
    }
    return `${text.slice(0, maxLength)}...`;
}




export const getRandomDate = (nDaysFromNow:number=7)=> Date.now() - Math.floor(Math.random() * nDaysFromNow * 24 * 60 * 60 * 1000)
export const getDatesArray = (nDaysFromNow:number=7)=> range(0,nDaysFromNow).map(day=>new Date(Date.now() - Math.floor(Math.random() * day * 24 * 60 * 60 * 1000)))

export const generateRandomId = () =>
    Math.random().toString(36).substr(2, 9) + Date.now().toString(36);

export const generateRandomCode = () =>
    `RGI-EG-${Math.floor(Math.random()*10000)}`;

export const generateRandomNumber = (min:number=500,upTo:number=15000) => Math.max(parseInt((Math.random() * upTo).toFixed(2)),min);

export const getRandomElement = <T>(arr: T[]): T =>
    arr[Math.floor(Math.random() * arr.length)];

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));



const badgeStyles = [
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
    "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
    "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
    "bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300",
    "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300"
];

const scopedColorMaps = new Map<string, Map<string, string>>();

export const getBadgeStyle = (scope: string, key: string | undefined): string => {
    if (!key) return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";

    if (!scopedColorMaps.has(scope)) {
        scopedColorMaps.set(scope, new Map());
    }
    
    const colorMap = scopedColorMaps.get(scope)!;
    
    if (!colorMap.has(key)) {
        const assignedIndex = colorMap.size % badgeStyles.length;
        colorMap.set(key, badgeStyles[assignedIndex]);
    }

    return colorMap.get(key)!;
};


export function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
    
        reader.onload = (e) => {
            if (e.target?.result) {
                resolve(e.target.result as string)
            } else {
                reject(new Error("Failed to read file."))
            }
        }
  
        reader.onerror = () => {
            reject(new Error("FileReader error occurred."))
        }
  
        reader.readAsDataURL(file)
    })
}


export type SearchParamsFrom<T> = {
    [K in keyof T]?: string | string[]
}


export function slugify(text: string): string {
    return text
        .normalize("NFD") // normalize diacritics
        .replace(/[\u0300-\u036f]/g, "") // remove Latin accents
        .replace(/[^a-zA-Z0-9\u0600-\u06FF]+/g, "-") // allow Arabic + alphanum, replace others with "-"
        .replace(/^-+|-+$/g, "") // trim leading/trailing dashes
        .replace(/--+/g, "-") // collapse multiple dashes
        .toLowerCase();
}
