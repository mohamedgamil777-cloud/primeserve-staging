// Reusable building blocks for the Employee Experience page.
import React from "react"
import type { LucideIcon } from "lucide-react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export function Eyebrow({ children, center }: { children: React.ReactNode; center?: boolean }) {
  return (
    <div className={cn("flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-[#F26522] sm:text-sm", center && "justify-center")}>
      {center && <span className="h-px w-8 bg-[#F26522]" />}
      {children}
    </div>
  )
}

export function SectionHeading({ eyebrow, title, text, center, className }: { eyebrow?: string; title: string; text?: string; center?: boolean; className?: string }) {
  return (
    <div className={cn("space-y-3", center && "mx-auto max-w-3xl text-center", className)}>
      {eyebrow && <Eyebrow center={center}>{eyebrow}</Eyebrow>}
      <h2 className="text-3xl font-extrabold tracking-tight text-[#0B1F33] sm:text-4xl">{title}</h2>
      {text && <p className="text-base text-[#667085] sm:text-lg">{text}</p>}
    </div>
  )
}

const tones = {
  teal: "bg-[#E8F5F3] text-[#00796B]",
  orange: "bg-[#FFF3EC] text-[#F26522]",
  blue: "bg-[#EAF2FF] text-[#2563EB]",
  navy: "bg-[#EEF2F6] text-[#0B1F33]",
}
export type Tone = keyof typeof tones

export function IconBadge({ icon: Icon, tone = "teal", className }: { icon: LucideIcon; tone?: Tone; className?: string }) {
  return (
    <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl", tones[tone], className)}>
      <Icon className="h-6 w-6" />
    </span>
  )
}

export function FeatureCard({ icon, title, text, tone }: { icon: LucideIcon; title: string; text: string; tone?: Tone }) {
  return (
    <div className="h-full rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-[0_4px_20px_-8px_rgba(11,31,51,0.12)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_30px_-12px_rgba(11,31,51,0.25)]">
      <IconBadge icon={icon} tone={tone} />
      <h3 className="mt-5 text-lg font-bold text-[#0B1F33]">{title}</h3>
      <p className="mt-2 text-[#667085]">{text}</p>
    </div>
  )
}


export function PillarCard({ icon: Icon, title, text, bullets, accent = "teal", image }: { icon: LucideIcon; title: string; text: string; bullets: string[]; accent?: "teal" | "gold"; image?: string }) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-[#E8ECEA] bg-[#F8FAF9] shadow-[0_2px_14px_-8px_rgba(20,43,74,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_-16px_rgba(20,43,74,0.26)] sm:flex-row">
      <div className="relative z-10 flex-1 p-6 sm:p-7 lg:py-8">
        <div className="flex items-start gap-4">
          <span className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#E9F0EC]", accent === "gold" ? "text-[#C18A45]" : "text-[#087F78]")}>
            <Icon className="h-7 w-7" strokeWidth={1.75} />
          </span>
          <div className="min-w-0">
            <h3 className="text-xl font-bold leading-tight text-[#142B4A] sm:text-2xl">{title}</h3>
            <p className="mt-1.5 text-[15px] leading-relaxed text-[#142B4A]/70">{text}</p>
          </div>
        </div>
        <ul className="mt-6 space-y-3 border-t border-[#E8ECEA] pt-5">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-3 text-[15px] text-[#142B4A]">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E9F0EC] text-[#087F78]">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              {b}
            </li>
          ))}
        </ul>
      </div>
      {image && (
        <div className="relative flex shrink-0 items-end justify-center px-6 pb-0 sm:w-[44%] sm:px-0 sm:pt-4">
          <span aria-hidden className="absolute bottom-0 h-3/4 w-3/4 rounded-full bg-[#E9F0EC]/60 blur-2xl" />
          <img
            src={image}
            alt=""
            loading="lazy"
            className="relative w-full max-w-[300px] object-contain transition-transform duration-500 [mask-composite:intersect] group-hover:-translate-y-1 sm:max-w-none [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_88%,transparent),linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] sm:[mask-image:linear-gradient(to_bottom,transparent,black_10%,black_88%,transparent),linear-gradient(to_right,transparent,black_14%)] sm:rtl:[mask-image:linear-gradient(to_bottom,transparent,black_10%,black_88%,transparent),linear-gradient(to_left,transparent,black_14%)]"
          />
        </div>
      )}
    </div>
  )
}

export function CheckItem({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <li className={cn("flex items-start gap-2.5 text-sm sm:text-base", light ? "text-white/90" : "text-[#0B1F33]")}>
      <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full", light ? "bg-white/15 text-white" : "bg-[#E8F5F3] text-[#00796B]")}>
        <Check className="h-3 w-3" strokeWidth={3} />
      </span>
      {children}
    </li>
  )
}

// Bold banner that announces the six app experiences, with one chip per experience.
export function SixExperiencesBanner({ eyebrow, titleA, titleB, text, items, compact }: { eyebrow: string; titleA: string; titleB: string; text: string; items: { icon: LucideIcon; label: string }[]; compact?: boolean }) {
  return (
    <div className={cn("relative overflow-hidden rounded-3xl bg-brand-navy text-white shadow-[0_24px_60px_-28px_rgba(11,31,51,0.6)]", compact ? "p-5" : "p-8 md:p-12")}>
      <span aria-hidden className="pointer-events-none absolute -end-16 -top-16 h-56 w-56 rounded-full bg-brand-teal/35" />
      <span aria-hidden className="pointer-events-none absolute -bottom-20 -start-10 h-48 w-48 rounded-full bg-brand-orange/20" />
      <div className={cn("relative", !compact && "text-center")}>
        <div className={cn("flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-orange sm:text-sm", !compact && "justify-center")}>
          <span className="h-0.5 w-8 bg-brand-orange" />{eyebrow}
        </div>
        <h2 className={cn("mt-3 font-extrabold leading-[1.1] tracking-tight", compact ? "text-[1.7rem]" : "text-4xl md:text-5xl lg:text-6xl")}>
          {titleA} <span className="text-brand-orange">{titleB}</span>
        </h2>
        <p className={cn("mt-3 text-white/80", compact ? "text-sm" : "mx-auto max-w-2xl text-lg")}>{text}</p>
      </div>
      <ul className={cn("relative grid", compact ? "mt-5 grid-cols-2 gap-2.5" : "mt-10 grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6")}>
        {items.map((it, i) => (
          <li key={i} className={cn("flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.07]", compact ? "p-2.5" : "flex-col p-4 text-center lg:gap-3")}>
            <span className={cn("flex shrink-0 items-center justify-center rounded-xl", i % 2 ? "bg-brand-orange text-white" : "bg-brand-teal text-white", compact ? "h-9 w-9" : "h-12 w-12")}>
              <it.icon className={compact ? "h-5 w-5" : "h-6 w-6"} strokeWidth={1.8} />
            </span>
            <span className={cn("font-semibold leading-tight", compact ? "text-[13px]" : "text-sm md:text-base")}>{it.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
