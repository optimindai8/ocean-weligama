import { useParams, Link } from "wouter";
import { useGetService } from "@workspace/api-client-react";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { SEO } from "@/seo/SEO";
import { StructuredData } from "@/seo/StructuredData";

export default function PackageDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: service, isLoading } = useGetService(slug ?? "");

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
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
    <div className="min-h-screen flex flex-col bg-background selection:bg-[#0B3D5E] selection:text-white overflow-x-hidden">
      <SEO 
        title={`${service.name} — Surf & Stay Experiences`}
        description={service.description?.slice(0, 160).replace(/\s+/g, ' ') + '...' || `Book ${service.name} at Ocean Air Weligama. Enjoy luxury sea-view suites, surf lessons, airport transfers & custom barefoot luxury tours.`}
        canonicalPath={`/packages/${slug}`}
        keywords={[`${service.name}`, `Weligama ${service.name}`, "Surf Packages Weligama", "Ocean Air Experiences"]}
      />
      <StructuredData
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "Experiences", item: "/packages" },
          { name: service.name, item: `/packages/${slug}` },
        ]}
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 w-full overflow-hidden" style={{ background: 'linear-gradient(160deg, #F0F4F8 0%, #E2EDF8 100%)' }}>
        {/* Soft glowing orbs */}
        <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-teal-200/30 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-sky-200/30 blur-[100px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <Link href="/packages">
            <button className="flex items-center gap-2 text-slate-500 hover:text-[#0B3D5E] mb-8 px-5 py-2.5 rounded-full bg-white/40 backdrop-blur-md border border-white/60 transition-all duration-300 shadow-sm hover:shadow-md hover:bg-white/70 text-[10px] uppercase tracking-widest font-bold" data-testid="link-back-packages">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Experiences
            </button>
          </Link>

          {service.iconEmoji ? (
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/50 backdrop-blur-2xl border border-white/80 shadow-[0_10px_40px_rgba(11,61,94,0.1)] flex items-center justify-center text-5xl md:text-7xl mb-8 relative transition-transform duration-500 hover:scale-105">
              {/* Inner glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-200/20 to-sky-200/20 rounded-full" />
              <span className="relative z-10">{service.iconEmoji}</span>
            </div>
          ) : (
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/50 backdrop-blur-2xl border border-white/80 shadow-[0_10px_40px_rgba(11,61,94,0.1)] flex items-center justify-center mb-8 relative transition-transform duration-500 hover:scale-105">
              <Sparkles className="w-10 h-10 md:w-14 md:h-14 text-[#0B3D5E] opacity-50" />
            </div>
          )}

          <span className="text-[#4BBCCC] text-[11px] font-black uppercase tracking-[0.2em] bg-white/60 backdrop-blur-md px-5 py-2 rounded-full border border-white/80 mb-5 inline-block shadow-sm">
            {service.category || (service.type === "main" ? "Surf Package" : "Optional Package")}
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-[#0B3D5E] mb-6 drop-shadow-sm max-w-4xl leading-tight">
            {service.name}
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-1 py-16 md:py-24 relative bg-[#F7F9FB]">
        {/* Very soft background glow for the content area */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[300px] bg-white/60 blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            
            {/* Left Column (Details) */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* "About the package details" box with italic font */}
              <div className="bg-white/60 backdrop-blur-xl border border-white/80 p-8 md:p-12 rounded-[2.5rem] shadow-[0_10px_40px_rgba(11,61,94,0.04)] relative overflow-hidden group hover:shadow-[0_20px_60px_rgba(11,61,94,0.08)] transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <h2 className="text-xl md:text-2xl font-serif font-bold text-[#0B3D5E] mb-6 relative z-10 flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-[#4BBCCC]" />
                  About this experience
                </h2>
                
                {/* Italic and clean package description */}
                <p className="text-slate-600 leading-loose text-lg md:text-xl italic font-light whitespace-pre-line relative z-10">
                  "{service.description || "Indulge in a premium, hand-crafted experience designed to elevate your stay at Ocean Weligama. Dive into the beautiful local culture, dynamic waters, and peaceful vibes of the island."}"
                </p>
              </div>

              {/* What's Included */}
              {service.highlights && service.highlights.length > 0 && (
                <div>
                  <h3 className="text-xl md:text-2xl font-serif font-bold text-[#0B3D5E] mb-8 flex items-center gap-3">
                    <Check className="w-5 h-5 text-[#4BBCCC]" />
                    What's Included
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.highlights.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 bg-white/40 backdrop-blur-md p-5 rounded-2xl border border-white/60 shadow-sm hover:shadow-md transition-all duration-300 hover:bg-white/80 hover:-translate-y-0.5">
                        <div className="w-8 h-8 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                          <Check className="w-4 h-4 text-teal-500" />
                        </div>
                        <span className="text-slate-600 text-sm font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column (Pricing card) */}
            <div className="lg:col-span-1 relative">
              <div className="sticky top-32 bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-10 border border-white/80 shadow-[0_20px_60px_rgba(11,61,94,0.06)] flex flex-col items-center text-center group hover:shadow-[0_30px_80px_rgba(11,61,94,0.12)] transition-all duration-500">
                
                <h3 className="text-lg font-bold text-[#0B3D5E] mb-2 uppercase tracking-widest text-[11px]">Ready to dive in?</h3>
                <p className="text-slate-500 text-xs mb-8 leading-relaxed">
                  Reserve this exclusive experience or speak to our concierge for a tailored arrangement.
                </p>

                <div className="w-full space-y-4">
                  {service.isBookable && (
                    <Link href={`/book?service=${service.slug}`}>
                      <button className="w-full bg-[#0B3D5E] hover:bg-[#1A6B8A] text-white rounded-2xl h-14 font-bold text-sm shadow-lg shadow-[#0B3D5E]/20 transition-all duration-300 transform hover:-translate-y-1" data-testid="button-book-package">
                        Reserve Now
                      </button>
                    </Link>
                  )}
                  
                  <Link href="/contact">
                    <button className="w-full bg-white border border-white/80 hover:border-teal-200 text-[#0B3D5E] rounded-2xl h-14 font-bold text-sm shadow-sm transition-all duration-300 hover:bg-teal-50/50" data-testid="button-enquire-package">
                      Contact Concierge
                    </button>
                  </Link>
                </div>
                
                <div className="mt-8 pt-6 border-t border-slate-200/50 w-full">
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                    Flexible booking & cancellation
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
