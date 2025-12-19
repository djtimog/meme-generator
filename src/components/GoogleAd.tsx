import { useEffect } from "react";

interface GoogleAdProps {
  slot: string;
  style?: React.CSSProperties;
}

export default function GoogleAd({ slot, style }: GoogleAdProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{
        display: "block",
        ...style,
      }}
      data-ad-client="ca-pub-6362971907010102"
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
