ts/**
 * All fee rates live HERE and only here.
 *
 * Rates apply to standard Marketplace Seller accounts (Levels 1-4), which is
 * what a small/hobby seller has. Pro/Sync accounts pay 9.25% + a 2.5% Pro fee
 * instead — not modeled here. TCGplayer Direct has a separate fee structure
 * (flat per-item fee) — also not modeled here.
 *
 * Verified against a real packing slip: $2.65 order (4x $0.29 cards +
 * $1.49 shipping) charged exactly $0.65 in fees / $2.00 net at these rates.
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
