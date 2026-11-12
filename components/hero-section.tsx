"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import hero from "@/public/imgs/hero.jpg"
import Image from "next/image"
import { getLocalizedValue } from "@/types/internationalization"
import { useLocale } from "@/hooks/use-locale"
import { HeroSectionData } from "@/types/store"

export function HeroSection({heroSectionData}:{heroSectionData?:HeroSectionData}) {
  const locale = useLocale()
  return (
    <section className="relative h-[60vh] min-h-[300px] overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 z-10" />
        <Image 
          src={heroSectionData?.heroBackgroundImage ? `/api/imgs/stores/${heroSectionData?.heroBackgroundImage}` : hero} 
          alt="Hero Image" 
          height={900}
          width={900}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="container relative z-20 flex h-full flex-col items-start justify-center px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-xl space-y-4"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl font-bold tracking-tighter text-white sm:text-5xl md:text-6xl"
          >
            {heroSectionData?.heroTitleI18n ? (getLocalizedValue(heroSectionData?.heroTitleI18n,locale) ?? heroSectionData?.heroTitle) : ""}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl text-white/90"
          >
            {heroSectionData?.heroDescriptionI18n ? (getLocalizedValue(heroSectionData.heroDescriptionI18n,locale) ?? heroSectionData?.heroDescription) : ""}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <Button asChild size="lg" variant={"default"} className="w-48 font-bold border-[#34ca80] bg-[#34ca80] hover:bg-[#09a962]/10 dark:text-white">
              <Link href={`/${locale}/${heroSectionData?.heroMainButtonLink ?? "#"}`}>{heroSectionData?.heroMainButtonTextI18n ? (getLocalizedValue(heroSectionData.heroMainButtonTextI18n,locale) ?? heroSectionData?.heroMainButtonText) : ""}</Link>
            </Button>
            <Button asChild variant="default" size="lg" className="w-48 font-bold border-[#34ca80] bg-[#34ca80] hover:bg-[#09a962]/10 dark:text-white">
              <Link href={`/${locale}/${heroSectionData?.heroSecondaryButtonLink ?? "#"}`}>{heroSectionData?.heroSecondaryButtonTextI18n ? (getLocalizedValue(heroSectionData.heroSecondaryButtonTextI18n,locale) ?? heroSectionData?.heroSecondaryButtonText) : ""}</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}