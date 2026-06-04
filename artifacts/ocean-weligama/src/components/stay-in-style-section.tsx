import { useListRooms } from "@workspace/api-client-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link } from "wouter";
import { motion } from "framer-motion";

export function StayInStyleSection() {
  const { data: rooms } = useListRooms();

  // Filter rooms to only show those flagged for this section
  // In a real scenario, this flag might be named showInPackages or similar.
  // We're assuming the API provides `showInPackages` boolean property.
  const styleRooms = rooms?.filter((r: any) => r.showInPackages) || [];

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
            Whether you're a solo surfer, a beach-loving couple, or a group of wave-chasers — we've got the perfect spot for you. Think breezy rooms, tropical touches, and all the essentials for a chill stay just steps from the sea. Laid-back comfort meets island style — because everyone deserves to sleep easy after a day in the surf.
          </motion.p>
        </div>

        <div className="flex justify-end mb-4 pr-4">
          <p className="text-sm font-semibold text-slate-400 flex items-center gap-2 animate-pulse">
            Swipe to explore 
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </p>
        </div>

        {/* Scrollable Container */}
        <div className="flex overflow-x-auto gap-6 pb-8 snap-x hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {styleRooms.map((room: any, idx: number) => {
            const images = room.gallery?.length > 0 ? room.gallery : [room.heroImageUrl].filter(Boolean);
            
            return (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex-none w-[320px] md:w-[400px] snap-center group"
              >
                {/* Image Carousel */}
                <div className="relative aspect-[4/3] mb-6 overflow-hidden rounded-sm group-hover:shadow-lg transition-shadow">
                  {images && images.length > 0 ? (
                    <Carousel className="w-full h-full">
                      <CarouselContent className="h-full ml-0">
                        {images.map((img: string, index: number) => (
                          <CarouselItem key={index} className="h-full pl-0 flex-[0_0_100%]">
                            <img
                              src={img}
                              alt={`${room.name} - ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      {images.length > 1 && (
                        <>
                          <div className="absolute inset-x-0 bottom-4 flex justify-center gap-1.5 z-10 pointer-events-none">
                            {/* Dots representation, visually appealing */}
                            {images.map((_: any, i: number) => (
                              <div key={i} className="w-2 h-2 rounded-full bg-white/70 shadow-sm" />
                            ))}
                          </div>
                          <CarouselPrevious className="left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 hover:bg-black/40 text-white border-none h-8 w-8" />
                          <CarouselNext className="right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 hover:bg-black/40 text-white border-none h-8 w-8" />
                        </>
                      )}
                    </Carousel>
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">No image available</span>
                    </div>
                  )}
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
        
        {/* Helper style to hide scrollbar while keeping functionality */}
        <style dangerouslySetInnerHTML={{__html: `
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}} />
      </div>
    </section>
  );
}
