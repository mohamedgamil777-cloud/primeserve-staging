import { CustomerPromotionCode } from '@/types/promotionCode';
import { RedeemedRewardItem } from '@/types/reward';
import { create } from 'zustand';

interface CartState {
  reward: RedeemedRewardItem | null;
  promoCode: CustomerPromotionCode | null;
  setReward: (reward: RedeemedRewardItem|null) => void;
  setPromoCode: (code: CustomerPromotionCode | null) => void;
  reset: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  // Initial state
  reward: null,
  promoCode: null,

  // Actions
  setReward: (amount) => set({ reward: amount }),
  setPromoCode: (code) => set({ promoCode: code }),
  reset: () => set({ reward: null, promoCode: null }),
}));