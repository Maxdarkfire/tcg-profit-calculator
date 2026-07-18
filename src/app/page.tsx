import Calculator from "@/components/Calculator";
import EmailSignup from "@/components/EmailSignup";

export default function Home() {
  return (
    <main className="mx-auto max-w-xl px-4 py-10 sm:py-16">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          TCGplayer Profit Calculator
        </h1>
        <p className="mt-3 text-zinc-400">
          Fees, processing, shipping, card cost — see what you{" "}
          <span className="font-semibold text-zinc-200">actually</span> make on
          a sale.
        </p>
      </header>

      <Calculator />

      <section className="mt-12 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-7">
        <h2 className="text-xl font-semibold">
          I&apos;m building a profit tracker for small TCG sellers
        </h2>
        <p className="mb-4 mt-2 text-sm leading-relaxed text-zinc-400">
          Upload your packing slips, get your true monthly P&amp;L, best and
          worst sellers, and a tax-ready export. Built by a seller, for
          sellers. Get the beta:
        </p>
        <EmailSignup />
      </section>

      <footer className="mt-10 text-center text-xs text-zinc-600">
        Not affiliated with TCGplayer. Estimates only.
      </footer>
    </main>
  );
}
