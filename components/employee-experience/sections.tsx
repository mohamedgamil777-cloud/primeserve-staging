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

export function PillarCard({ index, icon, title, text, bullets, tone, image }: { index: number; icon: LucideIcon; title: string; text: string; bullets: string[]; tone?: Tone; image?: string }) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white shadow-[0_4px_20px_-8px_rgba(11,31,51,0.12)] transition-all hover:-translate-y-1 hover:border-[#00796B]/30 hover:shadow-[0_16px_36px_-14px_rgba(11,31,51,0.28)]">
      {image && (
        <div className="relative bg-gradient-to-br from-[#EEF2F6] via-[#F8FAFC] to-[#E8F5F3] px-5 pt-5 sm:px-6 sm:pt-6">
          <div className="overflow-hidden rounded-t-2xl border-x-[6px] border-t-[6px] border-[#0B1F33] bg-white shadow-[0_10px_30px_-12px_rgba(11,31,51,0.45)]">
            <img
              src={image}
              alt={title}
              loading="lazy"
              className="aspect-[16/8] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
        </div>
      )}
      <div className="relative flex-1 p-6 sm:p-7">
        <span className="absolute top-5 text-5xl font-black text-[#EEF2F6] ltr:right-6 rtl:left-6" dir="ltr">0{index}</span>
        <IconBadge icon={icon} tone={tone} className="relative" />
        <h3 className="relative mt-5 text-xl font-bold text-[#0B1F33]">{title}</h3>
        <p className="relative mt-2 text-[#667085]">{text}</p>
        <ul className="relative mt-5 space-y-2.5 border-t border-[#EEF2F6] pt-5">
          {bullets.map((b, i) => <CheckItem key={i}>{b}</CheckItem>)}
        </ul>
      </div>
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
