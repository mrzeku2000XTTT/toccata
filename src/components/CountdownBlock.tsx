import { useEffect, useState } from "react";
import { cn } from "../lib/utils";

const TARGET_DATE = new Date("2026-06-05T00:00:00Z").getTime();

export function CountdownBlock({ className }: { className?: string }) {
  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, TARGET_DATE - Date.now()));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(Math.max(0, TARGET_DATE - Date.now()));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const d = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const h = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
  const m = Math.floor((timeLeft / 1000 / 60) % 60);
  const s = Math.floor((timeLeft / 1000) % 60);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className={cn("flex flex-col items-end", className)}>
      <span className="text-[10px] uppercase tracking-[0.2em] text-brand-primary/60 hidden sm:block">fork activation countdown</span>
      <div className="font-mono text-xl tracking-widest text-brand-bright">
        {pad(d)}:{pad(h)}:{pad(m)}:{pad(s)}
      </div>
    </div>
  );
}
