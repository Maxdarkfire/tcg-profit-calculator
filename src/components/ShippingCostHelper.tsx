"use client";

import { useEffect, useMemo, useState } from "react";
import {
  PER_CARD_SUPPLIES as PC,
  PACKAGING_PRESETS as PKG,
  LABEL_COST_CENTS,
} from "@/config/shippingSupplies";
import { formatCents, parseDollarsToCents } from "@/lib/money";

interface Props {
  quantity: number;
  onApply: (cents: number) => void;
}

type PackagingKey = keyof typeof PKG;

export default function ShippingCostHelper({ quantity, onApply }: Props) {
  const [open, setOpen] = useState(false);
  const [packaging, setPackaging] = useState<PackagingKey>("singleEnvelope");
  const [pennySleeve, setPennySleeve] = useState(true);
  const [teamBag, setTeamBag] = useState(true);
  const [topLoader, setTopLoader] = useState(false);
  const [cardProtector, setCardProtector] = useState(false);
  const [postageOverride, setPostageOverride] = useState("");
  const [boxOverride, setBoxOverride] = useState("");

  const qty = Math.max(1, Math.floor(quantity) || 1);

  // Reset overrides when packaging choice changes, so stale numbers don't linger.
  useEffect(() => {
    setPostageOverride("");
    setBoxOverride("");
  }, [packaging]);

  const perCardCents = useMemo(() => {
    let per = 0;
    if (pennySleeve) per += PC.pennySleeveCents;
    if (teamBag) per += PC.teamBagCents;
    if (topLoader) per += PC.topLoaderCents;
    if (cardProtector) per += PC.cardProtectorCents;
    return per * qty;
  }, [pennySleeve, teamBag, topLoader, cardProtector, qty]);

  const packagingCents = useMemo(() => {
    if (packaging === "flatRateBox") {
      return boxOverride
        ? parseDollarsToCents(boxOverride)
        : PKG.flatRateBox.allInCents;
    }
    const preset = PKG[packaging];
    const postage = postageOverride
      ? parseDollarsToCents(postageOverride)
      : preset.postageCents;
    return preset.packagingCents + postage;
  }, [packaging, postageOverride, boxOverride]);

  const labelCents = packaging === "flatRateBox" ? 0 : LABEL_COST_CENTS;
  const totalCents = perCardCents + packagingCents + labelCents;

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-1 text-xs font-medium text-emerald-400 hover:text-emerald-300"
      >
        Estimate from supply costs →
      </button>
    );
  }

  return (
    <div className="mt-2 rounded-lg border border-zinc-700 bg-zinc-950/60 p-3">
      <div className="mb-3">
        <span className="mb-1.5 block text-xs font-medium text-zinc-400">
          Packaging ({qty} {qty === 1 ? "card" : "cards"})
        </span>
        <div className="space-y-1.5">
          {(Object.keys(PKG) as PackagingKey[]).map((key) => (
            <label
              key={key}
              className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300"
            >
              <input
                type="radio"
                name="packaging"
                checked={packaging === key}
                onChange={() => setPackaging(key)}
                className="h-3.5 w-3.5 border-zinc-600 bg-zinc-900"
              />
              {PKG[key].label}
            </label>
          ))}
        </div>

        {packaging !== "flatRateBox" ? (
          <div className="mt-2 flex items-center justify-between pl-5">
            <span className="text-xs text-zinc-500">Postage</span>
            <div className="relative w-20">
              <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center text-xs text-zinc-500">
                $
              </span>
              <input
                type="text"
                inputMode="decimal"
                placeholder={(PKG[packaging].postageCents / 100).toFixed(2)}
                value={postageOverride}
                onChange={(e) => setPostageOverride(e.target.value)}
                className="w-full rounded border border-zinc-700 bg-zinc-900 py-1 pl-5 pr-2 text-right text-xs text-zinc-100 outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        ) : (
          <div className="mt-2 flex items-center justify-between pl-5">
            <span className="text-xs text-zinc-500">Box + postage (all-in)</span>
            <div className="relative w-20">
              <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center text-xs text-zinc-500">
                $
              </span>
              <input
                type="text"
                inputMode="decimal"
                placeholder={(PKG.flatRateBox.allInCents / 100).toFixed(2)}
                value={boxOverride}
                onChange={(e) => setBoxOverride(e.target.value)}
                className="w-full rounded border border-zinc-700 bg-zinc-900 py-1 pl-5 pr-2 text-right text-xs text-zinc-100 outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-1.5 border-t border-zinc-800 pt-3 text-sm">
        <span className="mb-1 block text-xs font-medium text-zinc-400">
          Per card × {qty}
        </span>
        <SupplyRow
          label="Penny sleeve"
          costCents={PC.pennySleeveCents}
          checked={pennySleeve}
          onChange={setPennySleeve}
        />
        <SupplyRow
          label="Team bag"
          costCents={PC.teamBagCents}
          checked={teamBag}
          onChange={setTeamBag}
        />
        <SupplyRow
          label="Top loader"
          costCents={PC.topLoaderCents}
          checked={topLoader}
          onChange={setTopLoader}
        />
        <SupplyRow
          label="Card protector (high-value)"
          costCents={PC.cardProtectorCents}
          checked={cardProtector}
          onChange={setCardProtector}
        />
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-zinc-800 pt-2">
        <span className="text-sm font-medium text-zinc-300">
          Total: <span className="tabular-nums">{formatCents(totalCents)}</span>
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded px-2 py-1 text-xs text-zinc-400 hover:text-zinc-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onApply(totalCents);
              setOpen(false);
            }}
            className="rounded bg-emerald-500 px-3 py-1 text-xs font-semibold text-zinc-950 hover:bg-emerald-400"
          >
            Use this total
          </button>
        </div>
      </div>

      <p className="mt-2 text-[11px] leading-relaxed text-zinc-600">
        Defaults are one seller&apos;s real costs, not yours necessarily — edit
        anything above, or override the shipping cost field directly after
        applying. Per-card items scale with quantity; packaging/postage don&apos;t.
      </p>
    </div>
  );
}

function SupplyRow({
  label,
  costCents,
  checked,
  onChange,
}: {
  label: string;
  costCents: number;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-zinc-300">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="h-3.5 w-3.5 rounded border-zinc-600 bg-zinc-900"
        />
        {label}
      </span>
      <span className="tabular-nums text-zinc-400">{formatCents(costCents)}/ea</span>
    </label>
  );
}
