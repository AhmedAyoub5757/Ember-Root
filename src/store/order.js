import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// While true, the confirmation page shows a "no payment was taken" banner.
// Set to false only when real payments are connected.
export const DEMO = true;

export const useOrder = create(
  persist(
    (set) => ({
      last: null,
      place: (order) => set({ last: order }),
    }),
    {
      name: "er-last-order",
      version: 1,
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);