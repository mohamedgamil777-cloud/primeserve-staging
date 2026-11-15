// "Why PrimeServe" statement block shown right after the hero, before the six experiences.
import { getTranslations } from "next-intl/server"
import { CircleCheck } from "lucide-react"

export async function PlatformIntro({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "eePage.intro" })
  const points = [1, 2, 3]
  return (
    <section className="container mx-auto px-4 py-12 md:px-6 md:py-16">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <h2 className="text-3xl font-extrabold leading-[1.15] tracking-tight text-[#0B1F33] md:text-4xl xl:text-[44px]">
            {t("title")}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-[#344054]">{t("text")}</p>
          <p className="mt-4 text-lg font-semibold text-[#00796B]">{t("tagline")}</p>
        </div>
        <ul className="space-y-6 lg:pt-2">
          {points.map((n) => (
            <li key={n} className="flex gap-3">
              <CircleCheck className="mt-0.5 h-7 w-7 shrink-0 text-[#00796B]" strokeWidth={1.8} />
              <div>
                <h3 className="text-xl font-bold text-[#0B1F33]">{t(`p${n}t`)}</h3>
                <p className="mt-1.5 text-base leading-relaxed text-[#475467] md:text-lg">{t(`p${n}x`)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
