import React, { useCallback } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "./LanguageContext";

export function LanguageSelector() {
  const { currentLanguage, setLanguage, languages } = useLanguage();

  const handleLanguageChange = useCallback((langCode: string) => {
    setLanguage(langCode);
  }, [setLanguage]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative flex items-center gap-2 px-3 h-10 rounded-xl hover:bg-primary/5 text-foreground/80 hover:text-primary transition-all group"
        >
          <Globe className="w-4 h-4 transition-transform group-hover:rotate-12" />
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] hidden sm:inline">
            {currentLanguage.code.split("-")[0]}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        sideOffset={12}
        className="w-64 p-2 rounded-2xl border-white/20 bg-white/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] z-[110] overflow-hidden max-h-[70vh] overflow-y-auto"
      >
        <div className="px-3 py-2 mb-1 border-b border-black/5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Language & Currency</span>
        </div>
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className="flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer hover:bg-primary/10 transition-all duration-200 group mb-0.5 last:mb-0"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl transform group-hover:scale-110 transition-transform duration-200">{lang.flag}</span>
              <div className="flex flex-col">
                <span className={`text-sm font-semibold ${currentLanguage.code === lang.code ? "text-primary" : "text-foreground group-hover:text-primary"}`}>
                  {lang.name}
                </span>
                <span className="text-[9px] uppercase tracking-tighter text-muted-foreground/60">
                  {lang.currency} ({lang.symbol})
                </span>
              </div>
            </div>
            {currentLanguage.code === lang.code && (
              <motion.div layoutId="active-check-v2">
                <Check className="w-4 h-4 text-primary stroke-[3px]" />
              </motion.div>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
