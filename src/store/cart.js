import { create } from "zustand";

export const useCart = create((set) => ({
  items: [],
  isOpen: false,

  add: (id, qty = 1, size = "150") =>
    set((s) => {
      const found = s.items.find((i) => i.id === id && i.size === size);
      return {
        items: found
          ? s.items.map((i) => (i === found ? { ...i, qty: i.qty + qty } : i))
          : [...s.items, { id, size, qty }],
      };
    }),

  setQty: (id, size, qty) =>
    set((s) => ({
      items: s.items.map((i) => (i.id === id && i.size === size ? { ...i, qty: Math.max(1, qty) } : i)),
    })),

  remove: (id, size) =>
    set((s) => ({ items: s.items.filter((i) => !(i.id === id && i.size === size)) })),

  clear: () => set({ items: [] }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));