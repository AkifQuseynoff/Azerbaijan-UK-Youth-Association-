import { useEffect, useState } from "react";
import { LogoMark } from "../brand/Logo";
import Skyline from "../brand/Skyline";

/**
 * A cover picture that never looks broken. With no picture, or when the picture cannot be loaded,
 * it shows a quiet dawn scene with the logo. The parent decides the shape (aspect ratio) and size.
 */
export default function CoverImage({ src, alt = "", imgClassName = "" }: { src?: string | null; alt?: string; imgClassName?: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  if (!src || failed) {
    return (
      <div className="relative grid h-full w-full place-items-center overflow-hidden bg-gradient-to-br from-mist via-white to-[#f9e8df]" role={alt ? "img" : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true}>
        <Skyline className="absolute bottom-0 left-1/2 h-auto w-[170%] -translate-x-1/2" nearFill="#1b4793" nearOpacity={0.14} farOpacity={0.05} towers="same" />
        <LogoMark className="relative h-[34%] min-h-12 w-auto" decorative />
      </div>
    );
  }
  return <img src={src} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} className={imgClassName || "h-full w-full object-cover"} />;
}
