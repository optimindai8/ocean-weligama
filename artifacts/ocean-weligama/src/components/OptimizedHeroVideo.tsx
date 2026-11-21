import React, { useEffect, useRef, useState } from "react";
import { normalizeAssetUrl } from "@/lib/assetUrl";
import { prefetchVideo } from "@/lib/videoCache";

interface OptimizedHeroVideoProps {
  src: string;
  poster: string;
  className?: string;
  overlayClassName?: string;
  priority?: boolean;
  children?: React.ReactNode;
}

/**
 * OptimizedHeroVideo
 *
 * Provides instant, zero-lag, butter-smooth hero video playback across all pages:
 * 1. Renders the matching high-res poster image instantly (0ms latency, zero black flash).
 * 2. Pre-warms the hardware video decoder in parallel.
 * 3. Seamlessly fades the video in over 400ms once frames are ready.
 * 4. Gracefully recovers from mobile autoplay policies.
 * 5. Uses IntersectionObserver to pause when offscreen, saving CPU, battery, and bandwidth.
 */
export const OptimizedHeroVideo: React.FC<OptimizedHeroVideoProps> = ({
  src,
  poster,
  className = "absolute inset-0 w-full h-full object-cover",
  overlayClassName,
  priority = true,
  children,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);

  const cleanSrc = normalizeAssetUrl(src);
  const cleanPoster = normalizeAssetUrl(poster);

  // Proactively preload this video
  useEffect(() => {
    if (priority && cleanSrc) {
      prefetchVideo(cleanSrc);
    }
  }, [cleanSrc, priority]);

  // Video autoplay watchdog & IntersectionObserver
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !cleanSrc) return;

    let isMounted = true;

    // Ensure audio tracks are strictly muted to guarantee autoplay permission
    video.muted = true;
    video.defaultMuted = true;

    const attemptPlay = async () => {
      try {
        if (video.paused && isMounted) {
          await video.play();
          if (isMounted) setIsPlaying(true);
        }
      } catch {
        // Autoplay restricted (e.g. low power mode) - retry once on user touch/click
        const resumeOnInteraction = () => {
          if (video && video.paused) {
            video.play().catch(() => {});
          }
          window.removeEventListener("touchstart", resumeOnInteraction);
          window.removeEventListener("click", resumeOnInteraction);
          window.removeEventListener("scroll", resumeOnInteraction);
        };
        window.addEventListener("touchstart", resumeOnInteraction, { once: true, passive: true });
        window.addEventListener("click", resumeOnInteraction, { once: true, passive: true });
        window.addEventListener("scroll", resumeOnInteraction, { once: true, passive: true });
      }
    };

    attemptPlay();

    // Pause when out of viewport, resume when in viewport
    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined" && containerRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!video) return;
            if (entry.isIntersecting) {
              if (video.paused) {
                video.play().catch(() => {});
              }
            } else {
              if (!video.paused) {
                video.pause();
              }
            }
          });
        },
        { threshold: 0.15 }
      );
      observer.observe(containerRef.current);
    }

    return () => {
      isMounted = false;
      if (observer) observer.disconnect();
    };
  }, [cleanSrc]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 bg-slate-950 overflow-hidden">
      {/* 1. Instant Poster Layer (Always rendered immediately, zero flash) */}
      {cleanPoster && (
        <img
          src={cleanPoster}
          alt=""
          aria-hidden="true"
          loading="eager"
          decoding="async"
          className={`${className} transition-opacity duration-700 ease-out ${
            isPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        />
      )}

      {/* 2. Hardware-accelerated Video Layer */}
      {!hasError && cleanSrc && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          preload="auto"
          onPlaying={() => setIsPlaying(true)}
          onCanPlay={() => {
            if (videoRef.current && videoRef.current.paused) {
              videoRef.current.play().catch(() => {});
            }
          }}
          onError={() => setHasError(true)}
          className={`${className} transition-opacity duration-500 ease-out ${
            isPlaying ? "opacity-100" : "opacity-0"
          }`}
          style={{ WebkitPlaysinline: true, WebkitObjectFit: "cover" } as React.CSSProperties}
        >
          <source src={cleanSrc} type="video/mp4" />
        </video>
      )}

      {/* Optional ambient overlays and children */}
      {children}
      {overlayClassName && <div className={overlayClassName} />}
    </div>
  );
};
