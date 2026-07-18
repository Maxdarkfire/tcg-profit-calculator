"use client";

import { useMemo, useState } from "react";
import { FEES } from "@/config/fees";
import { PACKAGING_PRESETS, LABEL_COST_CENTS } from "@/config/shippingSupplies";
import { LGS_DEFAULTS } from "@/config/lgsComparison";
import { formatCents, parseDollarsToCents, roundCents } from "@/lib/money";

/** Typical single-card shipping baseline: standard envelope + postage +
 *  label. Assumes free shipping to the buyer (no shipping charged), which
 *  is common for lower-value singles — a real listing with paid shipping
 *  would net a bit more. */
const TYPICAL_SHIPPING_CENTS =
  PACKAGING_PRESETS.singleEnvelope.packagingCents +
  PACKAGING_PRESETS.singleEnvelope.postageCents +
  LABEL_COST_CENTS;

export default function LgsComparison() {
  const [marketValue, setMarketValue] = useState("");
  const [cashPct, setCashPct] = useState(String(LGS_DEFAULTS.cashPct));
  const [creditPct, setCreditPct] = useState(String(LGS_DEFAULTS.creditPct));

  const marketCents = parseDollarsToCents(marketValue);
  const hasInput = marketCents > 0;

  const result = useMemo(() => {
    const marketplaceFee = roundCents(marketCents * FEES.marketplaceRate);
    const processingFee =
      marketCents > 0
        ? roundCents(marketCents * FEES.processingRate) + FEES.processingFlatCents
        : 0;
    const onlineNet = Math.max(
      0,
      marketCents - marketplaceFee - processingFee - TYPICAL_SHIPPING_CENTS
    );

    const cash = roundCents(marketCents * (parseFloat(cashPct) || 0) / 100);
    const credit = roundCents(marketCents * (parseFloat(creditPct) || 0) / 100);

    return { onlineNet, cash, credit };
  }, [marketCents, cashPct, creditPct]);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-7">
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-zinc-300">
          Card market value
        </span>
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-500">
            $
          </span>
          <input
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={marketValue}
            onChange={(e) => setMarketValue(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2.5 pl-7 pr-3 text-base text-zinc-100 outline-none focus:border-emerald-500"
          />
        </div>
        <span className="mt-1 block text-xs text-zinc-500">
          What it&apos;s actually worth right now (TCG market price)
        </span>
      </label>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-zinc-300">
            LGS cash offer
          </span>
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              value={cashPct}
              onChange={(e) => setCashPct(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2.5 pr-7 pl-3 text-base text-zinc-100 outline-none focus:border-emerald-500"
            />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-zinc-500">
              %
            </span>
          </div>
          <span className="mt-1 block text-xs text-zinc-500">
            % of market value, typical range
          </span>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-zinc-300">
            LGS store credit
          </span>
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              value={creditPct}
              onChange={(e) => setCreditPct(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2.5 pr-7 pl-3 text-base text-zinc-100 outline-none focus:border-emerald-500"
            />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-zinc-500">
              %
            </span>
          </div>
          <span className="mt-1 block text-xs text-zinc-500">
            % of market value, typical range
          </span>
        </label>
      </div>

      <div className="mt-6 space-y-2 border-t border-zinc-800 pt-5 text-sm">
        <ResultRow
          label="Sell online (TCGplayer)"
          cents={hasInput ? result.onlineNet : null}
          marketCents={marketCents}
          highlight
        />
        <ResultRow
          label="LGS — cash"
          cents={hasInput ? result.cash : null}
          marketCents={marketCents}
        />
        <ResultRow
          label="LGS — store credit"
          cents={hasInput ? result.credit : null}
          marketCents={marketCents}
        />
      </div>

      <p className="mt-5 text-xs leading-relaxed text-zinc-500">
        &quot;Sell online&quot; assumes free shipping to the buyer and typical
        supply costs ({formatCents(TYPICAL_SHIPPING_CENTS)}) — a listing where
        you charge for shipping would net more. LGS percentages are rough,
        commonly-cited ranges, not a real quote — actual offers vary a lot by
        store, condition, demand, and how well the card is currently selling
        for them. Use this for a ballpark, not a final decision.
      </p>
    </div>
  );
}

function ResultRow({
  label,
  cents,
  marketCents,
  highlight,
}: {
  label: string;
  cents: number | null;
  marketCents: number;
  highlight?: boolean;
}) {
  const pct =
    cents !== null && marketCents > 0
      ? ((cents / marketCents) * 100).toFixed(0)
      : null;
  return (
    <div className="flex items-baseline justify-between">
      <span className={highlight ? "font-medium text-zinc-200" : "text-zinc-400"}>
        {label}
      </span>
      <span className="flex items-baseline gap-2">
        {pct !== null && (
          <span className="text-xs text-zinc-500">{pct}%</span>
        )}
        <span
          className={`tabular-nums ${
            highlight ? "text-lg font-bold text-emerald-400" : "text-zinc-200"
          }`}
        >
          {cents === null ? "—" : formatCents(cents)}
        </span>
      </span>
    </div>
  );
}
