"use client"
// Page shell around the clickable phone: intro text, shortcuts to each module,
// language switch, restart, and the "Request a Demo" call to action.
import { useState } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { ArrowRight, Globe, Hand, Info, RotateCcw } from "lucide-react"
import { DemoApp, MODULES, type Screen } from "./demo-app"

export function EmployeeAppDemo({ locale }: { locale: string }) {
  const t = useTranslations("appDemo.page")
  const ta = useTranslations("appDemo.app")
  const mods = ta.raw("mods") as string[]
  const [screen, setScreen] = useState<Screen>({ name: "home" })
  const [run, setRun] = useState(0)
  const [showPreview, setShowPreview] = useState(true)

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F8FAFC] text-[#0B1F33]">
      <span aria-hidden className="pointer-events-none absolute -top-40 h-[30rem] w-[30rem] rounded-full bg-[#E8F5F3] blur-3xl ltr:-left-40 rtl:-right-40" />
      <span aria-hidden className="pointer-events-none absolute -bottom-40 h-[28rem] w-[28rem] rounded-full bg-[#FFF3EC] blur-3xl ltr:-right-32 rtl:-left-32" />

      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-4 pt-5 md:px-8">
        <Link href={`/${locale}/employee-experience`} aria-label={t("back")}>
          <img src="/imgs/logo.png" alt="PrimeServe" className="h-9 w-auto md:h-10" />
        </Link>
        <Link
          href={`/${t("langHref")}/demo`}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 text-sm font-semibold shadow-sm hover:border-[#0B1F33]"
        >
          <Globe className="h-4 w-4" />
          {t("lang")}
        </Link>
      </header>

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-14 pt-8 md:px-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16 lg:pt-10">
        <section className="space-y-6 text-center lg:text-start">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF3EC] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[#F26522]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#F26522]" />
            {t("badge")}
          </span>
          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl">
            {t("title1")} <span className="block text-[#F26522]">{t("title2")}</span>
          </h1>
          <p className="mx-auto max-w-lg text-base leading-relaxed text-[#667085] md:text-lg lg:mx-0">{t("text")}</p>
          <p className="flex items-center justify-center gap-2 text-sm font-semibold text-[#00796B] lg:justify-start">
            <Hand className="h-4 w-4" />
            {t("hint")}
          </p>

          <div className="hidden space-y-3 lg:block">
            <div className="text-xs font-bold uppercase tracking-[0.12em] text-[#667085]">{t("jump")}</div>
            <div className="grid max-w-[520px] grid-cols-2 gap-2">
              {MODULES.map((m, i) => {
                const active = screen.name === `m${i + 1}`
                return (
                  <button
                    key={i}
                    onClick={() => setScreen({ name: `m${i + 1}` as Screen["name"] })}
                    className={`flex items-center gap-3 rounded-xl border bg-white px-3 py-2.5 text-start text-sm font-semibold transition ${active ? "border-[#F26522] shadow-[0_6px_16px_-8px_rgba(242,101,34,0.6)]" : "border-[#E5E7EB] hover:border-[#0B1F33]"}`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: `${m.color}1a`, color: m.color }}>
                      <m.icon className="h-4 w-4" />
                    </span>
                    {mods[i]}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="hidden flex-wrap items-center gap-3 pt-2 lg:flex">
            <Link
              href={`/${locale}/support`}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#F26522] px-6 font-semibold text-white shadow-[0_8px_20px_-8px_rgba(242,101,34,0.7)] hover:bg-[#d9541a]"
            >
              {t("cta")}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
            <button
              onClick={() => { setScreen({ name: "home" }); setRun((r) => r + 1) }}
              className="inline-flex h-12 items-center gap-2 rounded-xl border-2 border-[#0B1F33] bg-white px-5 font-semibold hover:bg-[#0B1F33] hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
              {t("restart")}
            </button>
          </div>
          <p className="hidden text-xs text-[#98A2B3] lg:block">{t("note")}</p>
        </section>

        <div className="flex justify-center">
          <DemoApp key={`${locale}-${run}`} screen={screen} setScreen={setScreen} />
        </div>

        {/* Below the phone on small screens */}
        <section className="space-y-4 text-center lg:hidden">
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href={`/${locale}/support`} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#F26522] px-6 font-semibold text-white">
              {t("cta")}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
            <button
              onClick={() => { setScreen({ name: "home" }); setRun((r) => r + 1) }}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-[#0B1F33] bg-white px-5 font-semibold"
            >
              <RotateCcw className="h-4 w-4" />
              {t("restart")}
            </button>
          </div>
          <p className="text-xs text-[#98A2B3]">{t("note")}</p>
        </section>
      </div>
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="preview-title">
          <div className="absolute inset-0 bg-[#0B1F33]/55 backdrop-blur-[2px] animate-in fade-in" onClick={() => setShowPreview(false)} />
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-300 sm:p-8">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF3EC] text-[#F26522]"><Info className="h-7 w-7" /></span>
            <h2 id="preview-title" className="mt-4 text-2xl font-extrabold text-[#0B1F33]">{t("previewTitle")}</h2>
            <p className="mt-2 text-base leading-relaxed text-[#475467]">{t("previewText")}</p>
            <div className="mt-6 flex flex-col gap-3">
              <button onClick={() => setShowPreview(false)} className="inline-flex h-12 items-center justify-center rounded-xl bg-[#F26522] px-6 font-semibold text-white shadow-[0_8px_20px_-8px_rgba(242,101,34,0.7)] hover:bg-[#d9541a]" autoFocus>
                {t("previewStart")}
              </button>
              <Link href={`/${locale}/support`} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-[#0B1F33] px-6 font-semibold text-[#0B1F33] hover:bg-[#0B1F33] hover:text-white">
                {t("cta")}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
