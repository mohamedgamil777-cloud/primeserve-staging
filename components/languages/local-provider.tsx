"use client";

import { NextIntlClientProvider } from "next-intl";
import { useEffect } from "react";

export function LocaleProvider({
	children,
	locale,
	messages,
}: {
	children: React.ReactNode;
	locale: string;
	messages: Record<string, any>;
}) {
	useEffect(() => {
		document.documentElement.lang = locale;
		document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
	}, [locale]);

	return (
		<NextIntlClientProvider locale={locale} messages={messages}>
			{children}
		</NextIntlClientProvider>
	);
}
