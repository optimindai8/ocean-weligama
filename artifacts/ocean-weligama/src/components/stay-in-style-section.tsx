import { useListRooms } from "@workspace/api-client-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useState, useRef, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* ─────────────────────────────────────────────────────────
   Small self-contained image slider — no shadcn Carousel.
   Two always-visible arrow buttons + dot indicators.
   ───────────────────────────────────────────────────────── */
function RoomImageSlider({ images, roomName }: { images: string[]; roomName: string }) {
  const [current, setCurrent] = useState(0);

  const goPrev = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    },
    [images.length]
  );

  const goNext = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    },
    [images.length]
  );

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full bg-slate-100 flex items-center justify-center">
        <span className="text-slate-400 text-sm">No image available</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* Current image */}
      <img
        src={images[current]}
        alt={`${roomName} - ${current + 1}`}
        className="w-full h-full object-cover transition-opacity duration-300"
        key={current}
      />

      {/* ── Arrow buttons ── always visible when more than 1 image */}
      {images.length > 1 && (
        <>
          {/* PREV button */}
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous image"
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 20,
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "rgba(0,0,0,0.45)",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.7)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.45)")}
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </button>

          {/* NEXT button */}
          <button
            type="button"
            onClick={goNext}
            aria-label="Next image"
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 20,
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "rgba(0,0,0,0.45)",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.7)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.45)")}
          >
            <ChevronRight size={20} strokeWidth={2.5} />
          </button>

          {/* ── Dot indicators ── */}
          <div
            style={{
              position: "absolute",
              bottom: "12px",
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              gap: "6px",
              zIndex: 20,
            }}
          >
            {images.map((_: string, i: number) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrent(i);
                }}
                aria-label={`Go to image ${i + 1}`}
                style={{
                  width: i === current ? "20px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  backgroundColor: i === current ? "white" : "rgba(255,255,255,0.5)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                }}
              />
            ))}
          </div>

          {/* ── Image counter badge ── */}
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "white",
              fontSize: "11px",
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: "12px",
              zIndex: 20,
              letterSpacing: "0.5px",
            }}
          >
            {current + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Main section component
   ───────────────────────────────────────────────────────── */
export function StayInStyleSection() {
  const { data: rooms } = useListRooms();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const styleRooms = rooms?.filter((r: any) => r.showInPackages) || [];

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [updateScrollButtons, styleRooms.length]);

  const scrollBy = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = direction === "left" ? -420 : 420;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  if (!styleRooms || styleRooms.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-slate-400 mb-6"
          >
            Stay in Style, the Island Way
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg leading-relaxed"
          >
            Whether you're a solo surfer, a beach-loving couple, or a group of wave-chasers — we've got the perfect spot for you. Think breezy rooms, tropical touches, and all the essentials for a chill stay just steps from the sea.
          </motion.p>
        </div>

        {/* ── Section scroll navigation row ── */}
        <div className="flex items-center justify-between mb-6 px-2">
          <p className="text-sm font-semibold text-slate-400 flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            Swipe to explore rooms
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollBy("left")}
              disabled={!canScrollLeft}
              aria-label="Scroll rooms left"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: canScrollLeft ? "#0B3D5E" : "#e2e8f0",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: canScrollLeft ? "pointer" : "default",
                color: canScrollLeft ? "white" : "#94a3b8",
                transition: "all 0.2s",
                boxShadow: canScrollLeft ? "0 2px 8px rgba(11,61,94,0.3)" : "none",
              }}
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={() => scrollBy("right")}
              disabled={!canScrollRight}
              aria-label="Scroll rooms right"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: canScrollRight ? "#0B3D5E" : "#e2e8f0",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: canScrollRight ? "pointer" : "default",
                color: canScrollRight ? "white" : "#94a3b8",
                transition: "all 0.2s",
                boxShadow: canScrollRight ? "0 2px 8px rgba(11,61,94,0.3)" : "none",
              }}
            >
              <ChevronRight size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* ── Horizontally scrollable room cards ── */}
        <div
          ref={scrollRef}
          className="flex gap-6 pb-8 snap-x snap-mandatory"
          style={{
            overflowX: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <style dangerouslySetInnerHTML={{ __html: `
            .stay-scroll-container::-webkit-scrollbar { display: none; }
          `}} />

          {styleRooms.map((room: any, idx: number) => {
            const images: string[] =
              room.gallery?.length > 0
                ? room.gallery
                : [room.heroImageUrl].filter(Boolean);

            return (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex-none w-[320px] md:w-[400px] snap-center"
              >
                {/* Image Slider */}
                <div
                  className="relative mb-6 overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300"
                  style={{ aspectRatio: "4 / 3" }}
                >
                  <RoomImageSlider images={images} roomName={room.name} />
                </div>

                {/* Content */}
                <div className="text-center px-4">
                  <Link href={`/rooms/${room.slug}`}>
                    <h3 className="text-lg font-bold text-foreground hover:text-primary transition-colors cursor-pointer inline-flex items-center gap-1">
                      {room.name}
                    </h3>
                  </Link>
                  <p className="text-muted-foreground text-sm mt-2 font-medium">
                    — {room.shortDesc || room.description?.substring(0, 80) + '...'}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
