import { PREWRITTEN_TRADES } from "../data/tradesList";

export default function LibraryPage() {
  return (
    <div className="px-6 py-24 max-w-5xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold mb-12">Trade Library</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {PREWRITTEN_TRADES.map(trade => (
          <div key={trade} className="p-6 bg-brand-surface border border-white/5 rounded-xl hover:border-brand-primary/40 transition-colors cursor-pointer group">
            <h3 className="text-lg font-bold group-hover:text-brand-primary transition-colors capitalize">{trade}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
