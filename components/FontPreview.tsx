import React, { useEffect, useState } from "react";
import { loadGoogleFont } from "@/lib/fontLoader";

interface FontPreviewProps {
  family: string;
  text?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const FontPreview: React.FC<FontPreviewProps> = ({
  family,
  text = "The quick brown fox jumps over the lazy dog.",
  className = "",
  style = {},
}) => {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    if (family) {
      loadGoogleFont(family);
      // Give a tiny tick for style injection
      const timer = setTimeout(() => setFontLoaded(true), 50);
      return () => clearTimeout(timer);
    }
  }, [family]);

  const fontStyle: React.CSSProperties = {
    ...style,
    fontFamily: fontLoaded ? `'${family}', sans-serif, serif` : "sans-serif",
  };

  return (
    <p className={className} style={fontStyle}>
      {text}
    </p>
  );
};
