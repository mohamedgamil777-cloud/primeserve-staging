"use client"
// Phone-only carousel of the six Employee Experience pillars, each shown as a phone mockup.
// Swipe, arrows and dots; no autoplay, no links.
import { useEffect, useRef, useState } from "react"
import {
  Award, BarChart3, BatteryFull, Bell, BookOpen, Building2, CalendarCheck, CalendarDays, CalendarHeart, ChevronLeft, ChevronRight,
  Coins, FileText, Gift, GraduationCap, Medal, Megaphone, MessageCircleMore, Newspaper, Package, PlayCircle, Settings, Signal,
  Star, User, Users, Wifi, Wrench,
} from "lucide-react"
import { cn } from "@/lib/utils"

const icons = [User, Building2, MessageCircleMore, GraduationCap, Star, CalendarDays]
const tileIcons = [
  [CalendarCheck, CalendarDays, FileText],
  [Wrench, Settings, Package],
  [Megaphone, Newspaper, Bell],
  [PlayCircle, BookOpen, Award],
  [Coins, Medal, Gift],
  [CalendarHeart, BarChart3, Users],
]

export type PillarSlide = { img: string; title: string; text: string; tiles: string[]; tone: "teal" | "orange" }

export function PillarCarousel({ slides, prevLabel, nextLabel, slideLabel, appLabel }: {
  slides: PillarSlide[]; prevLabel: string; nextLabel: string; slideLabel: string; appLabel: string
}) {
  const track = useRef<HTMLDivElement>(null)
  const items = useRef<(HTMLDivElement | null)[]>([])
  const [active, setActive] = useState(0)

  useEffect(() => {
    const root = track.current
    if (!root) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index))
        })
      },
      { root, threshold: 0.6 },
    )
    items.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  const go = (i: number) => {
    const n = (i + slides.length) % slides.length
    const root = track.current
    const el = items.current[n]
    if (!root || !el) return
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    root.scrollTo({ left: el.offsetLeft - (root.clientWidth - el.offsetWidth) / 2, behavior: smooth ? "smooth" : "auto" })
  }

  return (
    <div className="relative -mx-4" role="region" aria-roledescription="carousel" aria-label={slideLabel}>
      <div
        ref={track}
        dir="ltr"
        className="relative flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain px-[13vw] py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((s, i) => {
          const Icon = icons[i]
          const teal = s.tone === "teal"
          return (
            <div
              key={i}
              ref={(el) => { items.current[i] = el }}
              data-index={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${slides.length}`}
              className="w-[74vw] max-w-[340px] shrink-0 snap-center px-1.5"
            >
              <div className={cn(
                "origin-center transition-[transform,opacity] duration-300 motion-reduce:transition-none",
                i === active ? "scale-100 opacity-100" : "scale-[0.9] opacity-60",
              )}>
                {/* phone frame */}
                <div className="relative overflow-hidden rounded-[2.4rem] border-[7px] border-[#1d2430] bg-white shadow-[0_18px_40px_-18px_rgba(11,31,51,0.55)]">
                  <span aria-hidden className="absolute left-1/2 top-1.5 z-10 h-[18px] w-[30%] -translate-x-1/2 rounded-full bg-[#1d2430]" />
                  <div aria-hidden className="flex items-center justify-between px-5 pb-1 pt-2 text-[11px] font-semibold text-brand-navy">
                    <span>9:41</span>
                    <span className="flex items-center gap-1"><Signal className="h-3 w-3" /><Wifi className="h-3 w-3" /><BatteryFull className="h-3.5 w-3.5" /></span>
                  </div>

                  <div dir="auto" className="relative px-3 pb-5 pt-1">
                    <div className="flex flex-col items-center">
                      <span dir="ltr" className="flex items-center gap-1.5">
                        <img src="/imgs/about/mark.png" alt="" className="h-6 w-6 object-contain" />
                        <span className="text-[15px] font-extrabold italic text-brand-navy">PrimeServe</span>
                      </span>
                      <span className="mt-0.5 text-[11px] font-semibold text-brand-navy/80">{appLabel}</span>
                    </div>

                    <img src={s.img} alt="" loading="lazy" className="mt-2.5 aspect-[16/11] w-full rounded-2xl object-cover" />

                    <div className="relative pt-9 text-center">
                      <span className={cn(
                        "absolute -top-7 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-2xl bg-white shadow-md ring-1 ring-brand-border",
                        teal ? "text-brand-teal" : "text-brand-orange",
                      )}>
                        <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl", teal ? "bg-brand-green-soft" : "bg-brand-orange-soft")}>
                          <Icon className="h-6 w-6" strokeWidth={1.8} />
                        </span>
                      </span>
                      <h3 className="text-[19px] font-extrabold leading-tight text-brand-navy">{s.title}</h3>
                      <p className="mx-auto mt-1.5 max-w-[15rem] text-[13px] leading-snug text-brand-navy-2/80">{s.text}</p>
                      <ul className="mt-4 grid grid-cols-3 gap-1.5">
                        {s.tiles.map((label, j) => {
                          const TileIcon = tileIcons[i][j]
                          return (
                            <li key={j} className={cn(
                              "flex flex-col items-center gap-1 rounded-xl px-1 py-2.5",
                              teal ? "bg-brand-green-soft/70" : "bg-brand-orange-soft/70",
                            )}>
                              <TileIcon className={cn("h-5 w-5", teal ? "text-brand-teal" : "text-brand-orange")} strokeWidth={1.8} />
                              <span className="text-[10.5px] font-semibold leading-tight text-brand-navy">{label}</span>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </div>
                  <span aria-hidden className="mx-auto mb-2 block h-1 w-1/3 rounded-full bg-brand-navy/80" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <button type="button" onClick={() => go(active - 1)} aria-label={prevLabel}
        className="absolute left-2 top-[42%] flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand-teal shadow-md ring-1 ring-brand-border">
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button type="button" onClick={() => go(active + 1)} aria-label={nextLabel}
        className="absolute right-2 top-[42%] flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand-teal shadow-md ring-1 ring-brand-border">
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="mt-1 flex justify-center gap-1.5" dir="ltr">
        {slides.map((s, i) => (
          <button key={i} type="button" onClick={() => go(i)} aria-label={s.title} aria-current={i === active}
            className="flex h-6 w-6 items-center justify-center">
            <span className={cn("block h-2.5 rounded-full transition-all", i === active ? "w-6 bg-brand-orange" : "w-2.5 bg-brand-teal/25")} />
          </button>
        ))}
      </div>
    </div>
  )
}
