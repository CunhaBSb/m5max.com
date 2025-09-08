import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/ui/sheet";
import { Menu, ChevronDown } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

interface NavigationItem {
  name: string;
  href: string;
  dropdown?: Array<{
    name: string;
    href: string;
    description: string;
  }>;
}

interface MobileHeaderProps {
  navigation: NavigationItem[];
  handleNavigation: (href: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const MobileHeader = ({ navigation, handleNavigation, isOpen, setIsOpen }: MobileHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="lg:hidden flex items-center justify-between h-12 md:h-14">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => window.open('https://wa.me/5561982735575', '_blank')}
        className="flex items-center gap-1.5 px-2 py-1.5 h-8 text-xs hover:text-fire-orange transition-smooth"
      >
        <div className="bg-green-500 p-1 rounded-full">
          <FaWhatsapp className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="hidden xs:inline">WhatsApp</span>
      </Button>

      <button 
        onClick={() => navigate("/")} 
        className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2 hover:opacity-80 transition-smooth"
      >
        <img
          src="/fogosm5.svg"
          alt="M5 Max Produções"
          className="w-7 h-7 md:w-8 md:h-8"
        />
        <div className="hidden xs:block">
          <div className="font-bold text-sm md:text-base text-fire-gradient">M5 Max</div>
          <div className="text-xs text-muted-foreground -mt-0.5 leading-none">Produções</div>
        </div>
      </button>
      
      <div className="flex items-center gap-1">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="w-8 h-8 p-1.5">
              <Menu className="h-4 w-4" />
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
                    className="w-8 h-8"
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

              <div className="flex items-center gap-2 py-3 border-b border-border/50">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    window.open('https://wa.me/5561982735575', '_blank');
                    setIsOpen(false);
                  }}
                  className="flex-1 flex items-center gap-1.5 h-9 text-xs"
                >
                  <div className="bg-green-500 p-1 rounded-full">
                    <FaWhatsapp className="w-3.5 h-3.5 text-white" />
                  </div>
                  WhatsApp
                </Button>
              </div>

              <nav className="flex flex-col gap-1 py-4">
                {navigation.map((item) => (
                  <div key={item.name} className="space-y-1">
                    <button
                      onClick={() => handleNavigation(item.href)}
                      className="text-left font-medium text-foreground hover:text-fire-orange hover:bg-fire-orange/5 transition-smooth py-2.5 px-3 w-full rounded-lg flex items-center justify-between"
                    >
                      <span>{item.name}</span>
                      {item.dropdown && <ChevronDown className="w-3.5 h-3.5 opacity-60" />}
                    </button>
                    {item.dropdown && (
                      <div className="ml-3 space-y-1">
                        {item.dropdown.map((dropdownItem) => (
                          <button
                            key={dropdownItem.name}
                            onClick={() => handleNavigation(dropdownItem.href)}
                            className="text-left text-sm text-muted-foreground hover:text-fire-orange hover:bg-fire-orange/5 transition-smooth py-2 px-3 w-full rounded-md flex flex-col items-start"
                          >
                            <span className="font-medium">{dropdownItem.name}</span>
                            <span className="text-xs opacity-70 -mt-0.5">{dropdownItem.description}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              <div className="mt-auto space-y-3 pt-4 border-t border-border">
                <div className="flex items-center justify-center gap-3">
                  <a 
                    href="https://instagram.com/fogosm5" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="w-5 h-5 rounded bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">@</span>
                    </div>
                    <span className="text-xs font-medium text-pink-400">Instagram</span>
                  </a>
                  
                  <a 
                    href="https://youtube.com/@m5maxproducoes" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105"
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