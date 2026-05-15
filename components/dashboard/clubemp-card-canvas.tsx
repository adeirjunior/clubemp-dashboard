"use client";

import { createElement, useEffect, useId, useState } from "react";

type ClubempCardCanvasProps = {
  name: string;
  type: string;
  code: string;
  site: string;
  qrCodeUrl?: string;
  logoUrl?: string;
};

export function ClubempCardCanvas({
  name,
  type,
  code,
  site,
  qrCodeUrl = "",
  logoUrl = "/assets/img/app-icon.png",
}: ClubempCardCanvasProps) {
  const scriptId = useId().replace(/:/g, "");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (customElements.get("clubemp-card")) {
      setReady(true);
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="/assets/js/clubemp-card.js"]',
    );
    if (existingScript) {
      existingScript.addEventListener("load", () => setReady(true), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.id = `clubemp-card-${scriptId}`;
    script.src = "/assets/js/clubemp-card.js";
    script.async = true;
    script.onload = () => setReady(true);
    document.body.appendChild(script);
  }, [scriptId]);

  return (
    <div className="relative min-h-[220px] w-full">
      {!ready ? (
        <div className="grid aspect-[14/9] w-full place-items-center rounded-[2rem] border border-primary/20 bg-[#100b05] text-primary shadow-2xl">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : null}
      {ready
        ? createElement("clubemp-card", {
            name,
            type,
            "card-code": code,
            site,
            "logo-src": logoUrl,
            "qr-code": qrCodeUrl,
          })
        : null}
    </div>
  );
}
