/**
 * All fee rates live HERE and only here.
 *
 * Rates apply to standard Marketplace Seller accounts (Levels 1-4), which is
 * what a small/hobby seller has. Pro/Sync accounts pay 9.25% + a 2.5% Pro fee
 * instead — not modeled here. TCGplayer Direct has a separate fee structure
 * (flat per-item fee) — also not modeled here. International orders pay a
 * 3.5% transaction fee instead of 2.5% — not modeled here.
 *
 * Per TCGplayer's official fee schedule (help.tcgplayer.com), the Marketplace
 * Commission Fee is "order subtotal x 10.75%" and the Transaction Fee is
 * "(order total [items + shipping + tax]) x 2.5% + $0.30". With no sales tax,
 * subtotal and total both equal items + shipping, which is what's modeled
 * here — verified against a real packing slip: $2.65 order (4x $0.29 cards +
 * $1.49 shipping) charged exactly $0.65 in fees / $2.00 net at these rates.
 *
 * Known simplifications (not modeled):
 * - TCGplayer uses Bankers Rounding (round-half-to-even); this app uses
 *   standard rounding. Differences are at most $0.01 per fee line.
 * - Commission fee is capped at $75 per product sold — irrelevant below
 *   ~$700 per card at these rates, so not implemented.
 * - Sales tax is NOT modeled, and this is a real gap, not just a theoretical
 *   one. Confirmed against a $107.65 order (CA buyer, taxable state): actual
 *   fee was $14.79 vs. this formula's $14.56 — a 23-cent gap consistent with
 *   ~$9 of sales tax being included in TCGplayer's transaction-fee base
 *   ("items + shipping + tax" per their docs). Sellers can't see the tax
 *   amount TCGplayer used on the order page, so there's no reliable input to
 *   add for it — estimates will run low on taxable, higher-value orders.
 *
 * All money math elsewhere in the app is integer cents.
 */
export const FEES = {
  /** Marketplace commission, applied to (item subtotal + shipping charged).
   *  Raised from 10.25% to 10.75% effective Feb 10, 2026. */
  marketplaceRate: 0.1075,
  /** Payment processing rate, applied to (item subtotal + shipping charged). */
  processingRate: 0.025,
  /** Flat payment processing fee per order, in cents. */
  processingFlatCents: 30,
  /** Date a human last confirmed these against TCGplayer's published fees. */
  lastVerified: "2026-07-18 (verified via help.tcgplayer.com + cross-checked against a real order)",
} as const;
