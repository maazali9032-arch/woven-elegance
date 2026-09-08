import { useEffect, useState } from "react";
import QRCode from "qrcode";

/** Encodes the exact public_url returned by the RPC. Nothing is reconstructed. */
export function QrPanel({ url, label }: { url: string; label?: string | null }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(url, {
      margin: 1,
      width: 480,
      errorCorrectionLevel: "M",
      color: { dark: "#2b1512", light: "#00000000" },
    }).then(
      (dataUrl) => {
        if (active) setSrc(dataUrl);
      },
      () => {
        if (active) setSrc(null);
      },
    );
    return () => {
      active = false;
    };
  }, [url]);

  if (!src) return null;

  return (
    <div className="text-center">
      <div className="mx-auto w-fit rounded-sm border border-zar-burgundy/40 bg-zar-cream/70 p-3">
        <img src={src} alt="QR code linking to this invitation" className="h-40 w-40" />
      </div>
      <p className="mt-4 font-display text-base text-zar-ink/80">
        {label?.trim() || "Scan this QR code to view and share our invitation"}
      </p>
    </div>
  );
}
