import React, { useState, useRef } from "react";
import QRCode from "qrcode.react";
import html2canvas from "html2canvas";

const QrCodeGenerator: React.FC = () => {
  const [url, setUrl] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [generatedQrCode, setGeneratedQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setLogo(reader.result as string);
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleGenerateQrCode = async () => {
    if (qrRef.current) {
      try {
        setLoading(true);
        const canvas = await html2canvas(qrRef.current);
        const qrImage = canvas.toDataURL("image/png");
        setGeneratedQrCode(qrImage);
        setLoading(false);
      } catch (err) {
        console.error("Failed to generate QR code image", err);
        setLoading(false);
      }
    }
  };

  const handleDownloadQrCode = () => {
    if (generatedQrCode) {
      const link = document.createElement("a");
      link.href = generatedQrCode;
      link.download = "qr_code.png";
      link.click();
    }
  };

  return (
    <div>
      <h1>QR Code Generator</h1>
      <input
        type="text"
        value={url}
        onChange={handleUrlChange}
        placeholder="Enter URL for QR Code"
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleLogoChange}
        data-testid="logo-upload"
      />
      <div ref={qrRef} style={{ margin: "20px 0" }}>
        <QRCode
          value={url || "scissors.netlify.app"}
          size={150}
          fgColor="#000"
          level="H"
          includeMargin={true}
          imageSettings={
            logo
              ? {
                  src: logo,
                  x: undefined,
                  y: undefined,
                  height: 40,
                  width: 40,
                  excavate: true,
                }
              : undefined
          }
        />
      </div>
      <button onClick={handleGenerateQrCode} disabled={loading}>
        {loading ? "Generating..." : "Generate QR Code"}
      </button>
      {generatedQrCode && (
        <button onClick={handleDownloadQrCode}>Download QR Code</button>
      )}
    </div>
  );
};

export default QrCodeGenerator;
