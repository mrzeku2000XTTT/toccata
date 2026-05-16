export default function AboutPage() {
  return (
    <div className="px-6 py-24 max-w-3xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-bold mb-8">About</h1>
      <div className="prose prose-invert prose-lg">
        <p className="text-brand-text/70">
          This is an educational tool designed to demystify complex blockchain infrastructure upgrades. 
          When Kaspa upgrades to the Toccata hard fork (Crescendo phase begins May 2025, Toccata in June 2026), 
          the way the network handles assets and logic fundamentally changes. 
          We believe technology is best understood when translated into the metaphors of our everyday lives.
        </p>
        <div className="h-px bg-white/10 my-8" />
        <p className="text-sm text-brand-text/50 uppercase tracking-widest font-mono">Disclaimer</p>
        <p className="text-sm text-brand-text/50 mt-2">
          Independent community tool. See kaspa.org and kas.live for official network parameters.
        </p>
      </div>
    </div>
  );
}
