/** Integer-cents money helpers. Never use floats for money math. */

/** Parse a user-entered dollar string ("12.34") into integer cents. */
export function parseDollarsToCents(input: string): number {
  const cleaned = input.replace(/[$,\s]/g, "");
  if (cleaned === "" || cleaned === ".") return 0;
  const negative = cleaned.startsWith("-");
  const [whole = "0", frac = ""] = cleaned.replace("-", "").split(".");
  const cents =
    (parseInt(whole || "0", 10) || 0) * 100 +
    (parseInt((frac + "00").slice(0, 2), 10) || 0);
  return negative ? -cents : cents;
}

/** Format integer cents as a dollar string, e.g. 1234 -> "$12.34". */
export function formatCents(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  return `${sign}$${Math.floor(abs / 100)}.${String(abs % 100).padStart(2, "0")}`;
}

/** Round a float (rate * cents) to integer cents, half up. */
export function roundCents(value: number): number {
  return Math.round(value);
}
