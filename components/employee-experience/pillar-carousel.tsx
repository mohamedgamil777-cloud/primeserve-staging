"use client"
// Phone-only carousel of the six Employee Experience pillars, each shown as a phone mockup.
// Swipe, arrows and dots; no autoplay, no links. Slides scale and fade with the scroll position.
import { useCallback, useEffect, useRef, useState } from "react"
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

export function PillarCarousel({ slides, prevLabel, nextLabel, slideLabel }: {
  slides: PillarSlide[]; prevLabel: string; nextLabel: string; slideLabel: string
}) {
  const track = useRef<HTMLDivElement>(null)
  const items = useRef<(HTMLDivElement | null)[]>([])
  const phones = useRef<(HTMLDivElement | null)[]>([])
  const [active, setActive] = useState(0)

  // Scale, fade and lower each phone by its distance from the centre, so slides follow the finger smoothly.
  const paint = useCallback(() => {
    const root = track.current
    if (!root) return
    const mid = root.scrollLeft + root.clientWidth / 2
    let best = 0
    let bestDist = Infinity
    items.current.forEach((el, i) => {
      const phone = phones.current[i]
      if (!el || !phone) return
      const center = el.offsetLeft + el.offsetWidth / 2
      const d = Math.min(Math.abs(center - mid) / el.offsetWidth, 1)
      if (Math.abs(center - mid) < bestDist) { bestDist = Math.abs(center - mid); best = i }
      phone.style.transform = `translateY(${d * 14}px) scale(${1 - d * 0.14})`
      phone.style.opacity = String(1 - d * 0.45)
    })
    setActive(best)
  }, [])

  useEffect(() => {
    const root = track.current
    if (!root) return
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(paint)
    }
    paint()
    root.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      cancelAnimationFrame(frame)
      root.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [paint])

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
        className="relative flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain px-[19vw] pb-5 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
              aria-hidden={i !== active}
              className="w-[62vw] max-w-[270px] shrink-0 snap-center snap-always px-1"
            >
              <div ref={(el) => { phones.current[i] = el }} className="origin-center will-change-transform">
                {/* phone frame */}
                <div className="relative overflow-hidden rounded-[2.1rem] border-[6px] border-[#1d2430] bg-white shadow-[0_16px_34px_-16px_rgba(11,31,51,0.55)]">
                  <span aria-hidden className="absolute left-1/2 top-1.5 z-10 h-4 w-[30%] -translate-x-1/2 rounded-full bg-[#1d2430]" />
                  <div aria-hidden className="flex items-center justify-between px-4 pb-0.5 pt-1.5 text-[10px] font-semibold text-brand-navy">
                    <span>9:41</span>
                    <span className="flex items-center gap-0.5"><Signal className="h-2.5 w-2.5" /><Wifi className="h-2.5 w-2.5" /><BatteryFull className="h-3 w-3" /></span>
                  </div>

                  <div className="relative px-2.5 pb-4 pt-1.5">
                    <span dir="ltr" className="flex items-center gap-1.5 px-1">
                      <img src="/imgs/about/mark.png" alt="" className="h-5 w-5 object-contain" />
                      <span className="text-[13px] font-extrabold italic text-brand-navy">PrimeServe</span>
                    </span>

                    <img src={s.img} alt="" loading="lazy" className="mt-2 aspect-[4/3] w-full rounded-xl object-cover" />

                    <div dir="auto" className="relative pt-7 text-center">
                      <span className={cn(
                        "absolute -top-6 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-2xl bg-white shadow-md ring-1 ring-brand-border",
                        teal ? "text-brand-teal" : "text-brand-orange",
                      )}>
                        <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl", teal ? "bg-brand-green-soft" : "bg-brand-orange-soft")}>
                          <Icon className="h-5 w-5" strokeWidth={1.9} />
                        </span>
                      </span>
                      <h3 className="text-[17px] font-extrabold leading-tight text-brand-navy">{s.title}</h3>
                      <p className="mx-auto mt-1 max-w-[14rem] text-[12px] leading-snug text-brand-navy-2/80">{s.text}</p>
                      <ul className="mt-3 grid grid-cols-3 gap-1.5">
                        {s.tiles.map((label, j) => {
                          const TileIcon = tileIcons[i][j]
                          return (
                            <li key={j} className={cn(
                              "flex flex-col items-center gap-1 rounded-lg px-0.5 py-2",
                              teal ? "bg-brand-green-soft/70" : "bg-brand-orange-soft/70",
                            )}>
                              <TileIcon className={cn("h-4 w-4", teal ? "text-brand-teal" : "text-brand-orange")} strokeWidth={1.9} />
                              <span className="text-[9.5px] font-semibold leading-tight text-brand-navy">{label}</span>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </div>
                  <span aria-hidden className="mx-auto mb-1.5 block h-1 w-1/3 rounded-full bg-brand-navy/80" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <button type="button" onClick={() => go(active - 1)} aria-label={prevLabel}
        className="absolute left-2 top-[42%] flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-brand-teal shadow-md ring-1 ring-brand-border transition active:scale-90">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button type="button" onClick={() => go(active + 1)} aria-label={nextLabel}
        className="absolute right-2 top-[42%] flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-brand-teal shadow-md ring-1 ring-brand-border transition active:scale-90">
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="flex justify-center gap-1" dir="ltr">
        {slides.map((s, i) => (
          <button key={i} type="button" onClick={() => go(i)} aria-label={s.title} aria-current={i === active}
            className="flex h-6 w-6 items-center justify-center">
            <span className={cn("block h-2 rounded-full transition-all duration-300", i === active ? "w-6 bg-brand-orange" : "w-2 bg-brand-teal/25")} />
          </button>
        ))}
      </div>
    </div>
  )
}
