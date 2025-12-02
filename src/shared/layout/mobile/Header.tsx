import { useNavigate, Location } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/ui/sheet";
import { Menu, ArrowRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useAppStore } from "@/shared/store/appStore";

interface NavigationItem {
  name: string;
  href: string;
}

interface MobileHeaderProps {
  navigation: NavigationItem[];
  handleNavigation: (href: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  location: Location;
  isActive: (href: string, currentPath: string, currentHash: string) => boolean;
}

export const MobileHeader = ({ navigation, handleNavigation, isOpen, setIsOpen, location, isActive }: MobileHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="lg:hidden flex items-center justify-between h-16 md:h-18 px-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => window.open('https://wa.me/5561982735575', '_blank')}
        className="hover:text-fire-orange transition-smooth rounded-full"
      >
        <div className="bg-green-500 p-2 rounded-full">
          <FaWhatsapp className="w-6 h-6 text-white" />
        </div>
        <span className="sr-only">WhatsApp</span>
      </Button>

      <button 
        onClick={() => navigate("/")} 
        className="absolute left-1/2 transform -translate-x-1/2 flex items-center hover:opacity-80 transition-smooth"
      >
        <img
          src="/fogosm5.svg"
          alt="M5 Max Produções"
          className="w-12 h-12 md:w-14 md:h-14"
        />
      </button>
      
      <div className="flex items-center">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="w-10 h-10 p-2">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 sm:w-80">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/fogosm5.svg"
                    alt="M5 Max Produções"
                    className="w-9 h-9"
                  />
                  <div>
                    <div className="font-bold text-base text-fire-gradient">M5 Max</div>
                    <div className="text-xs text-muted-foreground -mt-0.5">Produções</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-500 font-medium">Online</span>
                </div>
              </div>

              <nav className="flex flex-col gap-1 py-4">
                {navigation.map((item, index) => {
                  const active = isActive(item.href, location.pathname, location.hash);
                  return (
                    <div key={item.name} className={`space-y-1 ${index < navigation.length - 1 ? 'border-b border-border/50 pb-2 mb-2' : ''}`}>
                      <button
                        onClick={() => handleNavigation(item.href)}
                        className={`text-left font-medium transition-smooth py-2.5 px-3 w-full rounded-lg relative ${
                          active 
                            ? 'text-fire-orange bg-fire-orange/10 border border-fire-orange/20 shadow-sm' 
                            : 'text-foreground hover:text-fire-orange hover:bg-fire-orange/5'
                        }`}
                      >
                        {item.name}
                        {active && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-fire-orange rounded-full" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </nav>

              <div className="mt-auto space-y-3 pt-4">
                {/* Ação splitada: 30% WhatsApp (apenas ícone), 70% Orçamento */}
                <div className="pt-4 border-t border-border">
                  <div className="flex items-stretch gap-3">
                    <a
                      href="https://wa.me/5561982735575"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="basis-[30%] flex items-center justify-center rounded-xl bg-background/40 hover:bg-background/50 border border-white/10 transition-all duration-300 hover:scale-[1.02] shadow-sm"
                      onClick={() => setIsOpen(false)}
                      aria-label="Abrir WhatsApp"
                    >
                      <FaWhatsapp className="w-9 h-9 md:w-10 md:h-10 text-green-500 drop-shadow-[0_0_2px_rgba(255,255,255,0.6)]" />
                    </a>

                    <button
                      className="basis-[70%] flex items-center justify-between rounded-xl bg-gradient-to-b from-fire-orange/15 to-fire-orange/10 hover:from-fire-orange/20 hover:to-fire-orange/15 border border-fire-orange/25 px-4 py-3 transition-all duration-300 hover:scale-[1.02] shadow-sm"
                      onClick={() => {
                        useAppStore.getState().openFormModal({ audience: 'general', source: 'header_mobile_cta', page: location.pathname });
                        setIsOpen(false);
                      }}
                      data-testid="cta-orcamento"
                      aria-label="Abrir orçamento"
                    >
                      <span className="text-sm font-semibold text-fire-orange tracking-wide">Orçamento</span>
                      <div className="w-6 h-6 rounded bg-fire-orange flex items-center justify-center shadow-md">
                        <ArrowRight className="w-3.5 h-3.5 text-white" />
                      </div>
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3 pt-4 border-t border-border">
                  <a 
                    href="https://instagram.com/fogosm5" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 px-3 py-2 rounded-xl transition-all duration-300 hover:scale-105 shadow-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="w-5 h-5 rounded bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">@</span>
                    </div>
                    <span className="text-xs font-medium text-pink-400">Instagram</span>
                  </a>
                  
                  <a 
                    href="https://youtube.com/@FogosM5Max" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-3 py-2 rounded-xl transition-all duration-300 hover:scale-105 shadow-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="w-5 h-5 rounded bg-red-600 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">▶</span>
                    </div>
                    <span className="text-xs font-medium text-red-400">YouTube</span>
                  </a>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};
