"use client"
// The clickable employee app inside a phone frame. Everything runs in the browser
// with sample data: nothing is saved and no server is called.
import { useEffect, useRef, useState, type ReactNode } from "react"
import { useLocale, useTranslations } from "next-intl"
import {
  ArrowLeft, Award, BatteryFull, Bell, BookOpen, Briefcase, Building2, CalendarDays, Check, CheckCircle2, ChevronRight,
  ClipboardList, Clock, Coffee, FileText, Gift, Globe, GraduationCap, Heart, Home, Laptop, LayoutGrid, Lightbulb,
  MapPin, Megaphone, MessageCircle, Newspaper, Package, PartyPopper, Pin, PlayCircle, QrCode, Rocket, Signal,
  Sparkles, Star, Trophy, User, Users, Wifi, Wrench, X, type LucideIcon,
} from "lucide-react"

export const MODULES: { icon: LucideIcon; color: string }[] = [
  { icon: Briefcase, color: "#00796B" },
  { icon: Building2, color: "#F26522" },
  { icon: Megaphone, color: "#2563EB" },
  { icon: GraduationCap, color: "#0B6E69" },
  { icon: Trophy, color: "#E89B0C" },
  { icon: PartyPopper, color: "#0B1F33" },
]
const NAVY = "#0B1F33"
const ORANGE = "#F26522"
const WP_ICONS = [Wrench, Laptop, Package, Sparkles, Users, Coffee]
const BADGE_ICONS = [Users, Lightbulb, Rocket]
const REWARD_ICONS = [Coffee, Gift, CalendarDays]

type ModName = "m1" | "m2" | "m3" | "m4" | "m5" | "m6"
export type Screen = { name: "home" | "services" | "profile" | ModName; course?: number }
type Req = { id: number; title: string; date: string; status: string }
type Sheet =
  | { kind: "leave" }
  | { kind: "letter" }
  | { kind: "wp"; cat: number }
  | { kind: "kudos" }
  | null

const now = () => new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })

