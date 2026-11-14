"use client"
// Phone mockups built from real UI, not images. All sizes inside a phone use cqw
// (percent of the phone's width), so a phone looks the same at any size.
import React from "react"
import { useLocale, useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import {
  ArrowLeft, Bell, BookOpen, CalendarDays, Check, ClipboardList, Clock, Grid2x2, Home,
  LayoutGrid, MessageSquare, Signal, Star, User, Wifi, BatteryFull,
} from "lucide-react"

export const EE_TEAL = "#0B6E69"

type PhoneFrameProps = { className?: string; children: React.ReactNode; lightStatus?: boolean }

export function PhoneFrame({ className, children, lightStatus = true }: PhoneFrameProps) {
  const dir = useLocale() === "ar" ? "rtl" : "ltr"
  return (
    <div className={cn("@container", className)}>
      <div className="relative aspect-[9/17.5] w-full rounded-[14cqw] bg-[#0F172A] p-[2.8cqw] shadow-[0_30px_60px_-20px_rgba(11,31,51,0.45)] ring-1 ring-black/10">
        <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[11.5cqw] bg-[#F8FAFC]" dir={dir}>
          <div className="absolute left-1/2 top-[2.4cqw] z-30 h-[6.5cqw] w-[30cqw] -translate-x-1/2 rounded-full bg-[#0F172A]" />
          <div className={cn("absolute inset-x-0 top-0 z-20 flex items-center justify-between px-[8cqw] pt-[3.4cqw] text-[length:3.6cqw] font-semibold", lightStatus ? "text-white" : "text-[#0B1F33]")} dir="ltr">
            <span>9:41</span>
            <span className="flex items-center gap-[1cqw]">
              <Signal className="h-[3.6cqw] w-[3.6cqw]" />
              <Wifi className="h-[3.6cqw] w-[3.6cqw]" />
              <BatteryFull className="h-[4.2cqw] w-[4.2cqw]" />
            </span>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

function ScreenHeader({ title, color }: { title: string; color: string }) {
  return (
    <div className="px-[6cqw] pb-[5cqw] pt-[13cqw] text-white" style={{ background: `linear-gradient(160deg, ${color}, ${color}d9)` }}>
      <div className="flex items-center gap-[2.5cqw] text-[length:5.4cqw] font-bold">
        <ArrowLeft className="h-[5cqw] w-[5cqw] rtl:rotate-180" />
        {title}
      </div>
    </div>
  )
}

function BottomNav({ color }: { color: string }) {
  const t = useTranslations("eePage.m")
  const items = [
    { icon: Home, label: t("home"), active: true },
    { icon: Grid2x2, label: t("services") },
    { icon: MessageSquare, label: t("feed") },
    { icon: Star, label: t("rewards") },
    { icon: User, label: t("profile") },
  ]
  return (
    <div className="mt-auto grid grid-cols-5 border-t border-[#E5E7EB] bg-white px-[2cqw] pb-[4cqw] pt-[2.5cqw]">
      {items.map((it, i) => (
        <div key={i} className="flex flex-col items-center gap-[0.8cqw] text-[length:2.9cqw]" style={{ color: it.active ? color : "#667085" }}>
          <it.icon className="h-[4.6cqw] w-[4.6cqw]" />
          <span className="truncate">{it.label}</span>
        </div>
      ))}
    </div>
  )
}

const tileColors = ["#00796B", "#F26522", "#2563EB", "#0B6E69", "#F59E0B", "#475569"]

export function HomeScreen({ color = EE_TEAL, company, logo, logoSrc }: { color?: string; company?: string; logo?: string; logoSrc?: string }) {
  const t = useTranslations("eePage.m")
  const tiles = [
    { icon: Clock, label: t("attendance") },
    { icon: CalendarDays, label: t("leave") },
    { icon: ClipboardList, label: t("requests") },
    { icon: BookOpen, label: t("learning") },
    { icon: Star, label: t("rewards") },
    { icon: LayoutGrid, label: t("more") },
  ]
  return (
    <>
      <div className="px-[6cqw] pb-[14cqw] pt-[13cqw] text-white" style={{ background: `linear-gradient(165deg, ${color}, ${color}cc)` }}>
        <div className="flex items-center justify-between">
          <ArrowLeft className="h-[5cqw] w-[5cqw] rtl:rotate-180" />
          <span className="flex items-center gap-[1.5cqw] text-[length:5cqw] font-bold">
            {logoSrc && <span className="flex h-[6.5cqw] w-[6.5cqw] items-center justify-center rounded-[1.6cqw] bg-white p-[0.8cqw]"><img src={logoSrc} alt="" className="h-full w-full object-contain" /></span>}
            {logo && <span className="flex h-[5.5cqw] w-[5.5cqw] items-center justify-center rounded-[1.5cqw] bg-white text-[length:3.4cqw] font-black" style={{ color }}>{logo}</span>}
            {company ?? t("company")}
          </span>
          <Bell className="h-[4.6cqw] w-[4.6cqw]" />
        </div>
        <div className="mt-[5cqw] flex items-center gap-[3cqw]">
          <div className="flex h-[11cqw] w-[11cqw] items-center justify-center rounded-full bg-white/90 text-[length:4.6cqw] font-bold" style={{ color }}>
            {t("name").slice(0, 1)}
          </div>
          <div className="leading-tight">
            <div className="text-[length:4cqw] text-white/85">{t("greeting")}</div>
            <div className="text-[length:5.4cqw] font-bold">{t("name")}</div>
          </div>
        </div>
      </div>
      <div className="-mt-[9cqw] grid grid-cols-3 gap-[2.6cqw] px-[5cqw]">
        {tiles.map((tile, i) => (
          <div key={i} className="flex flex-col items-center gap-[1.5cqw] rounded-[3.5cqw] bg-white py-[3.6cqw] shadow-[0_2px_8px_rgba(11,31,51,0.08)]">
            <tile.icon className="h-[6cqw] w-[6cqw]" style={{ color: tileColors[i] }} />
            <span className="max-w-full truncate px-[1cqw] text-[length:3.1cqw] font-medium text-[#0B1F33]">{tile.label}</span>
          </div>
        ))}
      </div>
      <div className="mx-[5cqw] mt-[4cqw] grid grid-cols-2 gap-[2.6cqw]">
        {[{ icon: Clock, value: "08:45", label: t("checkIn"), c: "#00796B" }, { icon: CalendarDays, value: t("days", { n: 14 }), label: t("annual"), c: "#F26522" }].map((m, i) => (
          <div key={i} className="flex items-center gap-[2cqw] rounded-[3.5cqw] bg-white p-[2.8cqw] shadow-[0_2px_8px_rgba(11,31,51,0.08)]">
            <span className="flex h-[7.5cqw] w-[7.5cqw] shrink-0 items-center justify-center rounded-full" style={{ background: `${m.c}1a`, color: m.c }}><m.icon className="h-[4cqw] w-[4cqw]" /></span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-[length:3.6cqw] font-bold text-[#0B1F33]">{m.value}</span>
              <span className="block truncate text-[length:2.8cqw] text-[#667085]">{m.label}</span>
            </span>
          </div>
        ))}
      </div>
      <div className="mx-[5cqw] mt-[3cqw] overflow-hidden rounded-[4cqw] bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] p-[4cqw] text-white">
        <div className="text-[length:3.4cqw] text-white/80">{t("update")}</div>
        <div className="mt-[0.6cqw] text-[length:4.4cqw] font-bold leading-tight">{t("gathering")}</div>
        <span className="mt-[2.6cqw] inline-block rounded-full bg-white px-[3cqw] py-[1cqw] text-[length:3cqw] font-semibold text-[#1E3A8A]">{t("register")}</span>
      </div>
      <BottomNav color={color} />
    </>
  )
}

export function AttendanceScreen({ color = EE_TEAL }: { color?: string }) {
  const t = useTranslations("eePage.m")
  return (
    <>
      <ScreenHeader title={t("attendance")} color={color} />
      <div className="flex flex-col items-center px-[6cqw] pt-[8cqw]">
        <div className="flex h-[30cqw] w-[30cqw] items-center justify-center rounded-full bg-[#E8F5F3]">
          <div className="flex h-[20cqw] w-[20cqw] items-center justify-center rounded-full bg-[#00796B] text-white shadow-lg">
            <Check className="h-[10cqw] w-[10cqw]" strokeWidth={3} />
          </div>
        </div>
        <div className="mt-[4cqw] text-[length:5.4cqw] font-bold text-[#0B1F33]">{t("checkIn")}</div>
        <div className="text-[length:4cqw] font-semibold text-[#00796B]" dir="ltr">08:45 AM</div>
      </div>
      <div className="mx-[5cqw] mt-[7cqw] rounded-[4cqw] bg-white p-[4cqw] shadow-[0_2px_8px_rgba(11,31,51,0.08)]">
        <div className="mb-[2.5cqw] text-[length:3.8cqw] font-bold text-[#0B1F33]">{t("today")}</div>
        {[[t("checkIn"), "08:45 AM"], [t("checkOut"), "--"]].map(([k, v], i) => (
          <div key={i} className="flex justify-between border-t border-[#EEF2F6] py-[2.2cqw] text-[length:3.4cqw] text-[#667085]">
            <span>{k}</span><span className="font-semibold text-[#0B1F33]" dir="ltr">{v}</span>
          </div>
        ))}
      </div>
      <div className="mx-[5cqw] mt-[4cqw] rounded-[4cqw] bg-white p-[4cqw] shadow-[0_2px_8px_rgba(11,31,51,0.08)]">
        <div className="flex justify-between text-[length:3.8cqw] font-bold text-[#0B1F33]"><span>{t("thisWeek")}</span><span className="text-[#00796B]" dir="ltr">38h</span></div>
        <div className="mt-[3cqw] flex h-[14cqw] items-end gap-[2.5cqw]" dir="ltr">
          {[80, 95, 70, 90, 45].map((h, i) => (
            <div key={i} className="flex-1 rounded-t-[1.2cqw]" style={{ height: `${h}%`, background: i === 4 ? "#F26522" : color }} />
          ))}
        </div>
      </div>
    </>
  )
}

export function LeaveScreen({ color = EE_TEAL }: { color?: string }) {
  const t = useTranslations("eePage.m")
  return (
    <>
      <ScreenHeader title={t("myLeave")} color={color} />
      <div className="mx-[5cqw] mt-[5cqw] rounded-[4cqw] bg-white p-[4cqw] shadow-[0_2px_8px_rgba(11,31,51,0.08)]">
        <div className="mb-[2cqw] text-[length:3.8cqw] font-bold text-[#0B1F33]">{t("balance")}</div>
        {[[t("annual"), 14], [t("sick"), 10]].map(([k, n], i) => (
          <div key={i} className="flex justify-between border-t border-[#EEF2F6] py-[2.4cqw] text-[length:3.4cqw] text-[#667085]">
            <span>{k}</span><span className="font-bold text-[#0B1F33]">{t("days", { n })}</span>
          </div>
        ))}
      </div>
      <div className="mx-[5cqw] mt-[4cqw] rounded-[3cqw] py-[3cqw] text-center text-[length:3.8cqw] font-semibold text-white" style={{ background: color }}>
        {t("requestLeave")}
      </div>
      <div className="mx-[5cqw] mt-[4cqw] rounded-[4cqw] bg-white p-[4cqw] shadow-[0_2px_8px_rgba(11,31,51,0.08)]">
        <div className="mb-[2cqw] text-[length:3.8cqw] font-bold text-[#0B1F33]">{t("requests")}</div>
        {[[t("annual"), t("approved"), true], [t("sick"), t("pending"), false]].map(([k, s, ok], i) => (
          <div key={i} className="flex items-center justify-between border-t border-[#EEF2F6] py-[2.4cqw] text-[length:3.3cqw] text-[#0B1F33]">
            <span className="flex items-center gap-[1.5cqw]"><CalendarDays className="h-[3.8cqw] w-[3.8cqw] text-[#667085]" />{k}</span>
            <span className={cn("rounded-full px-[2.2cqw] py-[0.6cqw] text-[length:2.8cqw] font-semibold", ok ? "bg-[#E8F5F3] text-[#00796B]" : "bg-[#FFF3EC] text-[#F26522]")}>{s as string}</span>
          </div>
        ))}
      </div>
    </>
  )
}
