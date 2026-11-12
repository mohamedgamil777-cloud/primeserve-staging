import { hardSanitizeForDom } from "@/lib/utils";
import { z } from "zod";

export const supportedLocales = ["en", "ar"] as const;
export type SupportedLocale = (typeof supportedLocales)[number];
export type TranslatedText = Partial<Record<SupportedLocale, string>>;

/**
 * Creates a Zod schema for a translated field object with supported locales.
 * @param minLength Minimum length per locale field
 * @param fieldName Label for error messages
 */
export function createTranslatedFieldSchema(minLength: number, fieldName: string) {
  const shape = Object.fromEntries(
    supportedLocales.map((locale) => [
      locale,
      z.string().min(minLength, {
        message: `${fieldName} in ${locale.toUpperCase()} must be at least ${minLength} characters.`,
      }).optional(),
    ])
  );

  return z
    .object(shape)
    .partial()
    .refine(
      (val) => Object.values(val).some((v) => v && v.length >= minLength),
      { message: `At least one translation for ${fieldName.toLowerCase()} is required.` }
    );
}


/**
 * Creates a Zod schema for a translated field object with supported locales.
 * @param minLength Minimum length per locale field (applies only to non-empty strings)
 * @param fieldName Label for error messages
 */
export function createOptionalTranslatedFieldSchema(minLength: number, fieldName: string) {
  const shape = Object.fromEntries(
    supportedLocales.map((locale) => [
      locale,
      z.string()
        .refine((val) => val === '' || val.length >= minLength, {
          message: `${fieldName} in ${locale.toUpperCase()} must be at least ${minLength} characters or empty.`,
        })
        .optional(),
    ])
  );

  return z
    .object(shape)
    .partial()
}

export const sanitizeI18nObject = (obj:{[x: string]: string | undefined;})=>Object.entries(obj).filter(ent=>!!ent[1]).reduce((acc,cur)=>({...acc,[cur[0]]:hardSanitizeForDom(cur[1] ?? "")}),{})

export const genEmptyI18nObject:(storeLocals?:string[])=>{[x:string]:string} = (storeLocals?:string[])=>(storeLocals ?? [...supportedLocales]).reduce((acc,locale)=>({...acc,[locale]:""}),{})

export const getLocalizedValue = (
  translated?: TranslatedText | null,
  locale: SupportedLocale = "ar",
  defaultLocale: SupportedLocale = "ar"
) => {
  if (!translated) return undefined;
  
  // First try the requested locale
  if (translated[locale]) return translated[locale];
  
  // Then try the default locale
  if (translated[defaultLocale]) return translated[defaultLocale];
  
  // If neither has a value, find the first truthy value in any language
  for (const key in translated) {
    if (translated[key as SupportedLocale]) {
      return translated[key as SupportedLocale];
    }
  }
  
  return undefined;
};