"use client";

import { useRouter, usePathname } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useLocale, useTranslations } from "next-intl";

export default function LanguageSwitcher() {
	const router = useRouter();
	const pathname = usePathname();
    const locale = useLocale()

	const changeLanguage = (locale: string) => {
		const newPath = `/${locale}${pathname.replace(/^\/(en|ar)/, "")}`;
		router.push(newPath);
	};
    const t = useTranslations();

	return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className=" w-full h-full">
                    {
                        locale === "ar"
                        ?
                        `${t("arabic")}`
                        :
                        `${t("english")}`
                    }
                </button>
                {/* <Button variant="outline" size="icon">
                <span className="sr-only">{t("ui.toggleLanguage")}</span>
                </Button> */}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild className="w-full h-full">
                    <button onClick={() => changeLanguage("en")}>English</button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="w-full h-full">
                    <button onClick={() => changeLanguage("ar")}>العربية</button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
	);
}
