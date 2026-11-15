"use client"
// Phone-only carousel of the six Employee Experience pillars: swipe, arrows and dots, no autoplay, no links.
import { useEffect, useRef, useState } from "react"
import { Building2, CalendarDays, ChevronLeft, ChevronRight, GraduationCap, MessageCircleMore, Star, User } from "lucide-react"
import { cn } from "@/lib/utils"

const icons = [User, Building2, MessageCircleMore, GraduationCap, Star, CalendarDays]

export type PillarSlide = { img: string; title: string; text: string; bullets: string[]; tone: "teal" | "orange" }

export function PillarCarousel({ slides, prevLabel, nextLabel, slideLabel }: { slides: PillarSlide[]; prevLabel: string; nextLabel: string; slideLabel: string }) {
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
    root.scrollTo({ left: el.offsetLeft - root.offsetLeft, behavior: smooth ? "smooth" : "auto" })
  }

  return (
    <div className="relative" role="region" aria-roledescription="carousel" aria-label={slideLabel}>
      <div
        ref={track}
        dir="ltr"
        className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((s, i) => {
          const Icon = icons[i]
          return (
            <div
              key={i}
              ref={(el) => { items.current[i] = el }}
              data-index={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${slides.length}`}
              className="w-full shrink-0 snap-center px-1 py-2"
            >
              <div dir="auto" className="overflow-hidden rounded-3xl border border-brand-border bg-white shadow-[0_10px_30px_-16px_rgba(11,31,51,0.35)]">
                <img src={s.img} alt="" loading="lazy" className="aspect-[16/10] w-full object-cover" />
                <div className="relative px-5 pb-6 pt-10 text-center">
                  <span className={cn(
                    "absolute -top-8 left-1/2 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-2xl shadow-md ring-4 ring-white",
                    s.tone === "teal" ? "bg-brand-green-soft text-brand-teal" : "bg-brand-orange-soft text-brand-orange",
                  )}>
                    <Icon className="h-8 w-8" strokeWidth={1.7} />
                  </span>
                  <h3 className="text-2xl font-extrabold text-brand-navy">{s.title}</h3>
                  <p className="mx-auto mt-2 max-w-xs text-[15px] leading-relaxed text-brand-navy-2/85">{s.text}</p>
                  <ul className="mt-5 grid grid-cols-3 gap-2">
                    {s.bullets.map((b, j) => (
                      <li key={j} className={cn(
                        "flex items-center justify-center rounded-xl px-1.5 py-2.5 text-[12px] font-semibold leading-tight",
                        s.tone === "teal" ? "bg-brand-green-soft text-brand-navy" : "bg-brand-orange-soft text-brand-navy",
                      )}>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <button type="button" onClick={() => go(active - 1)} aria-label={prevLabel}
        className="absolute left-0 top-[24%] flex h-11 w-11 -translate-x-1 items-center justify-center rounded-full bg-white text-brand-teal shadow-md ring-1 ring-brand-border">
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button type="button" onClick={() => go(active + 1)} aria-label={nextLabel}
        className="absolute right-0 top-[24%] flex h-11 w-11 translate-x-1 items-center justify-center rounded-full bg-white text-brand-teal shadow-md ring-1 ring-brand-border">
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="mt-3 flex justify-center gap-1.5" dir="ltr">
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
