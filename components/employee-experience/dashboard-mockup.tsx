"use client"
// Management dashboard preview built from real UI inside a laptop frame.
// Sizes use cqw (percent of the laptop width) so it scales cleanly.
import React from "react"
import { useLocale, useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { BarChart3, FileText, LayoutDashboard, Settings, Users, Wrench, CalendarDays } from "lucide-react"
import { EE_TEAL } from "./phone-mockups"

const bars = [42, 55, 48, 63, 58, 72, 66, 81, 77, 88]

export function DashboardMockup({ className }: { className?: string }) {
  const t = useTranslations("eePage.m")
  const dir = useLocale() === "ar" ? "rtl" : "ltr"
  const nav = [
    { icon: LayoutDashboard, label: t("dashboard"), active: true },
    { icon: Users, label: t("employees") },
    { icon: CalendarDays, label: t("leave") },
    { icon: BarChart3, label: t("reports") },
    { icon: Settings, label: t("settings") },
  ]
  const stats = [
    { label: t("totalEmp"), value: "1,248", tone: "text-[#0B1F33]" },
    { label: t("pendingReq"), value: "18", tone: "text-[#F26522]" },
    { label: t("attendanceToday"), value: "93%", tone: "text-[#00796B]" },
  ]
  const recent = [
    { icon: CalendarDays, label: t("leaveReq"), status: t("approved"), ok: true },
    { icon: FileText, label: t("hrLetter"), status: t("approved"), ok: true },
    { icon: Wrench, label: t("maintenance"), status: t("pending"), ok: false },
  ]
  return (
    <div className={cn("@container", className)}>
      <div className="rounded-t-[2.2cqw] bg-[#1F2937] p-[1.4cqw] shadow-[0_30px_60px_-25px_rgba(11,31,51,0.5)]">
        <div className="flex aspect-[16/10] overflow-hidden rounded-[0.8cqw] bg-[#F8FAFC]" dir={dir}>
          <aside className="flex w-[21%] flex-col gap-[0.6cqw] px-[1.4cqw] py-[2cqw] text-white" style={{ background: "#0B1F33" }}>
            <div className="mb-[1.6cqw] flex items-center gap-[0.8cqw] text-[length:1.9cqw] font-bold">
              <span className="h-[2.4cqw] w-[2.4cqw] rounded-[0.6cqw] bg-gradient-to-br from-[#F26522] to-[#00796B]" />
              PrimeServe
            </div>
            {nav.map((n, i) => (
              <div key={i} className={cn("flex items-center gap-[0.9cqw] rounded-[0.8cqw] px-[1cqw] py-[0.9cqw] text-[length:1.45cqw]", n.active ? "text-white" : "text-white/65")} style={n.active ? { background: EE_TEAL } : undefined}>
                <n.icon className="h-[1.8cqw] w-[1.8cqw] shrink-0" />
                <span className="truncate">{n.label}</span>
              </div>
            ))}
          </aside>
          <div className="flex flex-1 flex-col gap-[1.6cqw] p-[2.2cqw]">
            <div className="text-[length:2.3cqw] font-bold text-[#0B1F33]">{t("empMgmt")}</div>
            <div className="grid grid-cols-3 gap-[1.4cqw]">
              {stats.map((s, i) => (
                <div key={i} className="rounded-[1.2cqw] bg-white p-[1.5cqw] shadow-[0_1px_4px_rgba(11,31,51,0.08)]">
                  <div className="truncate text-[length:1.3cqw] text-[#667085]">{s.label}</div>
                  <div className={cn("mt-[0.4cqw] text-[length:2.8cqw] font-bold", s.tone)} dir="ltr">{s.value}</div>
                </div>
              ))}
            </div>
            <div className="grid flex-1 grid-cols-[1.35fr_1fr] gap-[1.4cqw]">
              <div className="flex flex-col rounded-[1.2cqw] bg-white p-[1.5cqw] shadow-[0_1px_4px_rgba(11,31,51,0.08)]">
                <div className="text-[length:1.5cqw] font-bold text-[#0B1F33]">{t("attTrend")}</div>
                <div className="mt-[1cqw] flex flex-1 items-end gap-[0.8cqw]" dir="ltr">
                  {bars.map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-[0.5cqw]" style={{ height: `${h}%`, background: i === bars.length - 1 ? "#F26522" : `linear-gradient(180deg, #38BDF8, ${EE_TEAL})` }} />
                  ))}
                </div>
              </div>
              <div className="rounded-[1.2cqw] bg-white p-[1.5cqw] shadow-[0_1px_4px_rgba(11,31,51,0.08)]">
                <div className="mb-[0.8cqw] text-[length:1.5cqw] font-bold text-[#0B1F33]">{t("recentReq")}</div>
                {recent.map((r, i) => (
                  <div key={i} className="flex items-center justify-between gap-[0.6cqw] border-t border-[#EEF2F6] py-[1cqw] text-[length:1.3cqw] text-[#0B1F33]">
                    <span className="flex min-w-0 items-center gap-[0.6cqw]"><r.icon className="h-[1.6cqw] w-[1.6cqw] shrink-0 text-[#667085]" /><span className="truncate">{r.label}</span></span>
                    <span className={cn("shrink-0 rounded-full px-[0.9cqw] py-[0.2cqw] text-[length:1.1cqw] font-semibold", r.ok ? "bg-[#E8F5F3] text-[#00796B]" : "bg-[#FFF3EC] text-[#F26522]")}>{r.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="-mx-[4%] h-[2.2cqw] w-[108%] rounded-b-[2cqw] bg-gradient-to-b from-[#D1D5DB] to-[#9CA3AF]" />
    </div>
  )
}
