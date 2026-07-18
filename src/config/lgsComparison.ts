/**
 * Rough, editable defaults for the "sell online vs. trade to a local game
 * store" comparison. LGS offers vary enormously by store, demand, and
 * negotiation — these are commonly-cited ballpark percentages of market
 * value, not a real quote. Always editable in the UI.
 *
 * Commonly-cited ranges: cash ~40-60% of market value, store credit
 * ~50-70% (often ~10-20 points higher than cash at the same store).
 * High-demand tournament staples trend toward the top of the range;
 * niche/rotating cards trend lower. Defaults here are the range midpoints.
 * Two things this simple % model does NOT capture — call out separately
 * in the UI rather than baking into the default:
 * - Bulk cards (below ~$2-5 market value) are usually priced flat per-card
 *   or by weight/box, not as a % of market value, and it's much lower.
 * - Condition matters a lot — these percentages assume Near Mint.
 */
export const LGS_DEFAULTS = {
  /** Typical cash buy price as % of market value (range: ~40-60%). */
  cashPct: 50,
  /** Typical store-credit trade-in value as % of market value (range: ~50-70%). */
  creditPct: 60,
} as const;
