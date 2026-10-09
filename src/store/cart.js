import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cleanMessage, lineKey } from "../lib/money.js";

const MAX = 12;

export const useCart = create(
  persist(
    (set) => ({
      items: [],
      isOpen: false,

      add: (id, qty = 1, size = "150") =>
        set((s) => {
          const item = { id, size };
          const found = s.items.find((i) => lineKey(i) === lineKey(item));
          return {
            items: found
              ? s.items.map((i) => (i === found ? { ...i, qty: Math.min(MAX, i.qty + qty) } : i))
              : [...s.items, { id, size, qty: Math.min(MAX, qty) }],
          };
        }),

      addBundle: ({ id, size, picks, message }, qty = 1) =>
        set((s) => {
          const item = {
            kind: "bundle",
            id,
            size,
            picks,
            message: cleanMessage(message),
            qty: Math.min(MAX, qty),
          };
          const found = s.items.find((i) => lineKey(i) === lineKey(item));
          return {
            items: found
              ? s.items.map((i) => (i === found ? { ...i, qty: Math.min(MAX, i.qty + qty) } : i))
              : [...s.items, item],
          };
        }),

      setQty: (key, qty) =>
        set((s) => ({
          items: s.items.map((i) =>
            lineKey(i) === key ? { ...i, qty: Math.min(MAX, Math.max(1, qty)) } : i
          ),
        })),

      remove: (key) =>
        set((s) => ({ items: s.items.filter((i) => lineKey(i) !== key) })),

      clear: () => set({ items: [] }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    {
      name: "er-cart",
      version: 1,
      partialize: (s) => ({
        items: s.items.map((item) =>
          item.kind === "bundle"
            ? {
                kind: "bundle",
                id: item.id,
                size: item.size,
                picks: item.picks,
                message: item.message,
                qty: item.qty,
              }
            : { id: item.id, size: item.size, qty: item.qty }
        ),
      }), // never persist isOpen
    }
  )
);