"use client";

import { useMemo, useState } from "react";
import { formatCents, parseDollarsToCents } from "@/lib/money";

interface Props {
  onApply: (cents: number) => void;
}

type Mode = "packs" | "total";

export default function CogsHelper({ onApply }: Props) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("packs");
  const [boxPrice, setBoxPrice] = useState("");
  const [packsPerBox, setPacksPerBox] = useState("");
  const [cardsPerPack, setCardsPerPack] = useState("");
  const [totalCardsInput, setTotalCardsInput] = useState("");

  const totalCards = useMemo(() => {
    if (mode === "total") {
      return Math.max(0, parseInt(totalCardsInput, 10) || 0);
    }
    const packs = Math.max(0, parseInt(packsPerBox, 10) || 0);
    const perPack = Math.max(0, parseInt(cardsPerPack, 10) || 0);
    return packs * perPack;
  }, [mode, totalCardsInput, packsPerBox, cardsPerPack]);

  const boxCents = parseDollarsToCents(boxPrice);
  const perCardCents = totalCards > 0 ? Math.round(boxCents / totalCards) : 0;

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-1 text-xs font-medium text-emerald-400 hover:text-emerald-300"
      >
        Estimate from box price →
      </button>
    );
  }

  return (
    <div className="mt-2 rounded-lg border border-zinc-700 bg-zinc-950/60 p-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-400">Box price</span>
        <div className="relative w-24">
          <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center text-xs text-zinc-500">
            $
          </span>
          <input
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={boxPrice}
            onChange={(e) => setBoxPrice(e.target.value)}
            className="w-full rounded border border-zinc-700 bg-zinc-900 py-1 pl-5 pr-2 text-right text-xs text-zinc-100 outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      <div className="mt-3 flex gap-3 text-xs">
        <label className="flex cursor-pointer items-center gap-1.5 text-zinc-300">
          <input
            type="radio"
            name="cogsMode"
            checked={mode === "packs"}
            onChange={() => setMode("packs")}
            className="h-3.5 w-3.5 border-zinc-600 bg-zinc-900"
          />
          Packs × cards/pack
        </label>
        <label className="flex cursor-pointer items-center gap-1.5 text-zinc-300">
          <input
            type="radio"
            name="cogsMode"
            checked={mode === "total"}
            onChange={() => setMode("total")}
            className="h-3.5 w-3.5 border-zinc-600 bg-zinc-900"
          />
          I know the total cards
        </label>
      </div>

      {mode === "packs" ? (
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div>
            <span className="mb-1 block text-[11px] text-zinc-500">
              Packs per box
            </span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="e.g. 24"
              value={packsPerBox}
              onChange={(e) => setPacksPerBox(e.target.value)}
              className="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-100 outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <span className="mb-1 block text-[11px] text-zinc-500">
              Cards per pack
            </span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="e.g. 10"
              value={cardsPerPack}
              onChange={(e) => setCardsPerPack(e.target.value)}
              className="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-100 outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      ) : (
        <div className="mt-2">
          <span className="mb-1 block text-[11px] text-zinc-500">
            Total cards in box
          </span>
          <input
            type="text"
            inputMode="numeric"
            placeholder="e.g. 240"
            value={totalCardsInput}
            onChange={(e) => setTotalCardsInput(e.target.value)}
            className="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-100 outline-none focus:border-emerald-500"
          />
        </div>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-zinc-800 pt-2">
        <span className="text-sm font-medium text-zinc-300">
          {totalCards > 0 ? (
            <>
              {totalCards} cards → <span className="tabular-nums">{formatCents(perCardCents)}</span>/card
            </>
          ) : (
            "Enter box price + card count"
          )}
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
            disabled={totalCards === 0 || boxCents === 0}
            onClick={() => {
              onApply(perCardCents);
              setOpen(false);
            }}
            className="rounded bg-emerald-500 px-3 py-1 text-xs font-semibold text-zinc-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Use this cost
          </button>
        </div>
      </div>

      <p className="mt-2 text-[11px] leading-relaxed text-zinc-600">
        This is an average across the whole box — real pulls vary a lot (some
        cards are worth far more or less than average). Good as a baseline
        COGS; adjust manually for known high-value singles.
      </p>
    </div>
  );
}
