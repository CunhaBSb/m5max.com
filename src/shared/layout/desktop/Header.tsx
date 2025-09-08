import { useNavigate, Location } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { FaWhatsapp } from "react-icons/fa";

interface NavigationItem {
  name: string;
  href: string;
}

interface DesktopHeaderProps {
  navigation: NavigationItem[];
  handleNavigation: (href: string) => void;
  location: Location;
  isActive: (href: string, currentPath: string, currentHash: string) => boolean;
}

export const DesktopHeader = ({ navigation, handleNavigation, location, isActive }: DesktopHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="hidden lg:flex items-center justify-between h-14 md:h-16">
      <button onClick={() => navigate("/")} className="flex items-center gap-3 hover:opacity-80 transition-smooth">
        <img
          src="/fogosm5.svg"
          alt="M5 Max Produções"
          className="w-8 h-8 md:w-10 md:h-10"
        />
        <div>
          <div className="font-bold text-lg text-fire-gradient">M5 Max</div>
          <div className="text-xs text-muted-foreground -mt-1">Produções</div>
        </div>
      </button>

      <nav className="flex items-center gap-4">
        {navigation.map((item) => {
          const active = isActive(item.href, location.pathname, location.hash);
          return (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.href)}
              className={`text-sm font-medium transition-smooth relative px-3 py-2 rounded-lg ${
                active 
                  ? 'text-fire-orange bg-fire-orange/10 border border-fire-orange/20 shadow-sm' 
                  : 'text-foreground hover:text-fire-orange hover:bg-fire-orange/5'
              }`}
            >
              {item.name}
              {active && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-fire-orange rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="flex items-center gap-2 md:gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open('https://wa.me/5561982735575', '_blank')}
          className="flex items-center gap-2"
        >
          <div className="bg-green-500 p-1 rounded-full">
            <FaWhatsapp className="w-4 h-4 text-white" />
          </div>
          <span className="hidden lg:inline">WhatsApp</span>
        </Button>
      </div>
    </div>
  );
};
