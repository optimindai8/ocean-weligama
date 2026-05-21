import { useParams, Link } from "wouter";
import { useGetService } from "@workspace/api-client-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Check, Sparkles } from "lucide-react";

export default function PackageDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: service, isLoading } = useGetService(slug ?? "");

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="pt-32 container mx-auto px-4 py-16 space-y-6 max-w-3xl">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full rounded-3xl" />
          <Skeleton className="h-32 w-full" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="pt-32 container mx-auto px-4 text-center py-24">
          <h1 className="text-3xl font-bold text-foreground mb-4">Package not found</h1>
          <Link href="/packages">
            <Button variant="outline">Browse all packages</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="pt-24 flex-1">
        {/* Banner Image */}
        <section className="relative aspect-[21/9] md:aspect-[21/6] w-full overflow-hidden bg-primary">
          {service.imageUrl ? (
            <img 
              src={service.imageUrl} 
              alt={service.name} 
              className="w-full h-full object-cover opacity-90" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-accent/20">
              <Sparkles className="w-16 h-16 text-white opacity-40 animate-pulse" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 md:bottom-12 md:left-12 md:right-12 text-white">
            <span className="text-accent text-xs font-bold uppercase tracking-widest bg-accent/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-accent/20 mb-3 inline-block">
              {service.category || (service.type === "main" ? "Surf Package" : "Optional Package")}
            </span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-white shadow-sm">{service.name}</h1>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 container mx-auto px-4 max-w-6xl">
          <Link href="/packages">
            <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors text-sm" data-testid="link-back-packages">
              <ArrowLeft className="w-4 h-4" /> All Packages
            </button>
          </Link>

          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-serif font-bold text-foreground mb-4">About this package</h2>
                <p className="text-muted-foreground leading-relaxed text-lg font-light whitespace-pre-line">
                  {service.description || "Indulge in a premium, hand-crafted experience designed to elevate your stay at Ocean Air. Dive into the beautiful local culture, dynamic waters, and peaceful vibes of Weligama."}
                </p>
              </div>

              {service.highlights && service.highlights.length > 0 && (
                <div>
                  <h3 className="text-xl font-serif font-bold text-foreground mb-4">What's Included</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.highlights.map((item, index) => (
                      <div key={index} className="flex items-start gap-3 bg-muted/30 p-4 rounded-2xl border border-border/50">
                        <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-foreground/80 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column (Pricing card) */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-3xl p-8 border border-border shadow-xl shadow-primary/5 sticky top-28 space-y-6">
                <div className="text-center space-y-1">
                  <span className="text-xs uppercase text-muted-foreground tracking-widest font-semibold">Package Price</span>
                  <div className="text-4xl font-black text-primary">€{service.basePrice}</div>
                </div>

                {service.isBookable && (
                  <Link href={`/book?service=${service.slug}`}>
                    <Button className="w-full bg-[#F0A500] hover:bg-[#D99500] text-white rounded-full h-14 font-bold shadow-lg shadow-[#F0A500]/25 text-base transition-all duration-300" data-testid="button-book-package">
                      Reserve Now
                    </Button>
                  </Link>
                )}
                
                <Link href="/contact">
                  <Button variant="outline" className="w-full rounded-full h-12 text-sm" data-testid="button-enquire-package">
                    Inquire Details
                  </Button>
                </Link>

                <div className="pt-4 border-t border-border/60 text-center">
                  <p className="text-xs text-muted-foreground font-light leading-relaxed">
                    Flexible booking options. Need custom configurations? Feel free to contact our team.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
