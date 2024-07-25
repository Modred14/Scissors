import React, { useState } from 'react';
import QRCode from 'qrcode.react';

const QRCodeGenerator: React.FC = () => {
  const [longUrl, setLongUrl] = useState('');
  const [color, setColor] = useState('#000000'); // default color black
  const [logo, setLogo] = useState<string | null>(null);

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

  return (
    <div>
      <input
        type="text"
        value={longUrl}
        onChange={(e) => setLongUrl(e.target.value)}
        placeholder="Enter URL"
      />
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        placeholder="Choose Color"
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleLogoChange}
        placeholder="Choose Logo Image"
      />
      {longUrl && (
        <QRCode
          value={longUrl}
          size={200}
          fgColor={color}
          imageSettings={
            logo
              ? {
                  src: logo,
                  x: null,
                  y: null,
                  height: 40,
                  width: 40,
                  excavate: true,
                }
              : undefined
          }
        />
      )}
    </div>
  );
};

export default QRCodeGenerator;
