import React from 'react'
import { Fleur_De_Leah } from "next/font/google";
import { cn } from '@/lib/utils';
import { getTranslations } from 'next-intl/server';

const fleurDeLeah = Fleur_De_Leah({
  weight:'400',
  subsets:['latin']
});


type Props = {locale:string}

export default async function MadeByCodmium({locale}: Props) {
  const t = await getTranslations({locale})
  return (
    <p className=" w-full p-4 bg-black text-white text-center flex items-center justify-center">
      {t('developed-and-maintained-by')} 
      <a style={{"fontWeight":"bolder"}} className={cn(fleurDeLeah.className," text-primary mx-1 underline underline-offset-4 text-3xl font-extrabold")} href={"https://codmium.com/"}>Codmium</a>
    </p>
  )
}