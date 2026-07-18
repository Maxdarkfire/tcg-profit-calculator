import { FEES } from "@/config/fees";
import { roundCents } from "@/lib/money";

export type PricingMode = "perCard" | "orderSubtotal";

export interface CalcInput {
  /** Either the price of ONE card (perCard mode, multiplied by quantity) or
   *  the whole order's item subtotal (orderSubtotal mode, used as-is) —
   *  meaning depends on pricingMode. Cents. */
  salePriceCents: number;
  pricingMode: PricingMode;
  /** Shipping charged to buyer for the order, cents */
  shippingChargedCents: number;
  /** Your actual shipping cost, cents */
  shippingCostCents: number;
  /** Your cost per card (COGS), cents — always per-card, always × quantity,
   *  regardless of pricingMode (a multi-card order still has N cards' worth
   *  of cost basis even if you don't know each card's individual sale price). */
  cogsCents: number;
  quantity: number;
}

export interface CalcResult {
  grossCents: number; // subtotal + shipping charged
  marketplaceFeeCents: number;
  processingFeeCents: number;
  totalFeesCents: number;
  netCents: number;
  marginPct: number | null; // null when gross is 0
}

export function calculate(input: CalcInput): CalcResult {
  const qty = Math.max(0, Math.floor(input.quantity));
  const subtotal =
    input.pricingMode === "orderSubtotal"
      ? input.salePriceCents
      : input.salePriceCents * qty;
  const gross = subtotal + input.shippingChargedCents;

  const marketplaceFee = roundCents(gross * FEES.marketplaceRate);
  const processingFee =
    gross > 0
      ? roundCents(gross * FEES.processingRate) + FEES.processingFlatCents
      : 0;

  const totalFees = marketplaceFee + processingFee;
  const net =
    gross - totalFees - input.shippingCostCents - input.cogsCents * qty;

  return {
    grossCents: gross,
    marketplaceFeeCents: marketplaceFee,
    processingFeeCents: processingFee,
    totalFeesCents: totalFees,
    netCents: net,
    marginPct: gross > 0 ? (net / gross) * 100 : null,
  };
}
