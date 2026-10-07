import { create } from "zustand";

export const useCart = create((set) => ({
  items: [],
  isOpen: false,
  add: (id, qty = 1) =>
    set((s) => {
      const found = s.items.find((i) => i.id === id);
      return {
        items: found
          ? s.items.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i))
          : [...s.items, { id, qty }],
      };
    }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
}));