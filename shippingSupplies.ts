/**
 * Default per-unit supply costs, in cents. These are one seller's real costs
 * (not industry averages) — edit freely if yours differ.
 *
 * Two categories, because they scale differently with order size:
 * - PER_CARD: applied once per card in the order (sleeve, protector, etc).
 * - PACKAGING: applied once per shipment, chosen by order size/value —
 *   USPS caps a single envelope around ~6 cards before it gets kicked back,
 *   and TCGplayer requires tracking at $50+, so bigger/pricier orders need
 *   different packaging entirely, not just "more of the same."
 */
export const PER_CARD_SUPPLIES = {
  pennySleeveCents: 1,
  teamBagCents: 5,
  /** Recommended by TCGplayer, often skipped on cheap/low-value orders. */
  topLoaderCents: 10,
  /** Magnetic/screw-down holder, typically only used on high-value cards
   *  (e.g. singles approaching the $50 tracking threshold). */
  cardProtectorCents: 50,
} as const;

export const PACKAGING_PRESETS = {
  /** ~1-6 cards, no tracking required. */
  singleEnvelope: {
    label: "Standard envelope (up to ~6 cards)",
    packagingCents: 10,
    postageCents: 78,
  },
  /** Higher-value or borderline-$50 orders — bubble mailer + tracking. */
  bubbleMailer: {
    label: "Bubble mailer, tracked",
    packagingCents: 30,
    /** Fluctuates by weight/destination — editable default. */
    postageCents: 550,
  },
  /** Large multi-card orders that won't fit a standard envelope. USPS flat
   *  rate price already includes postage, so this is a single all-in cost. */
  flatRateBox: {
    label: "USPS flat rate small box (bulk order)",
    /** Editable — flat rate pricing changes and varies by box size. */
    allInCents: 1300,
  },
} as const;

/** Applied once per shipment regardless of packaging choice. */
export const LABEL_COST_CENTS = 7;
