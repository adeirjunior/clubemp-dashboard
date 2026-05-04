"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    BarcodeDetector?: {
      new (options?: {
        formats?: string[];
      }): {
        detect: (
          source: HTMLVideoElement | ImageBitmap,
        ) => Promise<Array<{ rawValue?: string }>>;
      };
    };
  }
}

function normalizePaymentTarget(rawValue: unknown) {
  const value = String(rawValue || "").trim();
  if (!value) {
    return "";
  }

  try {
    const parsed = new URL(value, window.location.origin);
    const match = parsed.pathname.match(/\/pagamento\/([A-Za-z0-9\-_]+)/);
    if (match) {
      return `/pagamento/${encodeURIComponent(match[1])}`;
    }
  } catch {
    // Continua para tratar como token simples.
  }

  const tokenMatch = value.match(/[A-Za-z0-9\-_]{20,}/);
  return tokenMatch ? `/pagamento/${encodeURIComponent(tokenMatch[0])}` : "";
}

export function PaymentScanner() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number | null>(null);
  const detectorRef = useRef<{
    detect: (
      source: HTMLVideoElement | ImageBitmap,
    ) => Promise<Array<{ rawValue?: string }>>;
  } | null>(null);
  const [status, setStatus] = useState(
    "Use câmera em HTTPS ou localhost. Se o navegador não suportar leitura nativa, use imagem ou campo manual.",
  );
  const [manualError, setManualError] = useState("");
  const [fileStatus, setFileStatus] = useState("");
  const [manualValue, setManualValue] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  function stopScan() {
    setIsScanning(false);
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }

  function openPayment(rawValue: unknown) {
    const target = normalizePaymentTarget(rawValue);
    if (!target) {
      setStatus(
        "QR Code lido, mas não parece ser uma cobrança Clubemp válida.",
      );
      return false;
    }

    window.location.href = target;
    return true;
  }

  useEffect(() => {
    return () => {
      setIsScanning(false);
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      if (streamRef.current) {
        for (const track of streamRef.current.getTracks()) {
          track.stop();
        }
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  async function scanLoop() {
    if (
      !isScanning ||
      !detectorRef.current ||
      !videoRef.current ||
      videoRef.current.readyState < 2
    ) {
      frameRef.current = requestAnimationFrame(scanLoop);
      return;
    }

    try {
      const codes = await detectorRef.current.detect(videoRef.current);
      if (codes.length > 0 && openPayment(codes[0]?.rawValue || "")) {
        stopScan();
        return;
      }
    } catch {
      setStatus(
        "Não foi possível ler a câmera neste navegador. Use imagem ou campo manual.",
      );
      stopScan();
      return;
    }

    frameRef.current = requestAnimationFrame(scanLoop);
  }

  async function startScan() {
    if (!window.BarcodeDetector) {
      setStatus(
        "Este navegador não suporta leitura nativa de QR Code. Use imagem ou campo manual.",
      );
      return;
    }

    try {
      detectorRef.current = new window.BarcodeDetector({
        formats: ["qr_code"],
      });
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: { ideal: "environment" } },
      });
      if (!videoRef.current) {
        return;
      }

      videoRef.current.srcObject = streamRef.current;
      await videoRef.current.play();
      setIsScanning(true);
      setStatus("Câmera ativa. Aponte para o QR Code da cobrança.");
      frameRef.current = requestAnimationFrame(scanLoop);
    } catch {
      setStatus(
        "Não foi possível abrir a câmera. Verifique a permissão do navegador.",
      );
    }
  }

  async function handleFileChange(file: File | null) {
    if (!file) {
      return;
    }
    if (!window.BarcodeDetector) {
      setFileStatus(
        "Seu navegador não suporta leitura de imagem. Cole o link manualmente.",
      );
      return;
    }

    try {
      const bitmap = await createImageBitmap(file);
      const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
      const codes = await detector.detect(bitmap);
      if (codes.length === 0) {
        setFileStatus("Nenhum QR Code encontrado na imagem.");
        return;
      }
      openPayment(codes[0]?.rawValue || "");
    } catch {
      setFileStatus("Não foi possível ler esta imagem.");
    }
  }

  return (
    <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
      <article className="rounded-3xl border border-base-300 bg-base-100 shadow-sm">
        <div className="border-b border-base-300 bg-gradient-to-br from-primary/15 via-base-100 to-secondary/10 p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-base-content/55">
            Pagamento por QR Code
          </p>
          <h2 className="mt-1 text-2xl font-black">
            Aponte a câmera para o QR Code da cobrança
          </h2>
          <p className="mt-2 text-sm text-base-content/70">
            Quando o código for lido, você será direcionado para a área de
            pagamento segura com Stripe.
          </p>
        </div>

        <div className="p-5">
          <div className="relative overflow-hidden rounded-3xl border border-base-300 bg-black">
            <video
              ref={videoRef}
              className="aspect-video w-full bg-black object-cover"
              muted
              playsInline
            />
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <div className="h-44 w-44 rounded-3xl border-4 border-primary/80 shadow-[0_0_0_999px_rgba(0,0,0,.35)]" />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              className="btn btn-primary"
              onClick={startScan}
              type="button"
            >
              Abrir câmera
            </button>
            <button
              className="btn btn-outline"
              disabled={!isScanning}
              onClick={stopScan}
              type="button"
            >
              Parar
            </button>
          </div>

          <p className="mt-3 text-sm text-base-content/65">{status}</p>
        </div>
      </article>

      <aside className="space-y-4">
        <article className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <h3 className="font-black">Inserir link manualmente</h3>
          <p className="mt-1 text-sm text-base-content/70">
            Cole o link completo do QR Code ou apenas o token da cobrança.
          </p>
          <form
            className="mt-4 space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              setManualError("");
              if (!openPayment(manualValue)) {
                setManualError("Informe um link ou token de cobrança válido.");
              }
            }}
          >
            <label className="form-control">
              <span className="label-text font-semibold">Link ou código</span>
              <input
                autoComplete="off"
                className="input input-bordered"
                onChange={(event) => setManualValue(event.currentTarget.value)}
                placeholder="https://.../pagamento/..."
                value={manualValue}
              />
            </label>
            <button className="btn btn-primary w-full" type="submit">
              Abrir pagamento
            </button>
            {manualError ? (
              <p className="text-sm text-error">{manualError}</p>
            ) : null}
          </form>
        </article>

        <article className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <h3 className="font-black">Ler imagem salva</h3>
          <p className="mt-1 text-sm text-base-content/70">
            Selecione uma imagem do QR Code se recebeu a cobrança por WhatsApp
            ou e-mail.
          </p>
          <label className="btn btn-outline mt-4 w-full">
            Escolher imagem
            <input
              accept="image/*"
              className="hidden"
              onChange={(event) =>
                handleFileChange(event.currentTarget.files?.[0] || null)
              }
              type="file"
            />
          </label>
          {fileStatus ? (
            <p className="mt-3 text-sm text-base-content/65">{fileStatus}</p>
          ) : null}
        </article>
      </aside>
    </section>
  );
}
