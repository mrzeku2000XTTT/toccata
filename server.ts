import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const DEFAULT_TRADES = [
  ...Array.from({length: 39}).fill(null).map((_, i) => ({
    slug: `trade-${i}`,
    display_name: `Trade ${i}`,
    aliases: [],
    hook: "This is a placeholder hook.",
    act1_title: "Act 1",
    act1_body: "Body 1",
    act1_tag: "Tag 1",
    act2_title: "Act 2",
    act2_body: "Body 2",
    act2_tag: "Tag 2",
    act3_title: "Act 3",
    act3_body: "Body 3",
    act3_tag: "Tag 3",
    category: "other",
    translation_count: 0,
    is_featured: false
  }))
]; // Will populate with real trades shortly

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory cache for trades (pre-seeded + llm generated)
  const tradesCache = new Map<string, any>();
  
  tradesCache.set("chef", {
    slug: "chef",
    display_name: "Chef",
    aliases: ["cook", "baker"],
    hook: "the kitchen is upgrading. new stations, perfect recipes, zero wait time.",
    act1_title: "the new pantry",
    act1_body: "Before, your ingredients had to be shipped in from another building. Now, the flour, sugar, and spices are built right into the main kitchen. Everything is natively available at your fingertips.",
    act1_tag: "= native KRC-20 tokens on L1",
    act2_title: "the smart ticket rail",
    act2_body: "Instead of just reading a ticket, the order rail now understands rules. It automatically knows you can't fire the steak until the salad is plated. You don't need a separate manager checking; the kitchen enforces the timing itself.",
    act2_tag: "= programmable UTXO rules",
    act3_title: "the taste test guarantee",
    act3_body: "You no longer have to eat the whole dish to prove it's cooked correctly. You can provide a tiny, undeniably perfect crumb that proves the entire meal is flawless, instantly.",
    act3_tag: "= Groth16 zero-knowledge verification"
  });

  tradesCache.set("plumber", {
    slug: "plumber",
    display_name: "Plumber",
    aliases: ["pipe fitter"],
    hook: "the water pressure is about to get a massive upgrade.",
    act1_title: "native fixtures",
    act1_body: "Instead of taping attachments onto the end of a faucet, the new pipes have universal, built-in threads for any fixture you want. Everything connects flawlessly right at the source.",
    act1_tag: "= native KRC-20 tokens on L1",
    act2_title: "smart valves",
    act2_body: "The valves now have logic. You can program a valve to only open if the pressure on the other side drops below a certain level. The pipes themselves manage the flow without needing a separate control box.",
    act2_tag: "= programmable UTXO rules",
    act3_title: "the pressure test",
    act3_body: "You don't need to inspect every inch of a mile-long pipeline to know it's solid. You just look at a tiny gauge that mathematically proves every single joint is sealed.",
    act3_tag: "= Groth16 zero-knowledge verification"
  });

  const translationStats = {
    counts: new Map<string, number>(),
    history: [] as any[]
  };

  // Pre-seed
  // (We'll populate it with real data next)

  // API route to get all loaded trades
  app.get("/api/trades", (req, res) => {
    // Only return featured or seed trades for the library
    res.json(Array.from(tradesCache.values()));
  });

  app.post("/api/translate", async (req, res) => {
    try {
      const { tradeInput } = req.body;
      if (!tradeInput) {
        return res.status(400).json({ error: "Missing tradeInput" });
      }

      const normalized = tradeInput.toLowerCase().trim();
      
      // Match existing trade from cache (by slug or display name or alias)
      let foundTrade = null;
      for (const trade of tradesCache.values()) {
        if (
          trade.slug === normalized ||
          trade.display_name.toLowerCase() === normalized ||
          (trade.aliases && trade.aliases.includes(normalized))
        ) {
          foundTrade = trade;
          break;
        }
      }

      const recordTranslation = (tradeSlug: string, isLLM: boolean) => {
        translationStats.counts.set(tradeSlug, (translationStats.counts.get(tradeSlug) || 0) + 1);
        translationStats.history.push({
          trade_slug: tradeSlug,
          user_input: tradeInput,
          timestamp: new Date().toISOString(),
          was_llm_generated: isLLM,
          shared: false
        });
      };

      if (foundTrade) {
        recordTranslation(foundTrade.slug, false);
        return res.json({ trade: foundTrade, source: 'cache' });
      }

      // If not in cache, fallback to LLM
      const prompt = "You are explaining the Kaspa Toccata hard fork (June 5, 2026) to a " + tradeInput + ". The fork has three features:\\n1. Native KRC-20 tokens on Layer 1 (assets become native, no overlays)\\n2. SilverScript + Covenants++ (programmable UTXO rules)\\n3. Groth16 ZK verification (prove without revealing)\\n\\nWrite a 3-act metaphor story in the voice of someone who DOES this trade.\\nEach act maps to one feature. Tone: calm, confident, concrete, lowercase hero lines, no emojis, no hype words ('revolutionary', 'game-changer' are banned).";

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              hook: { type: Type.STRING },
              a1: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  body: { type: Type.STRING },
                  tag: { type: Type.STRING }
                },
                required: ["title", "body", "tag"]
              },
              a2: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  body: { type: Type.STRING },
                  tag: { type: Type.STRING }
                },
                required: ["title", "body", "tag"]
              },
              a3: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  body: { type: Type.STRING },
                  tag: { type: Type.STRING }
                },
                required: ["title", "body", "tag"]
              }
            },
            required: ["hook", "a1", "a2", "a3"]
          }
        }
      });

      const jsonStr = response.text?.trim();
      if (!jsonStr) {
        throw new Error("Empty response from AI");
      }
      
      const parsed = JSON.parse(jsonStr);
      const slug = normalized.replace(/\\s+/g, '-');
      const newTrade = {
        slug: slug,
        display_name: tradeInput,
        aliases: [],
        hook: parsed.hook,
        act1_title: parsed.a1.title,
        act1_body: parsed.a1.body,
        act1_tag: parsed.a1.tag,
        act2_title: parsed.a2.title,
        act2_body: parsed.a2.body,
        act2_tag: parsed.a2.tag,
        act3_title: parsed.a3.title,
        act3_body: parsed.a3.body,
        act3_tag: parsed.a3.tag,
        category: "custom",
        translation_count: 0,
        is_featured: false
      };

      tradesCache.set(slug, newTrade);
      recordTranslation(slug, true);

      res.json({ trade: newTrade, source: 'llm' });

    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on http://localhost:" + PORT);
  });
}

startServer().catch(console.error);
