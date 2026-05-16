import { useLocation, useParams } from "react-router-dom";
import { TradeResult } from "../data/tradesList";
import { useRef, useState } from "react";
import * as htmlToImage from "html-to-image";
import { Copy, Download, Loader2 } from "lucide-react";

export default function ShareCardPage() {
  const { slug } = useParams();
  const location = useLocation();
  const result: TradeResult | undefined = location.state?.result;
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  if (!result) {
    return <div className="p-8 text-center text-brand-text/50">No translation found to share. Go back and generate one.</div>;
  }

  const shareText = "On June 5, " + result.hook + " @KaspaCurrency Toccata.\\n\\ntoccata.app/share/" + result.slug;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
      });
      const link = document.createElement('a');
      link.download = "toccata-" + result.slug + ".png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate image", err);
    } finally {
      setDownloading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto flex flex-col items-center pb-32">
      <h1 className="text-3xl font-bold mb-2">Share Card</h1>
      <p className="text-brand-text/50 mb-8 max-w-xl text-center">Download this image and post it to spread the word about the Kaspa Toccata hard fork.</p>
      
      {/* Container must be sized properly for 1080x1350 proportion, scaled down for preview */}
      <div className="relative w-full max-w-[400px] aspect-[1080/1350] sm:max-w-[540px]">
        {/* The actual element being captured, absolute positioned to avoid affecting page layout size unexpectedly during capture */}
        <div 
          ref={cardRef} 
          className="absolute inset-0 bg-brand-bg flex flex-col items-center justify-center p-8 sm:p-12 overflow-hidden border border-white/5 rounded-2xl shadow-2xl"
          style={{ width: '1080px', height: '1350px', transform: 'scale(0.37)' /* 400/1080 approx */, transformOrigin: 'top left' }}
        >
          {/* Noise overlay inside the card */}
          <div
            className="pointer-events-none absolute inset-0 z-0 opacity-[0.05] mix-blend-overlay"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%270 0 200 200%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noiseFilter%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.65%27 numOctaves=%273%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noiseFilter)%27/%3E%3C/svg%3E")'
            }}
          />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-primary/[0.15] blur-[100px] rounded-full pointer-events-none" />
          
          <div className="w-full h-full flex flex-col justify-between relative z-10 px-8 py-12">
            <div className="flex flex-col items-center text-center mt-12">
              <div className="text-brand-primary text-3xl font-mono mb-8 uppercase tracking-widest bg-brand-primary/10 px-6 py-2 rounded-full border border-brand-primary/20">{result.display_name} Translate</div>
              <h2 className="text-6xl font-sans font-bold leading-tight mb-16 text-white text-balance">&ldquo;{result.hook}&rdquo;</h2>
              
              <div className="space-y-12 text-left w-full pl-8 border-l-4 border-brand-primary/30">
                <div>
                  <h3 className="text-3xl font-bold font-serif opacity-90 mb-3 text-brand-primary">Act I: {result.act1_title}</h3>
                  <p className="text-3xl text-brand-text/80 leading-snug">{result.act1_body}</p>
                </div>
                <div>
                  <h3 className="text-3xl font-bold font-serif opacity-90 mb-3 text-brand-primary">Act II: {result.act2_title}</h3>
                  <p className="text-3xl text-brand-text/80 leading-snug">{result.act2_body}</p>
                </div>
                <div>
                  <h3 className="text-3xl font-bold font-serif opacity-90 mb-3 text-brand-primary">Act III: {result.act3_title}</h3>
                  <p className="text-3xl text-brand-text/80 leading-snug">{result.act3_body}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-end opacity-60 text-2xl mb-8">
              <span className="font-mono tracking-widest uppercase">toccata.app</span>
              <div className="text-right">
                <span className="font-mono tracking-widest uppercase block text-brand-primary">Kaspa</span>
                <span className="font-mono tracking-widest uppercase block">Toccata Fork</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Make space since the scaled content doesn't affect document flow properly */}
      <div className="h-[100px] sm:h-[180px]" />
      
      {/* Twitter pre-populated text display */}
      <div className="w-full max-w-[540px] mt-8 bg-brand-surface border border-white/10 rounded-xl p-4">
        <div className="text-xs text-brand-text/40 font-mono uppercase tracking-widest mb-2">Suggested Post</div>
        <p className="text-white/90 whitespace-pre-wrap font-sans">{shareText.replace(/\\n/g, '\\n')}</p>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-[540px]">
        <button 
          onClick={handleDownload}
          disabled={downloading}
          className="flex-1 bg-brand-primary text-black px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-bright transition-colors uppercase tracking-widest"
        >
          {downloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
          Download PNG
        </button>
        <button 
          onClick={handleCopy}
          className="flex-1 bg-white/10 text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-colors uppercase tracking-widest"
        >
          <Copy className="w-5 h-5" />
          {copied ? "Copied!" : "Copy Post"}
        </button>
      </div>
    </div>
  );
}
