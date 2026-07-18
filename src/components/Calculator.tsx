"use client";

import { useMemo, useState } from "react";
import { calculate } from "@/lib/calc";
import { FEES } from "@/config/fees";
import { formatCents, parseDollarsToCents } from "@/lib/money";
import ShippingCostHelper from "./ShippingCostHelper";

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
                quantity={parseInt(qty, 10) || 1}
                onApply={(cents) =>
                  setValues((v) => ({
                    ...v,
                    shippingCost: (cents / 100).toFixed(2),
                  }))
                }
              />
            )}
          </label>
        ))}
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-zinc-300">
            Quantity
          </span>
          <input
            type="number"
            min={1}
            inputMode="numeric"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-base text-zinc-100 outline-none focus:border-emerald-500"
          />
        </label>
      </div>

      <div className="mt-6 space-y-2 border-t border-zinc-800 pt-5 text-sm">
        <Row label="Total sale (incl. shipping)" value={formatCents(result.grossCents)} />
        <Row
          label={`Marketplace fee (${(FEES.marketplaceRate * 100).toFixed(2)}%)`}
          value={`−${formatCents(result.marketplaceFeeCents)}`}
          muted
        />
        <Row
          label={`Payment processing (${(FEES.processingRate * 100).toFixed(1)}% + ${formatCents(FEES.processingFlatCents)})`}
          value={`−${formatCents(result.processingFeeCents)}`}
          muted
        />
        <div className="flex items-baseline justify-between border-t border-zinc-800 pt-3">
          <span className="text-base font-semibold text-zinc-200">Net profit</span>
          <span
            className={`text-2xl font-bold tabular-nums ${
              !hasInput
                ? "text-zinc-500"
                : profitable
                  ? "text-emerald-400"
                  : "text-red-400"
            }`}
          >
            {formatCents(result.netCents)}
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-zinc-400">Margin</span>
          <span className="font-semibold tabular-nums text-zinc-200">
            {result.marginPct === null ? "—" : `${result.marginPct.toFixed(1)}%`}
          </span>
        </div>
      </div>

      <p className="mt-5 text-xs leading-relaxed text-zinc-500">
        Fee rates last verified: {FEES.lastVerified}. Estimates only — actual
        fees depend on your seller level and TCGplayer&apos;s current fee
        schedule, and exclude buyer sales tax. TCGplayer factors tax into its
        fee calculation for taxable-state orders but doesn&apos;t show sellers
        the tax amount, so this calculator can&apos;t account for it — actual
        fees may run higher than shown, especially on higher-value sales to
        taxable states.
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between">
      <span className={muted ? "text-zinc-400" : "text-zinc-300"}>{label}</span>
      <span className="tabular-nums text-zinc-200">{value}</span>
    </div>
  );
}
