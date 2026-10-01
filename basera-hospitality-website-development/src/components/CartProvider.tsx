"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import { MAX_QTY, computeOrder, type CartItem } from "@/lib/order";
import { menuItemById } from "@/data/business";

type State = { items: CartItem[]; hydrated: boolean };
type Action =
  | { type: "hydrate"; items: CartItem[] }
  | { type: "add"; id: string }
  | { type: "set"; id: string; qty: number }
  | { type: "remove"; id: string }
  | { type: "clear" };

const KEY = "basera-order-v1";

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return { items: action.items, hydrated: true };
    case "add": {
      const found = state.items.find((i) => i.id === action.id);
      if (found)
        return {
          ...state,
          items: state.items.map((i) => (i.id === action.id ? { ...i, qty: Math.min(MAX_QTY, i.qty + 1) } : i)),
        };
      return { ...state, items: [...state.items, { id: action.id, qty: 1 }] };
    }
    case "set":
      if (action.qty <= 0) return { ...state, items: state.items.filter((i) => i.id !== action.id) };
      return {
        ...state,
        items: state.items.map((i) => (i.id === action.id ? { ...i, qty: Math.min(MAX_QTY, action.qty) } : i)),
      };
    case "remove":
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case "clear":
      return { ...state, items: [] };
  }
}

type CartContextValue = {
  items: CartItem[];
  hydrated: boolean;
  count: number;
  add: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  qtyOf: (id: string) => number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], hydrated: false });

  useEffect(() => {
    let items: CartItem[] = [];
    try {
      const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      if (Array.isArray(parsed))
        items = parsed.filter(
          (i: CartItem) => i && menuItemById.has(i.id) && Number.isInteger(i.qty) && i.qty > 0,
        );
    } catch {
      /* ignore corrupt storage */
    }
    dispatch({ type: "hydrate", items });
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state.items));
    } catch {
      /* storage may be blocked; cart still works in memory */
    }
  }, [state.items, state.hydrated]);

  const add = useCallback((id: string) => dispatch({ type: "add", id }), []);
  const setQty = useCallback((id: string, qty: number) => dispatch({ type: "set", id, qty }), []);
  const remove = useCallback((id: string) => dispatch({ type: "remove", id }), []);
  const clear = useCallback(() => dispatch({ type: "clear" }), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      hydrated: state.hydrated,
      count: computeOrder(state.items).count,
      add,
      setQty,
      remove,
      clear,
      qtyOf: (id) => state.items.find((i) => i.id === id)?.qty ?? 0,
    }),
    [state, add, setQty, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
