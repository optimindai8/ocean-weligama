import { useEffect, useRef, useState } from "react";

export function TransparentLogo({ src, className }: { src: string; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imgUrl, setImgUrl] = useState<string>(src);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Remove white background (anything very close to white becomes transparent)
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // If it's very white, make it transparent
        if (r > 240 && g > 240 && b > 240) {
          data[i + 3] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setImgUrl(canvas.toDataURL());
    };
  }, [src]);

  return (
    <>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <img src={imgUrl} alt="Logo" className={className} />
    </>
  );
}
