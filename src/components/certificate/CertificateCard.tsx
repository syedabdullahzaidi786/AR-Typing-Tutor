"use client";

import { useRef, useState, useEffect } from "react";
import { Download, Eye } from "lucide-react";
import Button from "@/components/ui/Button";
import { formatDate, getLanguageLabel } from "@/lib/utils";

interface CertificateCardProps {
  certificate: {
    certificateNumber: string;
    issuedAt: Date | string;
    user: { name: string };
    test: {
      language: string;
      wpm: number;
      accuracy: number;
      duration: number;
    };
  };
}

export default function CertificateCard({ certificate }: CertificateCardProps) {
  const certRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [preview, setPreview] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://artyping.vercel.app";
  const verifyUrl = `${baseUrl}/verify/${certificate.certificateNumber}`;

  // Generate QR code on mount
  useEffect(() => {
    import("qrcode").then((QRCode) => {
      QRCode.toDataURL(verifyUrl, {
        width: 120,
        margin: 1,
        color: { dark: "#1e1b4b", light: "#ffffff" },
        errorCorrectionLevel: "H",
      }).then(setQrDataUrl);
    });
  }, [verifyUrl]);

  const handleDownload = async () => {
    if (!certRef.current) return;
    setDownloading(true);
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(certRef.current, {
        quality: 1,
        pixelRatio: 3, // High resolution for A4 print quality
        cacheBust: true,
        style: { display: "block" },
      });
      const link = document.createElement("a");
      link.download = `AR-Certificate-${certificate.certificateNumber}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  const wpm = Math.round(certificate.test.wpm);
  const accuracy = Number(certificate.test.accuracy).toFixed(1);
  const lang = getLanguageLabel(certificate.test.language);
  const issuedDate = formatDate(certificate.issuedAt);
  const name = certificate.user.name;
  const certNo = certificate.certificateNumber;

  return (
    <div className="space-y-4">
      {/* Preview toggle */}
      <div className="flex gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setPreview(!preview)}
          className="flex-1"
        >
          <Eye className="w-4 h-4 mr-2" />
          {preview ? "Hide Preview" : "Preview Certificate"}
        </Button>
        <Button onClick={handleDownload} loading={downloading} className="flex-1">
          <Download className="w-4 h-4 mr-2" />
          Download PNG
        </Button>
      </div>

      {/* Certificate — always rendered for download, shown/hidden for preview */}
      <div
        className={`transition-all duration-300 ${
          preview ? "block" : "hidden"
        }`}
      >
        <p className="text-xs text-gray-500 mb-2 text-center">
          A4 Preview (actual download is high-resolution)
        </p>
      </div>

      {/* The actual certificate div — always in DOM for html-to-image */}
      <div className={preview ? "w-full overflow-x-auto scrollbar-thin pb-4" : ""}>
        <div
          style={{
            position: preview ? "relative" : "absolute",
            left: preview ? "auto" : "-9999px",
            top: preview ? "auto" : "-9999px",
            width: "794px", // A4 at 96dpi
            minHeight: "562px",
          }}
        >
        <div
          ref={certRef}
          style={{
            width: "794px",
            minHeight: "562px",
            background: "linear-gradient(135deg, #fefce8 0%, #ffffff 40%, #fefce8 100%)",
            fontFamily: "'Georgia', 'Times New Roman', serif",
            position: "relative",
            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          {/* ── Outer gold border ── */}
          <div
            style={{
              position: "absolute",
              inset: "10px",
              border: "3px solid #b8860b",
              pointerEvents: "none",
            }}
          />
          {/* ── Inner thin border ── */}
          <div
            style={{
              position: "absolute",
              inset: "16px",
              border: "1px solid #d4af37",
              pointerEvents: "none",
            }}
          />

          {/* ── Corner ornaments ── */}
          {[
            { top: 8, left: 8 },
            { top: 8, right: 8 },
            { bottom: 8, left: 8 },
            { bottom: 8, right: 8 },
          ].map((pos, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 40,
                height: 40,
                ...pos,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                color: "#b8860b",
                lineHeight: 1,
              }}
            >
              ✦
            </div>
          ))}

          {/* ── Watermark ── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              zIndex: 0,
            }}
          >
            <div
              style={{
                fontSize: 110,
                fontWeight: 900,
                color: "rgba(180,150,0,0.06)",
                transform: "rotate(-30deg)",
                whiteSpace: "nowrap",
                letterSpacing: 8,
                userSelect: "none",
              }}
            >
              AR TYPING TUTOR
            </div>
          </div>

          {/* ── Main content ── */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              padding: "40px 60px 32px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minHeight: "562px",
            }}
          >
            {/* Header logos row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                marginBottom: 6,
              }}
            >
              {/* Left seal */}
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(124,58,237,0.4)",
                  flexShrink: 0,
                }}
              >
                <span style={{ color: "#fff", fontSize: 22, fontWeight: 700 }}>
                  AR
                </span>
              </div>

              {/* Title block */}
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 11,
                    letterSpacing: 5,
                    color: "#7c3aed",
                    fontFamily: "'Arial', sans-serif",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    marginBottom: 2,
                  }}
                >
                  AR Typing Tutor
                </div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#1e1b4b",
                    letterSpacing: 2,
                    textTransform: "uppercase",
                  }}
                >
                  Certificate of Achievement
                </div>
              </div>

              {/* Right seal */}
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #b8860b, #d4af37)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(184,134,11,0.4)",
                  flexShrink: 0,
                }}
              >
                <span style={{ color: "#fff", fontSize: 20 }}>★</span>
              </div>
            </div>

            {/* Gold divider */}
            <div
              style={{
                width: "100%",
                height: 2,
                background:
                  "linear-gradient(to right, transparent, #b8860b, #d4af37, #b8860b, transparent)",
                margin: "10px 0",
              }}
            />

            {/* Presented to */}
            <p
              style={{
                fontSize: 12,
                color: "#6b7280",
                letterSpacing: 3,
                textTransform: "uppercase",
                fontFamily: "'Arial', sans-serif",
                marginBottom: 4,
                marginTop: 8,
              }}
            >
              This is to certify that
            </p>

            {/* Recipient name */}
            <div
              style={{
                fontSize: 42,
                fontWeight: 700,
                color: "#1e1b4b",
                fontFamily: "'Georgia', serif",
                fontStyle: "italic",
                letterSpacing: 1,
                marginBottom: 4,
                textAlign: "center",
                lineHeight: 1.2,
              }}
            >
              {name}
            </div>

            {/* Thin line under name */}
            <div
              style={{
                width: 320,
                height: 1,
                background:
                  "linear-gradient(to right, transparent, #b8860b, transparent)",
                marginBottom: 10,
              }}
            />

            {/* Description */}
            <p
              style={{
                fontSize: 13,
                color: "#374151",
                textAlign: "center",
                maxWidth: 520,
                lineHeight: 1.7,
                fontFamily: "'Arial', sans-serif",
                marginBottom: 16,
              }}
            >
              has successfully demonstrated exceptional typing proficiency and
              passed the official typing assessment conducted by{" "}
              <strong style={{ color: "#1e1b4b" }}>AR Typing Tutor</strong>,
              meeting all required standards of speed and accuracy.
            </p>

            {/* Stats boxes */}
            <div
              style={{
                display: "flex",
                gap: 0,
                marginBottom: 18,
                border: "1.5px solid #d4af37",
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              {[
                { label: "Words Per Minute", value: `${wpm}`, unit: "WPM", color: "#7c3aed" },
                { label: "Accuracy Rate", value: `${accuracy}%`, unit: "Accuracy", color: "#059669" },
                { label: "Language", value: lang, unit: "Tested In", color: "#1e40af" },
                { label: "Duration", value: `${certificate.test.duration}s`, unit: "Test Duration", color: "#b45309" },
              ].map((stat, i, arr) => (
                <div
                  key={stat.label}
                  style={{
                    padding: "12px 22px",
                    textAlign: "center",
                    background: i % 2 === 0 ? "#fffbeb" : "#fefce8",
                    borderRight:
                      i < arr.length - 1 ? "1.5px solid #d4af37" : "none",
                    minWidth: 110,
                  }}
                >
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 800,
                      color: stat.color,
                      fontFamily: "'Arial', sans-serif",
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      marginTop: 3,
                      fontFamily: "'Arial', sans-serif",
                    }}
                  >
                    {stat.unit}
                  </div>
                </div>
              ))}
            </div>

            {/* Gold divider */}
            <div
              style={{
                width: "100%",
                height: 1,
                background:
                  "linear-gradient(to right, transparent, #b8860b, #d4af37, #b8860b, transparent)",
                marginBottom: 16,
              }}
            />

            {/* Footer row: Signature | Seal | QR */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                width: "100%",
                gap: 16,
              }}
            >
              {/* Left: Issue info */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 10,
                    color: "#9ca3af",
                    fontFamily: "'Arial', sans-serif",
                    marginBottom: 2,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  Certificate No.
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#7c3aed",
                    fontFamily: "'Courier New', monospace",
                    fontWeight: 700,
                    letterSpacing: 1,
                    marginBottom: 8,
                  }}
                >
                  {certNo}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "#9ca3af",
                    fontFamily: "'Arial', sans-serif",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    marginBottom: 2,
                  }}
                >
                  Date of Issue
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#1e1b4b",
                    fontFamily: "'Arial', sans-serif",
                    fontWeight: 600,
                  }}
                >
                  {issuedDate}
                </div>
              </div>

              {/* Center: Official seal + signature */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {/* Seal */}
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    border: "3px solid #b8860b",
                    background:
                      "radial-gradient(circle, #fffbeb 60%, #fef3c7 100%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 0 2px #d4af37, 0 2px 8px rgba(0,0,0,0.15)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 8,
                      color: "#b8860b",
                      fontWeight: 700,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      fontFamily: "'Arial', sans-serif",
                      textAlign: "center",
                      lineHeight: 1.3,
                    }}
                  >
                    OFFICIAL
                    <br />
                    <span style={{ fontSize: 16 }}>★</span>
                    <br />
                    SEAL
                  </div>
                </div>
                {/* Signature line */}
                <div
                  style={{
                    width: 120,
                    borderTop: "1.5px solid #374151",
                    paddingTop: 4,
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 16,
                      color: "#1e1b4b",
                      fontFamily: "'Georgia', serif",
                      fontStyle: "italic",
                      lineHeight: 1,
                    }}
                  >
                    AR Typing
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: "#6b7280",
                      fontFamily: "'Arial', sans-serif",
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      marginTop: 2,
                    }}
                  >
                    Authorized Signatory
                  </div>
                </div>
              </div>

              {/* Right: QR Code */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 4,
                }}
              >
                {qrDataUrl && (
                  <div
                    style={{
                      padding: 6,
                      background: "#fff",
                      border: "1.5px solid #d4af37",
                      borderRadius: 6,
                      display: "inline-block",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qrDataUrl}
                      alt="QR Code"
                      width={80}
                      height={80}
                      style={{ display: "block" }}
                    />
                  </div>
                )}
                <div
                  style={{
                    fontSize: 9,
                    color: "#9ca3af",
                    fontFamily: "'Arial', sans-serif",
                    textAlign: "right",
                    lineHeight: 1.4,
                  }}
                >
                  Scan to verify
                  <br />
                  authenticity
                </div>
              </div>
            </div>

            {/* Bottom strip */}
            <div
              style={{
                marginTop: 14,
                width: "100%",
                background: "linear-gradient(135deg, #1e1b4b, #4f46e5)",
                borderRadius: 4,
                padding: "6px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  color: "#c4b5fd",
                  fontSize: 9,
                  fontFamily: "'Arial', sans-serif",
                  letterSpacing: 1,
                }}
              >
                AR TYPING TUTOR — OFFICIAL CERTIFICATE
              </span>
              <span
                style={{
                  color: "#c4b5fd",
                  fontSize: 9,
                  fontFamily: "'Arial', sans-serif",
                  letterSpacing: 1,
                }}
              >
                Verify: {verifyUrl}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
