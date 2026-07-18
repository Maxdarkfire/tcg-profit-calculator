/**
 * All fee rates live HERE and only here.
 *
 * !! VERIFY BEFORE LAUNCH !!
 * These are placeholder rates based on commonly cited TCGplayer seller fees.
 * Check the current numbers at https://help.tcgplayer.com (seller fees) and
 * update `lastVerified` when you do.
 *
 * All money math elsewhere in the app is integer cents.
 */
export const FEES = {
  /** Marketplace commission, applied to (item subtotal + shipping charged). */
  marketplaceRate: 0.1025,
  /** Payment processing rate, applied to (item subtotal + shipping charged). */
  processingRate: 0.025,
  /** Flat payment processing fee per order, in cents. */
  processingFlatCents: 30,
  /** Date a human last confirmed these against TCGplayer's published fees. */
  lastVerified: "2026-07-18 (UNVERIFIED placeholder — confirm before launch)",
} as const;
