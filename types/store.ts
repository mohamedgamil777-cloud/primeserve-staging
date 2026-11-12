import { selectHeroSectionDataSchema } from "@/db/schema/storeAssets";
import { selectStoreSchema } from "@/db/schema/stores";
import { z } from "zod";

export type ExistingStore = z.infer<typeof selectStoreSchema>


export type HeroSectionData = z.infer<typeof selectHeroSectionDataSchema>