/**
 * Rough, editable defaults for the "sell online vs. trade to a local game
 * store" comparison. LGS offers vary enormously by store, demand, and
 * negotiation — these are commonly-cited ballpark percentages of market
 * value, not a real quote. Always editable in the UI.
 */
export const LGS_DEFAULTS = {
  /** Typical cash buy price as % of market value. */
  cashPct: 30,
  /** Typical store-credit trade-in value as % of market value. */
  creditPct: 55,
} as const;
