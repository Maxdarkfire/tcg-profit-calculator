import { FEES } from "@/config/fees";
import { roundCents } from "@/lib/money";

export interface CalcInput {
  /** Sale price per card, cents */
  salePriceCents: number;
  /** Shipping charged to buyer for the order, cents */
  shippingChargedCents: number;
  /** Your actual shipping cost, cents */
  shippingCostCents: number;
  /** Your cost per card (COGS), cents */
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
  const subtotal = input.salePriceCents * qty;
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
