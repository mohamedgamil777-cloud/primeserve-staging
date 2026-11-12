import { SupportedLocale, supportedLocales } from "@/types/internationalization"
import { useLocale as _useLocale } from "next-intl"

export function useLocale():SupportedLocale{
    //TODO: test against store supported locales instead of global locales
    const locale = _useLocale() as SupportedLocale
    return supportedLocales.includes(locale) ? locale : supportedLocales[0]
}