export function DemoApp({ screen, setScreen }: { screen: Screen; setScreen: (s: Screen) => void }) {
  const locale = useLocale()
  const t = useTranslations("appDemo.app")
  const raw = <T,>(k: string) => t.raw(k) as T
  const mods = raw<string[]>("mods")
  const today = new Date().toLocaleDateString(locale === "ar" ? "ar-EG" : "en-GB", { day: "numeric", month: "short" })

  // App state (lives only in this browser tab)
  const [att, setAtt] = useState<{ in?: string; out?: string }>({})
  const [hrReqs, setHrReqs] = useState<Req[]>(() => raw<Omit<Req, "id">[]>("hr.seed").map((r, i) => ({ ...r, id: -1 - i })))
  const [wpReqs, setWpReqs] = useState<Req[]>(() => raw<Omit<Req, "id">[]>("wp.seed").map((r, i) => ({ ...r, id: -10 - i })))
  const [leaveLeft, setLeaveLeft] = useState(14)
  const [liked, setLiked] = useState<Set<number>>(new Set())
  const [feedFilter, setFeedFilter] = useState(0)
  const [progress, setProgress] = useState<number[]>(() => raw<{ progress: number }[]>("learn.courses").map((c) => c.progress))
  const [points, setPoints] = useState(1250)
  const [wall, setWall] = useState<{ from: string; to: string; badge: number }[]>(() => raw("rewards.seedWall"))
  const [rsvp, setRsvp] = useState<Set<number>>(new Set())
  const [vote, setVote] = useState<number | null>(null)
  const [sheet, setSheet] = useState<Sheet>(null)
  const [toast, setToast] = useState<{ text: string; icon?: LucideIcon } | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const nextId = useRef(1)

  useEffect(() => { scroller.current?.scrollTo({ top: 0 }) }, [screen.name, screen.course])
  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current) }, [])

  const notify = (text: string, icon?: LucideIcon) => {
    setToast({ text, icon })
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2600)
  }

  // A request moves to its next status a few seconds after it is sent, so the app feels alive.
  const addRequest = (list: "hr" | "wp", title: string, first: string, then: string) => {
    const id = nextId.current++
    const set = list === "hr" ? setHrReqs : setWpReqs
    set((r) => [{ id, title, date: today, status: first }, ...r])
    notify(t("toastSent"), CheckCircle2)
    setTimeout(() => {
      set((r) => r.map((x) => (x.id === id ? { ...x, status: then } : x)))
      notify(`${title} · ${t(`status.${then}`)}`, Bell)
    }, 4500)
  }

  const go = (name: Screen["name"], course?: number) => setScreen({ name, course })
  const activeTab = screen.name === "m3" ? "feed" : screen.name === "m5" ? "rewards" : screen.name.startsWith("m") ? "services" : screen.name

  // ---------- screens ----------
  const renderScreen = () => {
    switch (screen.name) {
      case "home": return <HomeView />
      case "services": return <ServicesView />
      case "profile": return <ProfileView />
      case "m1": return <HrView />
      case "m2": return <WorkplaceView />
      case "m3": return <FeedView />
      case "m4": return screen.course != null ? <CourseView i={screen.course} /> : <LearningView />
      case "m5": return <RewardsView />
      case "m6": return <EventsView />
    }
  }

  function AttendanceCard() {
    return (
      <Card className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#E8F5F3] text-[#00796B]"><Clock className="h-5 w-5" /></span>
        <div className="min-w-0 flex-1 leading-tight">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-[#667085]">{t("today")} · {today}</div>
          <div className="mt-0.5 truncate text-[13px] font-bold">
            {att.out ? t("outAt", { time: att.out }) : att.in ? t("inAt", { time: att.in }) : t("notIn")}
          </div>
        </div>
        {!att.out && (
          <button
            onClick={() => {
              if (!att.in) { setAtt({ in: now() }); notify(t("inAt", { time: now() }), CheckCircle2) }
              else { setAtt({ ...att, out: now() }); notify(t("done"), CheckCircle2) }
            }}
            className="shrink-0 rounded-xl px-3 py-2 text-[12px] font-bold text-white"
            style={{ background: att.in ? NAVY : "#00796B" }}
          >
            {att.in ? t("checkOut") : t("checkIn")}
          </button>
        )}
      </Card>
    )
  }

  function HomeView() {
    const post = raw<{ author: string; text: string; time: string }[]>("feed.posts")[0]
    const ev = raw<{ day: string; mon: string; title: string; place: string }[]>("events.list")[0]
    return (
      <>
        <div className="relative px-5 pb-16 pt-3 text-white" style={{ background: `linear-gradient(160deg, ${NAVY} 0%, #12385C 100%)` }}>
          <span aria-hidden className="pointer-events-none absolute -top-10 h-40 w-40 rounded-full bg-[#F26522]/25 blur-2xl ltr:-right-10 rtl:-left-10" />
          <div className="relative flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white p-1"><img src="/imgs/about/mark.png" alt="" className="h-full w-full object-contain" /></span>
              <span className="text-[15px] font-bold">{t("company")}</span>
            </span>
            <button onClick={() => go("m3")} className="relative" aria-label="notifications">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-0.5 h-2 w-2 rounded-full bg-[#F26522] ltr:-right-0.5 rtl:-left-0.5" />
            </button>
          </div>
          <button onClick={() => go("profile")} className="relative mt-5 flex items-center gap-3 text-start">
            <Avatar name={t("name")} size={48} light />
            <span className="leading-tight">
              <span className="block text-[13px] text-white/75">{t("greeting")}</span>
              <span className="block text-[19px] font-bold">{t("name")}</span>
            </span>
            <span className="ms-auto" />
          </button>
          <div className="relative mt-4 flex gap-2">
            <Pill icon={Star}>{points.toLocaleString("en")} {t("points")}</Pill>
            <Pill icon={CalendarDays}>{t("hr.daysLeft", { n: leaveLeft })}</Pill>
          </div>
        </div>

        <div className="relative -mt-11 space-y-4 px-4 pb-5">
          <AttendanceCard />

          <div>
            <SectionTitle>{t("yourApps")}</SectionTitle>
            <div className="grid grid-cols-3 gap-2.5">
              {MODULES.map((m, i) => (
                <button key={i} onClick={() => go(`m${i + 1}` as ModName)} className="flex flex-col items-center gap-1.5 rounded-2xl bg-white px-1 py-3 shadow-[0_2px_10px_rgba(11,31,51,0.07)] transition active:scale-95">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${m.color}17`, color: m.color }}><m.icon className="h-5 w-5" /></span>
                  <span className="text-[11px] font-semibold leading-tight">{raw<string[]>("modsShort")[i]}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <SectionTitle action={<LinkBtn onClick={() => go("m3")}>{t("seeAll")}</LinkBtn>}>{t("latest")}</SectionTitle>
            <button onClick={() => go("m3")} className="w-full text-start">
              <Card>
                <div className="flex items-center gap-2 text-[12px] font-bold text-[#2563EB]"><Megaphone className="h-4 w-4" />{post.author}<span className="ms-auto font-medium text-[#98A2B3]">{post.time}</span></div>
                <p className="mt-1.5 line-clamp-2 text-[13px] leading-snug text-[#344054]">{post.text}</p>
              </Card>
            </button>
          </div>

          <div>
            <SectionTitle action={<LinkBtn onClick={() => go("m6")}>{t("seeAll")}</LinkBtn>}>{t("upcoming")}</SectionTitle>
            <button onClick={() => go("m6")} className="w-full text-start">
              <Card className="flex items-center gap-3">
                <DateTile day={ev.day} mon={ev.mon} />
                <div className="min-w-0 flex-1 leading-tight">
                  <div className="truncate text-[14px] font-bold">{ev.title}</div>
                  <div className="mt-1 truncate text-[12px] text-[#667085]">{ev.place}</div>
                </div>
                <ChevronRight className="h-4 w-4 text-[#98A2B3] rtl:rotate-180" />
              </Card>
            </button>
          </div>
        </div>
      </>
    )
  }

  function ServicesView() {
    return (
      <>
        <TopBar title={t("allServices")} />
        <div className="space-y-2.5 p-4">
          <p className="px-1 pb-1 text-[13px] text-[#667085]">{t("allServicesText")}</p>
          {MODULES.map((m, i) => (
            <button key={i} onClick={() => go(`m${i + 1}` as ModName)} className="w-full text-start">
              <Card className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ background: `${m.color}17`, color: m.color }}><m.icon className="h-5 w-5" /></span>
                <span className="flex-1 text-[14px] font-bold">{mods[i]}</span>
                <ChevronRight className="h-4 w-4 text-[#98A2B3] rtl:rotate-180" />
              </Card>
            </button>
          ))}
        </div>
      </>
    )
  }

  function HrView() {
    const c = MODULES[0].color
    return (
      <>
        <TopBar title={mods[0]} color={c} onBack={() => go("home")} />
        <div className="space-y-4 p-4">
          <AttendanceCard />
          <Card>
            <div className="text-[13px] font-bold">{t("hr.leaveBalance")}</div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              {[{ l: t("hr.annual"), v: leaveLeft, max: 21, col: c }, { l: t("hr.sick"), v: 5, max: 7, col: ORANGE }, { l: t("hr.remote"), v: 6, max: 8, col: "#2563EB" }].map((b, i) => (
                <div key={i} className="rounded-xl bg-[#F8FAFC] px-1 py-2.5">
                  <Ring value={b.v / b.max} color={b.col} label={String(b.v)} />
                  <div className="mt-1 text-[11px] font-semibold text-[#667085]">{b.l}</div>
                </div>
              ))}
            </div>
          </Card>
          <div className="grid grid-cols-2 gap-2.5">
            <ActionTile icon={CalendarDays} color={c} label={t("hr.requestLeave")} onClick={() => setSheet({ kind: "leave" })} />
            <ActionTile icon={FileText} color={ORANGE} label={t("hr.hrLetter")} onClick={() => setSheet({ kind: "letter" })} />
          </div>
          <div>
            <SectionTitle>{t("hr.myRequests")}</SectionTitle>
            <RequestList items={hrReqs} icon={ClipboardList} color={c} />
          </div>
        </div>
      </>
    )
  }

  function WorkplaceView() {
    const c = MODULES[1].color
    return (
      <>
        <TopBar title={mods[1]} color={c} onBack={() => go("home")} />
        <div className="space-y-4 p-4">
          <div className="relative overflow-hidden rounded-2xl p-4 text-white" style={{ background: `linear-gradient(135deg, ${NAVY}, #1E4A6E)` }}>
            <span aria-hidden className="absolute -bottom-8 h-28 w-28 rounded-full bg-[#F26522]/40 blur-xl ltr:-right-6 rtl:-left-6" />
            <div className="relative flex items-start justify-between">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-white/70">{t("wp.card")}</div>
                <div className="mt-1 text-[16px] font-bold">{t("name")}</div>
                <div className="text-[12px] text-white/70">{t("empId")} · PS-20418</div>
              </div>
              <span className="rounded-lg bg-white p-1.5 text-[#0B1F33]"><QrCode className="h-10 w-10" /></span>
            </div>
            <div className="relative mt-3 text-[11px] text-white/70">{t("wp.cardText")}</div>
          </div>
          <div>
            <SectionTitle>{t("wp.newRequest")}</SectionTitle>
            <div className="grid grid-cols-3 gap-2.5">
              {raw<string[]>("wp.cats").map((cat, i) => {
                const Icon = WP_ICONS[i]
                return (
                  <button key={i} onClick={() => setSheet({ kind: "wp", cat: i })} className="flex flex-col items-center gap-1.5 rounded-2xl bg-white px-1 py-3 shadow-[0_2px_10px_rgba(11,31,51,0.07)] active:scale-95">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF3EC] text-[#F26522]"><Icon className="h-5 w-5" /></span>
                    <span className="text-[11px] font-semibold leading-tight">{cat}</span>
                  </button>
                )
              })}
            </div>
          </div>
          <div>
            <SectionTitle>{t("wp.track")}</SectionTitle>
            <RequestList items={wpReqs} icon={Wrench} color={c} steps />
          </div>
        </div>
      </>
    )
  }

  function FeedView() {
    const c = MODULES[2].color
    const posts = raw<{ author: string; kind: number; time: string; text: string; likes: number; comments: number }[]>("feed.posts")
    const shown = posts.map((p, i) => ({ ...p, i })).filter((p) => feedFilter === 0 || p.kind === feedFilter)
    return (
      <>
        <TopBar title={mods[2]} color={c} onBack={() => go("home")} />
        <div className="space-y-3 p-4">
          <div className="flex gap-2">
            {raw<string[]>("feed.filters").map((f, i) => (
              <button key={i} onClick={() => setFeedFilter(i)} className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold ${feedFilter === i ? "text-white" : "bg-white text-[#344054] ring-1 ring-[#E5E7EB]"}`} style={feedFilter === i ? { background: c } : undefined}>{f}</button>
            ))}
          </div>
          {shown.map((p) => {
            const on = liked.has(p.i)
            return (
              <Card key={p.i}>
                <div className="flex items-center gap-2.5">
                  {p.kind === 1
                    ? <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF2FF] text-[#2563EB]"><Megaphone className="h-4 w-4" /></span>
                    : <Avatar name={p.author} size={36} />}
                  <div className="leading-tight">
                    <div className="text-[13px] font-bold">{p.author}</div>
                    <div className="text-[11px] text-[#98A2B3]">{p.time}</div>
                  </div>
                  {p.i === 0 && <span className="ms-auto flex items-center gap-1 rounded-full bg-[#FFF3EC] px-2 py-0.5 text-[10px] font-bold text-[#F26522]"><Pin className="h-3 w-3" />{t("feed.pinned")}</span>}
                </div>
                <p className="mt-2.5 text-[13px] leading-relaxed text-[#344054]">{p.text}</p>
                <div className="mt-3 flex items-center gap-4 border-t border-[#F2F4F7] pt-2.5 text-[12px] font-semibold text-[#667085]">
                  <button
                    onClick={() => setLiked((s) => { const n = new Set(s); if (on) n.delete(p.i); else n.add(p.i); return n })}
                    className={`flex items-center gap-1.5 transition ${on ? "text-[#E11D48]" : ""}`}
                  >
                    <Heart className={`h-4 w-4 transition ${on ? "scale-110 fill-current" : ""}`} />
                    {p.likes + (on ? 1 : 0)}
                  </button>
                  <span className="flex items-center gap-1.5"><MessageCircle className="h-4 w-4" />{t("feed.comments", { n: p.comments })}</span>
                </div>
              </Card>
            )
          })}
        </div>
      </>
    )
  }

  function LearningView() {
    const c = MODULES[3].color
    const courses = raw<{ title: string; cat: string; lessons: number }[]>("learn.courses")
    const done = progress.filter((p) => p >= 100).length
    return (
      <>
        <TopBar title={mods[3]} color={c} onBack={() => go("home")} />
        <div className="space-y-4 p-4">
          <div className="grid grid-cols-3 gap-2">
            {[{ v: progress.filter((p) => p > 0 && p < 100).length, l: t("learn.inProgress") }, { v: 5 + done, l: t("learn.completed") }, { v: 18 + done * 2, l: t("learn.hours") }].map((s, i) => (
              <Card key={i} className="!p-3 text-center">
                <div className="text-[20px] font-extrabold" style={{ color: c }}>{s.v}</div>
                <div className="text-[11px] font-semibold leading-tight text-[#667085]">{s.l}</div>
              </Card>
            ))}
          </div>
          <div>
            <SectionTitle>{t("learn.myCourses")}</SectionTitle>
            <div className="space-y-2.5">
              {courses.map((co, i) => (
                <button key={i} onClick={() => go("m4", i)} className="w-full text-start">
                  <Card className="flex items-center gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ background: `${c}17`, color: c }}>
                      {progress[i] >= 100 ? <Award className="h-6 w-6" /> : <BookOpen className="h-6 w-6" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-semibold text-[#667085]">{co.cat} · {t("learn.lessons", { n: co.lessons })}</div>
                      <div className="truncate text-[14px] font-bold">{co.title}</div>
                      <Bar value={progress[i]} color={progress[i] >= 100 ? "#00796B" : c} />
                    </div>
                    <span className="text-[12px] font-bold" style={{ color: c }}>{progress[i]}%</span>
                  </Card>
                </button>
              ))}
            </div>
          </div>
        </div>
      </>
    )
  }

  function CourseView({ i }: { i: number }) {
    const c = MODULES[3].color
    const co = raw<{ title: string; cat: string; lessons: number }[]>("learn.courses")[i]
    const p = progress[i]
    const doneLessons = Math.round((p / 100) * co.lessons)
    const advance = () => {
      const np = Math.min(100, p + 100 / co.lessons)
      setProgress((arr) => arr.map((v, j) => (j === i ? np : v)))
      if (np >= 100) { setPoints((x) => x + 100); notify(`${t("learn.finished")} ${t("learn.earned", { n: 100 })}`, Award) }
    }
    return (
      <>
        <TopBar title={co.title} color={c} onBack={() => go("m4")} />
        <div className="space-y-4 p-4">
          <div className="flex h-36 items-center justify-center rounded-2xl text-white" style={{ background: `linear-gradient(135deg, ${c}, ${NAVY})` }}>
            {p >= 100 ? <Award className="h-14 w-14" /> : <PlayCircle className="h-14 w-14 opacity-90" />}
          </div>
          <div>
            <div className="text-[12px] font-semibold text-[#667085]">{co.cat}</div>
            <div className="text-[18px] font-extrabold">{co.title}</div>
            <Bar value={p} color={p >= 100 ? "#00796B" : c} />
          </div>
          <Card className="!p-0">
            {Array.from({ length: co.lessons }, (_, k) => {
              const ok = k < doneLessons
              const current = k === doneLessons
              return (
                <div key={k} className="flex items-center gap-3 border-b border-[#F2F4F7] px-4 py-3 last:border-0">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-bold ${ok ? "bg-[#00796B] text-white" : current ? "text-white" : "bg-[#F2F4F7] text-[#98A2B3]"}`} style={current && !ok ? { background: c } : undefined}>
                    {ok ? <Check className="h-4 w-4" /> : k + 1}
                  </span>
                  <span className={`text-[13px] font-semibold ${ok || current ? "" : "text-[#98A2B3]"}`}>{t("learn.lesson", { n: k + 1 })}</span>
                </div>
              )
            })}
          </Card>
          {p >= 100 ? (
            <div className="flex items-center gap-3 rounded-2xl bg-[#E8F5F3] p-4 text-[#00796B]">
              <Award className="h-8 w-8 shrink-0" />
              <div className="leading-tight"><div className="font-bold">{t("learn.finished")}</div><div className="text-[12px]">{t("learn.earned", { n: 100 })}</div></div>
            </div>
          ) : (
            <PrimaryBtn color={c} onClick={advance}>{p > 0 ? t("learn.continue") : t("learn.start")}</PrimaryBtn>
          )}
        </div>
      </>
    )
  }

  function RewardsView() {
    const c = MODULES[4].color
    const items = raw<{ title: string; pts: number }[]>("rewards.items")
    const badges = raw<string[]>("rewards.badges")
    return (
      <>
        <TopBar title={mods[4]} color={c} onBack={() => go("home")} />
        <div className="space-y-4 p-4">
          <div className="relative overflow-hidden rounded-2xl p-4 text-white" style={{ background: `linear-gradient(135deg, ${ORANGE}, #E89B0C)` }}>
            <Trophy aria-hidden className="absolute -bottom-3 h-24 w-24 opacity-20 ltr:-right-2 rtl:-left-2" />
            <div className="text-[12px] font-semibold text-white/85">{t("rewards.balance")}</div>
            <div className="text-[30px] font-extrabold leading-tight">{points.toLocaleString("en")}</div>
            <button onClick={() => setSheet({ kind: "kudos" })} className="relative mt-2 inline-flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-[12px] font-bold" style={{ color: ORANGE }}>
              <Heart className="h-4 w-4" />{t("rewards.send")}
            </button>
          </div>
          <div>
            <SectionTitle>{t("rewards.wall")}</SectionTitle>
            <div className="space-y-2">
              {wall.map((w, i) => {
                const BI = BADGE_ICONS[w.badge]
                return (
                  <Card key={i} className="flex items-center gap-3 !py-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FEF3C7] text-[#B45309]"><BI className="h-4 w-4" /></span>
                    <div className="min-w-0 leading-tight">
                      <div className="truncate text-[13px] font-bold">{t("rewards.gave", { from: w.from, to: w.to })}</div>
                      <div className="text-[11px] font-semibold text-[#B45309]">{badges[w.badge]}</div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
          <div>
            <SectionTitle>{t("rewards.catalog")}</SectionTitle>
            <div className="space-y-2">
              {items.map((it, i) => {
                const RI = REWARD_ICONS[i]
                const ok = points >= it.pts
                return (
                  <Card key={i} className="flex items-center gap-3 !py-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF3EC] text-[#F26522]"><RI className="h-5 w-5" /></span>
                    <div className="flex-1 leading-tight">
                      <div className="text-[13px] font-bold">{it.title}</div>
                      <div className="text-[11px] font-semibold text-[#667085]">{it.pts.toLocaleString("en")} {t("points")}</div>
                    </div>
                    <button
                      onClick={() => {
                        if (!ok) return notify(t("rewards.notEnough"), Star)
                        setPoints((p) => p - it.pts)
                        notify(t("rewards.redeemed"), Gift)
                      }}
                      className={`rounded-lg px-3 py-1.5 text-[12px] font-bold ${ok ? "text-white" : "bg-[#F2F4F7] text-[#98A2B3]"}`}
                      style={ok ? { background: ORANGE } : undefined}
                    >
                      {t("rewards.redeem")}
                    </button>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </>
    )
  }

  function EventsView() {
    const c = MODULES[5].color
    const list = raw<{ day: string; mon: string; title: string; place: string; count: number }[]>("events.list")
    const opts = raw<string[]>("events.pollOpts")
    const base = raw<number[]>("events.pollBase")
    const counts = base.map((b, i) => b + (vote === i ? 1 : 0))
    const total = counts.reduce((a, b) => a + b, 0)
    return (
      <>
        <TopBar title={mods[5]} color={c} onBack={() => go("home")} />
        <div className="space-y-4 p-4">
          <div className="space-y-2.5">
            {list.map((e, i) => {
              const going = rsvp.has(i)
              return (
                <Card key={i} className="flex items-center gap-3">
                  <DateTile day={e.day} mon={e.mon} />
                  <div className="min-w-0 flex-1 leading-tight">
                    <div className="truncate text-[14px] font-bold">{e.title}</div>
                    <div className="mt-1 flex items-center gap-1 truncate text-[11px] text-[#667085]"><MapPin className="h-3 w-3 shrink-0" />{e.place}</div>
                    <div className="mt-1 text-[11px] font-semibold text-[#00796B]">{t("events.attending", { n: e.count + (going ? 1 : 0) })}</div>
                  </div>
                  <button
                    onClick={() => setRsvp((s) => { const n = new Set(s); if (going) n.delete(i); else { n.add(i); notify(`${e.title} · ${t("events.going")}`, PartyPopper) } return n })}
                    className={`flex shrink-0 items-center gap-1 rounded-lg px-3 py-1.5 text-[12px] font-bold ${going ? "bg-[#E8F5F3] text-[#00796B]" : "text-white"}`}
                    style={going ? undefined : { background: ORANGE }}
                  >
                    {going && <Check className="h-3.5 w-3.5" />}
                    {going ? t("events.going") : t("events.join")}
                  </button>
                </Card>
              )
            })}
          </div>
          <Card>
            <div className="text-[11px] font-bold uppercase tracking-wide text-[#F26522]">{t("events.poll")}</div>
            <div className="mt-1 text-[14px] font-bold">{t("events.pollQ")}</div>
            <div className="mt-3 space-y-2">
              {opts.map((o, i) => {
                const pct = Math.round((counts[i] / total) * 100)
                return (
                  <button
                    key={i}
                    disabled={vote !== null}
                    onClick={() => { setVote(i); notify(t("events.thanks"), CheckCircle2) }}
                    className={`relative w-full overflow-hidden rounded-xl border px-3 py-2.5 text-start text-[13px] font-semibold ${vote === i ? "border-[#F26522]" : "border-[#E5E7EB]"}`}
                  >
                    {vote !== null && <span className="absolute inset-y-0 bg-[#FFF3EC] transition-all duration-700 ltr:left-0 rtl:right-0" style={{ width: `${pct}%` }} />}
                    <span className="relative flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5">{vote === i && <CheckCircle2 className="h-4 w-4 text-[#F26522]" />}{o}</span>
                      {vote !== null && <span className="text-[#667085]">{pct}%</span>}
                    </span>
                  </button>
                )
              })}
            </div>
            {vote !== null && <div className="mt-2 text-[11px] text-[#98A2B3]">{t("events.votes", { n: total })}</div>}
          </Card>
        </div>
      </>
    )
  }

  function ProfileView() {
    const rows = [
      { icon: Briefcase, l: t("profile.dept"), v: t("role") },
      { icon: User, l: t("profile.manager"), v: t("profile.managerName") },
      { icon: CalendarDays, l: t("profile.joined"), v: t("profile.joinedVal") },
      { icon: Globe, l: t("profile.language"), v: locale === "ar" ? "العربية" : "English" },
      { icon: Bell, l: t("profile.notifications"), v: t("profile.on") },
    ]
    return (
      <>
        <div className="px-5 pb-6 pt-4 text-center text-white" style={{ background: `linear-gradient(160deg, ${NAVY}, #12385C)` }}>
          <div className="flex justify-center"><Avatar name={t("name")} size={72} light /></div>
          <div className="mt-3 text-[18px] font-bold">{t("name")}</div>
          <div className="text-[12px] text-white/70">{t("role")} · {t("empId")} PS-20418</div>
          <div className="mt-3 flex justify-center gap-2">
            <Pill icon={Star}>{points.toLocaleString("en")} {t("points")}</Pill>
            <Pill icon={GraduationCap}>{5 + progress.filter((p) => p >= 100).length}</Pill>
          </div>
        </div>
        <div className="space-y-4 p-4">
          <Card className="!p-0">
            {rows.map((r, i) => (
              <div key={i} className="flex items-center gap-3 border-b border-[#F2F4F7] px-4 py-3 last:border-0">
                <r.icon className="h-4 w-4 text-[#667085]" />
                <span className="flex-1 text-[13px] text-[#667085]">{r.l}</span>
                <span className="text-[13px] font-semibold">{r.v}</span>
              </div>
            ))}
          </Card>
          <div className="flex gap-2.5 rounded-2xl bg-[#FFF3EC] p-3.5 text-[12px] leading-relaxed text-[#9A3412]">
            <Sparkles className="h-4 w-4 shrink-0" />{t("profile.note")}
          </div>
        </div>
      </>
    )
  }

  // ---------- sheets (forms that slide up from the bottom) ----------
  function SheetView() {
    const [a, setA] = useState(0)
    const [b, setB] = useState(0)
    if (!sheet) return null
    let title = ""
    let body: ReactNode = null
    let action = t("submit")
    let color = ORANGE
    let onSubmit = () => {}
    if (sheet.kind === "leave") {
      const types = raw<string[]>("hr.leaveTypes"), durs = raw<string[]>("hr.durations")
      title = t("hr.requestLeave"); color = MODULES[0].color
      body = <><Choice label={t("hr.leaveType")} options={types} value={a} onChange={setA} color={color} /><Choice label={t("hr.duration")} options={durs} value={b} onChange={setB} color={color} /></>
      onSubmit = () => {
        if (a === 0) setLeaveLeft((n) => Math.max(0, n - [1, 2, 5][b]))
        addRequest("hr", `${types[a]} · ${durs[b]}`, "pending", "approved")
      }
    } else if (sheet.kind === "letter") {
      const letters = raw<string[]>("hr.letters"), del = raw<string[]>("hr.deliveries")
      title = t("hr.hrLetter"); color = MODULES[0].color
      body = <><Choice label={t("hr.letterType")} options={letters} value={a} onChange={setA} color={color} /><Choice label={t("hr.delivery")} options={del} value={b} onChange={setB} color={color} /></>
      onSubmit = () => addRequest("hr", letters[a], "pending", "ready")
    } else if (sheet.kind === "wp") {
      const cat = raw<string[]>("wp.cats")[sheet.cat], items = raw<string[][]>("wp.items")[sheet.cat], urg = raw<string[]>("wp.urgencies")
      title = cat
      body = <><Choice label={t("wp.what")} options={items} value={a} onChange={setA} color={color} /><Choice label={t("wp.urgency")} options={urg} value={b} onChange={setB} color={color} /></>
      onSubmit = () => addRequest("wp", `${cat} · ${items[a]}`, "received", "progress")
    } else if (sheet.kind === "kudos") {
      const people = raw<string[]>("rewards.people"), badges = raw<string[]>("rewards.badges")
      title = t("rewards.send"); action = t("rewards.sendBtn")
      body = (
        <>
          <div>
            <div className="mb-2 text-[12px] font-bold text-[#667085]">{t("rewards.who")}</div>
            <div className="flex justify-between gap-2">
              {people.map((p, i) => (
                <button key={i} onClick={() => setA(i)} className={`flex flex-1 flex-col items-center gap-1.5 rounded-xl border-2 p-2 ${a === i ? "border-[#F26522] bg-[#FFF3EC]" : "border-transparent"}`}>
                  <Avatar name={p} size={44} />
                  <span className="text-center text-[11px] font-semibold leading-tight">{p}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2 text-[12px] font-bold text-[#667085]">{t("rewards.badge")}</div>
            <div className="grid grid-cols-3 gap-2">
              {badges.map((bd, i) => {
                const BI = BADGE_ICONS[i]
                return (
                  <button key={i} onClick={() => setB(i)} className={`flex flex-col items-center gap-1 rounded-xl border-2 px-1 py-2.5 text-[11px] font-semibold ${b === i ? "border-[#E89B0C] bg-[#FEF3C7]" : "border-[#E5E7EB]"}`}>
                    <BI className="h-5 w-5 text-[#B45309]" />{bd}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )
      onSubmit = () => {
        setWall((w) => [{ from: t("name"), to: people[a], badge: b }, ...w])
        notify(t("rewards.sent", { name: people[a] }), Heart)
      }
    }
    return (
      <div className="absolute inset-0 z-40 flex flex-col justify-end">
        <button aria-label={t("cancel")} className="absolute inset-0 bg-[#0B1F33]/45 animate-in fade-in" onClick={() => setSheet(null)} />
        <div className="relative space-y-4 rounded-t-[28px] bg-white px-5 pb-6 pt-3 shadow-2xl animate-in slide-in-from-bottom duration-300">
          <div className="mx-auto h-1.5 w-10 rounded-full bg-[#E5E7EB]" />
          <div className="flex items-center justify-between">
            <div className="text-[17px] font-extrabold">{title}</div>
            <button onClick={() => setSheet(null)} className="rounded-full bg-[#F2F4F7] p-1.5"><X className="h-4 w-4" /></button>
          </div>
          {body}
          <PrimaryBtn color={color} onClick={() => { onSubmit(); setSheet(null) }}>{action}</PrimaryBtn>
        </div>
      </div>
    )
  }

  const tabs = [
    { key: "home", icon: Home, go: () => go("home") },
    { key: "services", icon: LayoutGrid, go: () => go("services") },
    { key: "feed", icon: Newspaper, go: () => go("m3") },
    { key: "rewards", icon: Star, go: () => go("m5") },
    { key: "profile", icon: User, go: () => go("profile") },
  ]
  const lightStatus = screen.name === "home" || screen.name === "profile" || screen.name.startsWith("m")

  return (
    <div className="w-[min(100%,380px)] shrink-0">
      <div className="relative h-[760px] max-h-[calc(100dvh-24px)] min-h-[620px] rounded-[52px] bg-[#0F172A] p-[11px] shadow-[0_40px_80px_-30px_rgba(11,31,51,0.55)] ring-1 ring-black/10">
        <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[42px] bg-[#F4F6F9] text-[#0B1F33]" dir={locale === "ar" ? "rtl" : "ltr"}>
          {/* status bar */}
          <div
            className={`relative z-30 flex h-11 shrink-0 items-center justify-between px-7 text-[13px] font-semibold ${lightStatus ? "text-white" : "text-[#0B1F33]"}`}
            style={{ background: screen.name === "home" || screen.name === "profile" ? NAVY : screen.name.startsWith("m") ? MODULES[Number(screen.name[1]) - 1].color : "#F4F6F9" }}
            dir="ltr"
          >
            <span>9:41</span>
            <span className="absolute left-1/2 top-2 h-[26px] w-[100px] -translate-x-1/2 rounded-full bg-[#0F172A]" />
            <span className="flex items-center gap-1"><Signal className="h-3.5 w-3.5" /><Wifi className="h-3.5 w-3.5" /><BatteryFull className="h-4 w-4" /></span>
          </div>

          <div ref={scroller} className="flex-1 overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {renderScreen()}
          </div>

          {/* bottom tab bar */}
          <nav className="grid shrink-0 grid-cols-5 border-t border-[#E5E7EB] bg-white px-1 pb-5 pt-2">
            {tabs.map((tb) => {
              const on = activeTab === tb.key
              return (
                <button key={tb.key} onClick={tb.go} className="flex flex-col items-center gap-0.5 text-[10px] font-semibold" style={{ color: on ? ORANGE : "#98A2B3" }}>
                  <tb.icon className="h-5 w-5" strokeWidth={on ? 2.4 : 2} />
                  {t(`tabs.${tb.key}`)}
                </button>
              )
            })}
          </nav>
          <span className="pointer-events-none absolute bottom-1.5 left-1/2 h-1 w-28 -translate-x-1/2 rounded-full bg-[#0B1F33]" />

          <SheetView />

          {toast && (
            <div className="pointer-events-none absolute inset-x-3 top-12 z-50 flex items-center gap-2.5 rounded-2xl bg-[#0B1F33] px-4 py-3 text-[12px] font-semibold text-white shadow-xl animate-in fade-in slide-in-from-top-2">
              {toast.icon && <toast.icon className="h-4 w-4 shrink-0 text-[#F26522]" />}
              <span className="leading-snug">{toast.text}</span>
            </div>
          )}

          <span className="pointer-events-none absolute top-[52px] z-20 rounded-full bg-[#F26522] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white ltr:right-4 rtl:left-4">{t("demo")}</span>
        </div>
      </div>
    </div>
  )
}

// ---------- small building blocks ----------
function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl bg-white p-4 shadow-[0_2px_10px_rgba(11,31,51,0.07)] ${className}`}>{children}</div>
}

function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return <div className="mb-2 flex items-center justify-between px-1"><h3 className="text-[14px] font-extrabold">{children}</h3>{action}</div>
}

function LinkBtn({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return <button onClick={onClick} className="text-[12px] font-bold text-[#F26522]">{children}</button>
}

function TopBar({ title, color = "#F4F6F9", onBack }: { title: string; color?: string; onBack?: () => void }) {
  const light = color !== "#F4F6F9"
  return (
    <div className={`sticky top-0 z-10 flex items-center gap-2.5 px-4 pb-4 pt-1 ${light ? "text-white" : ""}`} style={{ background: color }}>
      {onBack && <button onClick={onBack} aria-label="back" className="-ms-1 rounded-full p-1 hover:bg-white/15"><ArrowLeft className="h-5 w-5 rtl:rotate-180" /></button>}
      <h2 className="truncate text-[18px] font-extrabold">{title}</h2>
    </div>
  )
}

function Pill({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return <span className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1 text-[11px] font-semibold ring-1 ring-white/20"><Icon className="h-3.5 w-3.5 text-[#F26522]" />{children}</span>
}

function Avatar({ name, size, light }: { name: string; size: number; light?: boolean }) {
  const palette = ["#00796B", "#F26522", "#2563EB", "#0B6E69", "#E89B0C"]
  const c = palette[[...name].reduce((a, ch) => a + ch.charCodeAt(0), 0) % palette.length]
  const initials = name.split(" ").map((w) => [...w][0]).slice(0, 2).join("")
  return (
    <span className="flex shrink-0 items-center justify-center rounded-full font-bold" style={{ width: size, height: size, fontSize: size * 0.36, background: light ? "#fff" : `${c}1f`, color: light ? NAVY : c }}>
      {initials}
    </span>
  )
}

function DateTile({ day, mon }: { day: string; mon: string }) {
  return (
    <span className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-[#FFF3EC] leading-none text-[#F26522]">
      <span className="text-[17px] font-extrabold">{day}</span>
      <span className="mt-0.5 text-[9px] font-bold uppercase">{mon}</span>
    </span>
  )
}

function Bar({ value, color }: { value: number; color: string }) {
  return <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#EEF2F6]"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${value}%`, background: color }} /></div>
}

function Ring({ value, color, label }: { value: number; color: string; label: string }) {
  const r = 20, c = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 48 48" className="mx-auto h-12 w-12 -rotate-90">
      <circle cx="24" cy="24" r={r} fill="none" stroke="#E5E7EB" strokeWidth="4" />
      <circle cx="24" cy="24" r={r} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - value)} className="transition-all duration-500" />
      <text x="24" y="24" textAnchor="middle" dominantBaseline="central" transform="rotate(90 24 24)" className="fill-[#0B1F33] text-[13px] font-extrabold">{label}</text>
    </svg>
  )
}

function ActionTile({ icon: Icon, color, label, onClick }: { icon: LucideIcon; color: string; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2.5 rounded-2xl bg-white p-3.5 text-start shadow-[0_2px_10px_rgba(11,31,51,0.07)] active:scale-95">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white" style={{ background: color }}><Icon className="h-4.5 w-4.5" /></span>
      <span className="text-[13px] font-bold leading-tight">{label}</span>
    </button>
  )
}

function PrimaryBtn({ children, color, onClick }: { children: ReactNode; color: string; onClick: () => void }) {
  return <button onClick={onClick} className="h-12 w-full rounded-xl text-[14px] font-bold text-white shadow-sm active:scale-[0.98]" style={{ background: color }}>{children}</button>
}

function Choice({ label, options, value, onChange, color }: { label: string; options: string[]; value: number; onChange: (i: number) => void; color: string }) {
  return (
    <div>
      <div className="mb-2 text-[12px] font-bold text-[#667085]">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((o, i) => (
          <button key={i} onClick={() => onChange(i)} className={`rounded-xl border px-3 py-2 text-[12px] font-semibold ${value === i ? "text-white" : "border-[#E5E7EB] bg-white"}`} style={value === i ? { background: color, borderColor: color } : undefined}>{o}</button>
        ))}
      </div>
    </div>
  )
}

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-[#FFF3EC] text-[#C2410C]",
  received: "bg-[#EAF2FF] text-[#1D4ED8]",
  progress: "bg-[#FFF3EC] text-[#C2410C]",
  approved: "bg-[#E8F5F3] text-[#00796B]",
  ready: "bg-[#E8F5F3] text-[#00796B]",
  done: "bg-[#E8F5F3] text-[#00796B]",
}

function RequestList({ items, icon: Icon, color, steps }: { items: Req[]; icon: LucideIcon; color: string; steps?: boolean }) {
  const t = useTranslations("appDemo.app")
  const order = ["received", "progress", "done"]
  return (
    <div className="space-y-2">
      {items.map((r) => (
        <Card key={r.id} className="!py-3 animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ background: `${color}17`, color }}><Icon className="h-4 w-4" /></span>
            <div className="min-w-0 flex-1 leading-tight">
              <div className="truncate text-[13px] font-bold">{r.title}</div>
              <div className="text-[11px] text-[#98A2B3]">{r.date}</div>
            </div>
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${STATUS_STYLE[r.status]}`}>{t(`status.${r.status}`)}</span>
          </div>
          {steps && (
            <div className="mt-2.5 flex gap-1.5">
              {order.map((s, i) => <span key={s} className="h-1.5 flex-1 rounded-full transition-colors duration-500" style={{ background: i <= order.indexOf(r.status) ? color : "#EEF2F6" }} />)}
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}
