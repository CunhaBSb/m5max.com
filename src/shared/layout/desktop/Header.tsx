import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
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

interface DesktopHeaderProps {
  navigation: NavigationItem[];
  handleNavigation: (href: string) => void;
}

export const DesktopHeader = ({ navigation, handleNavigation }: DesktopHeaderProps) => {
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
        {navigation.map((item) => (
          item.dropdown ? (
            <DropdownMenu key={item.name}>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-fire-orange transition-smooth">
                {item.name}
                <ChevronDown className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64">
                {item.dropdown.map((dropdownItem) => (
                  <DropdownMenuItem
                    key={dropdownItem.name}
                    onClick={() => handleNavigation(dropdownItem.href)}
                    className="flex flex-col items-start p-4 cursor-pointer"
                  >
                    <div className="font-medium">{dropdownItem.name}</div>
                    <div className="text-xs text-muted-foreground">{dropdownItem.description}</div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.href)}
              className="text-sm font-medium text-foreground hover:text-fire-orange transition-smooth"
            >
              {item.name}
            </button>
          )
        ))}
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