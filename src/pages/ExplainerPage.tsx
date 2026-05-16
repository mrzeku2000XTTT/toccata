export default function ExplainerPage() {
  return (
    <div className="px-6 py-24 max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold mb-12">The Fork Explainer</h1>
      <div className="prose prose-invert prose-lg max-w-none space-y-12">
        <section className="bg-brand-surface p-8 rounded-2xl border border-white/5">
          <h2 className="text-2xl text-brand-primary font-mono mb-4">I. Native KRC-20 (Layer 1)</h2>
          <p className="text-brand-text/80">Instead of tokens living in secondary indexers or "colored coins" hacks, Kaspa Toccata lifts token issuance directly onto the foundational layer. The network processes tokens with the same speed, parallelization, and zero-fee mechanics as pure KAS. It is no longer an overlay; the chain structurally understands the asset.</p>
        </section>

        <section className="bg-brand-surface p-8 rounded-2xl border border-white/5">
          <h2 className="text-2xl text-brand-primary font-mono mb-4">II. SilverScript + Covenants++</h2>
          <p className="text-brand-text/80">SilverScript introduces programmable UTXOs to a DAG structure. It allows you to build rules into Kaspa without the overhead of EVM state bloat. Funds can be locked, governed by spending conditions, or configured for decentralized exchanges locally without requiring a global virtual machine.</p>
        </section>

        <section className="bg-brand-surface p-8 rounded-2xl border border-white/5">
          <h2 className="text-2xl text-brand-primary font-mono mb-4">III. Groth16 ZK Verification</h2>
          <p className="text-brand-text/80">Kaspa will natively verify Groth16 Zero-Knowledge proofs. This means external systems can compress millions of computations into a tiny cryptographic proof, and the Kaspa Layer 1 can cheaply verify that the computation was honest without actually doing the work. This cracks open true interoperability and rollups.</p>
        </section>

        <div className="mt-16 p-8 bg-brand-primary/10 border border-brand-primary/30 rounded-2xl">
          <h3 className="text-xl font-bold mb-2">Notice for Holders</h3>
          <p className="text-brand-text/80">This is NOT a chain split. No new coin. Same KAS, same address. The upgrade activation is a continuous network consensus event.</p>
        </div>
      </div>
    </div>
  );
}
