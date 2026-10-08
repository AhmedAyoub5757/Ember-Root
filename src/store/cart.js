import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX = 12;

export const useCart = create(
  persist(
    (set) => ({
      items: [],
      isOpen: false,

      add: (id, qty = 1, size = "150") =>
        set((s) => {
          const found = s.items.find((i) => i.id === id && i.size === size);
          return {
            items: found
              ? s.items.map((i) => (i === found ? { ...i, qty: Math.min(MAX, i.qty + qty) } : i))
              : [...s.items, { id, size, qty: Math.min(MAX, qty) }],
          };
        }),

      setQty: (id, size, qty) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.id === id && i.size === size ? { ...i, qty: Math.min(MAX, Math.max(1, qty)) } : i
          ),
        })),

      remove: (id, size) =>
        set((s) => ({ items: s.items.filter((i) => !(i.id === id && i.size === size)) })),

      clear: () => set({ items: [] }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    {
      name: "er-cart",
      version: 1,
      partialize: (s) => ({ items: s.items }), // never persist isOpen
    }
  )
);