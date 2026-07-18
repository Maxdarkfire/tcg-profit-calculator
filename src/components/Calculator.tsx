"use client";

import { useMemo, useState } from "react";
import { calculate } from "@/lib/calc";
import { FEES } from "@/config/fees";
import { formatCents, parseDollarsToCents } from "@/lib/money";
import ShippingCostHelper from "./ShippingCostHelper";
import CogsHelper from "./CogsHelper";

interface Field {
  key: "salePrice" | "shippingCharged" | "shippingCost" | "cogs";
  label: string;
  hint: string;
}

const FIELDS: Field[] = [
  { key: "salePrice", label: "Sale price (per card)", hint: "Listed price" },
  { key: "shippingCharged", label: "Shipping charged", hint: "What the buyer pays" },
  { key: "shippingCost", label: "Your shipping cost", hint: "Postage + envelope/sleeve" },
  { key: "cogs", label: "Card cost (per card)", hint: "What you paid for it" },
];

export default function Calculator() {
  const [values, setValues] = useState<Record<Field["key"], string>>({
    salePrice: "",
    shippingCharged: "",
    shippingCost: "",
    cogs: "",
  });
  const [qty, setQty] = useState("1");

  const result = useMemo(
    () =>
      calculate({
        salePriceCents: parseDollarsToCents(values.salePrice),
        shippingChargedCents: parseDollarsToCents(values.shippingCharged),
        shippingCostCents: parseDollarsToCents(values.shippingCost),
        cogsCents: parseDollarsToCents(values.cogs),
        quantity: parseInt(qty, 10) || 0,
      }),
    [values, qty]
  );

  const profitable = result.netCents > 0;
  const hasInput = result.grossCents > 0;

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-7">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <label key={f.key} className="block">
            <span className="mb-1 block text-sm font-medium text-zinc-300">
              {f.label}
            </span>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-500">
                $
              </span>
              <input
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={values[f.key]}
                onChange={(e) =>
                  setValues((v) => ({ ...v, [f.key]: e.target.value }))
                }
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2.5 pl-7 pr-3 text-base text-zinc-100 outline-none focus:border-emerald-500"
              />
            </div>
            <span className="mt-1 block text-xs text-zinc-500">{f.hint}</span>
            {f.key === "shippingCost" && (
              <ShippingCostHelper
