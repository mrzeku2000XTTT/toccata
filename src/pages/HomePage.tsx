import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { PREWRITTEN_TRADES, TradeResult } from "../data/tradesList";
import { Loader2 } from "lucide-react";
import { cn } from "../lib/utils";

const EASING = [0.22, 1, 0.36, 1];

export default function HomePage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TradeResult | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleTranslate = async (e?: React.FormEvent, tradeOverride?: string) => {
    e?.preventDefault();
    const query = tradeOverride || input;
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tradeInput: query }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to translate");
      
      setResult(data.trade);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center px-6 lg:px-12 w-full max-w-6xl mx-auto pb-16 pt-8">
      <div className="text-center mt-4">
        <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-bold tracking-[-0.04em] leading-none mb-6 lowercase max-w-4xl mx-auto">
          type your trade. get the upgrade.
        </h1>
        <p className="max-w-2xl text-[16px] text-brand-text/70 leading-relaxed mx-auto">
          Every job has tools, rules, and proofs. The Kaspa Toccata hard fork upgrades all three.
          Tell us what you do — we'll tell you what changes on June 5, 2026.
        </p>
      </div>

      {/* Input Area */}
      <div className="w-full max-w-xl mt-12">
        <form 
          onSubmit={handleTranslate} 
          className="relative flex items-center bg-brand-surface border border-brand-primary/30 rounded-full p-2 focus-within:border-brand-bright transition-all shadow-[0_0_15px_rgba(112,199,186,0.05)]"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. chef, nurse, electrician..."
            className="flex-1 bg-transparent border-none outline-none px-6 py-2 text-lg placeholder-brand-text/30"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-brand-primary hover:bg-brand-bright text-brand-bg font-bold px-8 py-3 rounded-full transition-colors lowercase disabled:opacity-50 disabled:hover:bg-brand-primary min-w-[120px] flex justify-center items-center"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "translate"}
          </button>
        </form>
        
        {/* Chip Rail */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {PREWRITTEN_TRADES.slice(0, 7).map((trade) => {
            const isSelected = input.toLowerCase() === trade;
            return (
              <span
                key={trade}
                onClick={() => {
                  setInput(trade);
                  handleTranslate(undefined, trade);
                }}
                className={cn(
                  "px-3 py-1 rounded-md text-[11px] uppercase tracking-wider cursor-pointer transition-colors",
                  isSelected
                    ? "bg-brand-primary/20 border border-brand-primary text-brand-primary"
                    : "bg-brand-surface border border-brand-primary/20 hover:bg-brand-primary/10 text-brand-text"
                )}
              >
                {trade}
              </span>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl w-full max-w-xl text-center">
          {error}
        </div>
      )}

      {/* Metaphor Results */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div 
            key={result.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center mt-16 w-full"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-medium text-brand-text mb-2 lowercase max-w-3xl leading-tight">&ldquo;{result.hook}&rdquo;</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              {[
                  { act: "I", label: "materials", title: result.act1_title, body: result.act1_body, tag: result.act1_tag },
                  { act: "II", label: "rules", title: result.act2_title, body: result.act2_body, tag: result.act2_tag },
                  { act: "III", label: "proof", title: result.act3_title, body: result.act3_body, tag: result.act3_tag },
              ].map((section, idx) => (
                <motion.div 
                  key={section.act}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.12 }}
                  className="bg-brand-surface border-t-2 border-brand-primary p-6 rounded-b-xl flex flex-col shadow-2xl h-full"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-mono text-brand-primary">ACT {section.act}</span>
                    <span className="text-[10px] uppercase tracking-widest text-brand-text/40">{section.label}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 lowercase">{section.title}</h3>
                  <p className="text-sm text-brand-text/80 leading-relaxed mb-8 flex-1">
                    {section.body}
                  </p>
                  <div className="mt-auto">
                    <div className="bg-brand-bg p-3 rounded border border-brand-primary/10 font-mono text-[10px] text-brand-bright">
                      {section.tag}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 mb-8">
              <button
                onClick={() => navigate("/share/" + result.slug, { state: { result } })}
                className="bg-transparent border border-brand-primary text-brand-primary px-8 py-3 rounded-full font-bold transition-colors shadow-2xl hover:bg-brand-primary hover:text-brand-bg lowercase flex items-center gap-2"
              >
                generate share card
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
