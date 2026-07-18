"use client";

import { useState } from "react";
import Calculator from "./Calculator";
import LgsComparison from "./LgsComparison";

type Tab = "calculator" | "lgs";

export default function ToolTabs() {
  const [tab, setTab] = useState<Tab>("calculator");

  return (
    <div>
      <div className="mb-4 flex gap-1 rounded-lg border border-zinc-800 bg-zinc-900/60 p-1">
        <TabButton
          active={tab === "calculator"}
          onClick={() => setTab("calculator")}
        >
          Profit calculator
        </TabButton>
        <TabButton active={tab === "lgs"} onClick={() => setTab("lgs")}>
          Online vs. LGS
        </TabButton>
      </div>
      {tab === "calculator" ? <Calculator /> : <LgsComparison />}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded px-3 py-2 text-sm font-medium transition ${
        active
          ? "bg-emerald-500 text-zinc-950"
          : "text-zinc-400 hover:text-zinc-200"
      }`}
    >
      {children}
    </button>
  );
}
