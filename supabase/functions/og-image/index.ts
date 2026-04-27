import satori from "npm:satori@0.10.13";
import React from "npm:react@18.2.0";
import { initWasm, Resvg } from "npm:@resvg/resvg-wasm@2.4.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const el = React.createElement;
let wasmReady = false;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!wasmReady) {
      const wasm = await fetch(
        "https://unpkg.com/@resvg/resvg-wasm@2.4.0/index_bg.wasm"
      ).then((r) => r.arrayBuffer());
      await initWasm(wasm);
      wasmReady = true;
    }

    const url = new URL(req.url);
    const title = url.searchParams.get("title") || "Suvojeet Sengupta";
    const category = url.searchParams.get("category") || "";
    const subtitle = url.searchParams.get("subtitle") || "";

    const [fontRegular, fontBold] = await Promise.all([
      fetch("https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2").then((r) => r.arrayBuffer()),
      fetch("https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFufAZ9hiJ-Ek-_EeA.woff2").then((r) => r.arrayBuffer()),
    ]);

    const fontSize = title.length > 70 ? 48 : title.length > 40 ? 58 : 68;
    const titleFontSize = subtitle ? Math.min(fontSize, 62) : fontSize;

    const element = el("div", {
      style: {
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column",
        background: "#0a0a0a",
        padding: "60px 80px 0px",
        position: "relative",
        overflow: "hidden",
      },
    },
      // Radial glow top-right
      el("div", { style: { position: "absolute", top: "-140px", right: "-140px", width: "520px", height: "520px", borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.22) 0%, rgba(249,115,22,0.06) 50%, transparent 70%)" } }),
      // Dot grid overlay
      el("div", { style: { position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(249,115,22,0.06) 1px, transparent 1px)", backgroundSize: "40px 40px" } }),
      // Branding header
      el("div", { style: { display: "flex", alignItems: "center", gap: "12px", position: "relative" } },
        el("div", { style: { width: "4px", height: "34px", background: "#f97316", borderRadius: "2px" } }),
        el("span", { style: { color: "#f97316", fontSize: "19px", fontWeight: 700, letterSpacing: "0.15em", fontFamily: "Inter" } }, "SUVOJEET SENGUPTA"),
      ),
      // Category badge or spacer
      el("div", { style: { display: "flex", marginTop: "32px", position: "relative" } },
        category
          ? el("div", { style: { background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.35)", borderRadius: "20px", padding: "6px 20px", color: "#f97316", fontSize: "16px", fontWeight: 600, letterSpacing: "0.08em" } }, category.toUpperCase())
          : el("div", { style: { height: "32px" } }),
      ),
      // Title + subtitle
      el("div", { style: { flex: 1, display: "flex", alignItems: "center", position: "relative" } },
        el("div", { style: { display: "flex", flexDirection: "column", gap: "18px" } },
          el("div", { style: { color: "white", fontSize: `${titleFontSize}px`, fontWeight: 800, lineHeight: 1.15, maxWidth: "980px", letterSpacing: "-0.025em", fontFamily: "Inter" } }, title),
          subtitle
            ? el("div", { style: { color: "#aaaaaa", fontSize: "26px", fontWeight: 400, letterSpacing: "0.02em", maxWidth: "980px", fontFamily: "Inter" } }, subtitle)
            : null,
        ),
      ),
      // Footer
      el("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "28px", position: "relative" } },
        el("div", { style: { display: "flex", alignItems: "center", gap: "10px" } },
          el("div", { style: { width: "28px", height: "28px", borderRadius: "50%", background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)", display: "flex", alignItems: "center", justifyContent: "center" } },
            el("div", { style: { width: "8px", height: "8px", borderRadius: "50%", background: "#f97316" } }),
          ),
          el("span", { style: { color: "#888", fontSize: "20px", fontWeight: 400, fontFamily: "Inter" } }, "suvojeetsengupta.in"),
        ),
        el("div", { style: { display: "flex", gap: "6px", alignItems: "flex-end" } },
          ...[4, 6, 8, 10, 14].map((size, i) =>
            el("div", { key: i, style: { width: `${size}px`, height: `${size}px`, borderRadius: "50%", background: i === 4 ? "#f97316" : `rgba(249,115,22,${0.12 + i * 0.1})` } })
          ),
        ),
      ),
      // Bottom gradient bar
      el("div", { style: { position: "absolute", bottom: 0, left: 0, width: "100%", height: "6px", background: "linear-gradient(90deg, #f97316 0%, #ea580c 50%, #c2410c 100%)" } }),
    );

    const svg = await satori(element, {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Inter", data: fontRegular, weight: 400, style: "normal" },
        { name: "Inter", data: fontBold, weight: 800, style: "normal" },
      ],
    });

    const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } });
    const rendered = resvg.render();
    const png = rendered.asPng();

    return new Response(png, {
      headers: {
        ...corsHeaders,
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400, s-maxage=604800",
      },
    });
  } catch (error) {
    console.error("OG image error:", error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
