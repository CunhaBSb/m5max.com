import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, Phone, MessageSquare, Sun, Moon, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import ContactModal from "./ContactModal";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    { 
      name: "Início", 
      href: "#hero" 
    },
    { 
      name: "Serviços", 
      href: "#servicos",
      dropdown: [
        { name: "Shows Pirotécnicos", href: "/shows-pirotecnicos", description: "Eventos profissionais" },
        { name: "Chá Revelação", href: "/cha-revelacao", description: "Kits especiais para bebês" },
        { name: "Kits DIY", href: "/kits", description: "Para festas caseiras" }
      ]
    },
    { 
      name: "Empresa", 
      href: "#diferenciais",
      dropdown: [
        { name: "Diferenciais", href: "#diferenciais", description: "Por que nos escolher" },
        { name: "Portfólio", href: "#portfolio", description: "Nossos trabalhos" },
        { name: "FAQ", href: "#faq", description: "Perguntas frequentes" }
      ]
    },
    { 
      name: "Contato", 
      href: "#contato" 
    }
  ];

  const handleNavigation = (href: string, isPage = false) => {
    // Se for uma página específica (inicia com /)
    if (href.startsWith('/')) {
      navigate(href);
      setIsOpen(false);
      return;
    }

    // Se for seção da homepage (inicia com #)
    if (href.startsWith('#')) {
      // Se estiver na homepage, faz scroll para a seção
      if (location.pathname === '/') {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Se estiver em outra página, vai para homepage + scroll
        navigate('/');
        setTimeout(() => {
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
    setIsOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Layout */}
          <div className="lg:hidden flex items-center justify-between h-14 md:h-16">
            {/* Theme Toggle - Left */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-8 h-8 md:w-10 md:h-10"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Alternar tema</span>
            </Button>

            {/* Centered Logo */}
            <button 
              onClick={() => navigate("/")} 
              className="flex items-center gap-3 hover:opacity-80 transition-smooth absolute left-1/2 transform -translate-x-1/2"
            >
              <img
                src="/m5logo.svg"
                alt="M5 Max Produções"
                className="w-8 h-8 md:w-10 md:h-10"
              />
              <div className="hidden sm:block">
                <div className="font-bold text-lg text-fire-gradient">M5 Max</div>
                <div className="text-xs text-muted-foreground -mt-1">Produções</div>
              </div>
            </button>
            
            {/* Mobile Menu - Right */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="w-8 h-8 md:w-10 md:h-10">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center gap-3 pb-6 border-b border-border">
                      <img
                        src="/m5logo.svg"
                        alt="M5 Max Produções"
                        className="w-10 h-10"
                      />
                      <div>
                        <div className="font-bold text-lg text-fire-gradient">M5 Max</div>
                        <div className="text-xs text-muted-foreground">Produções</div>
                      </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-col gap-4 py-6">
                      {navigation.map((item) => (
                        <div key={item.name} className="space-y-2">
                          <button
                            onClick={() => handleNavigation(item.href)}
                            className="text-left font-medium text-foreground hover:text-fire-orange transition-smooth py-2 w-full"
                          >
                            {item.name}
                          </button>
                          {item.dropdown && (
                            <div className="ml-4 space-y-2">
                              {item.dropdown.map((dropdownItem) => (
                                <button
                                  key={dropdownItem.name}
                                  onClick={() => handleNavigation(dropdownItem.href)}
                                  className="text-left text-sm text-muted-foreground hover:text-fire-orange transition-smooth py-1 w-full flex flex-col items-start"
                                >
                                  <span>{dropdownItem.name}</span>
                                  <span className="text-xs opacity-70">{dropdownItem.description}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </nav>

                    {/* Mobile Actions */}
                    <div className="mt-auto space-y-4">
                      <Button
                        variant="outline"
                        className="w-full flex items-center gap-2"
                        onClick={() => {
                          window.open('https://wa.me/5561982735575', '_blank');
                          setIsOpen(false);
                        }}
                      >
                        <MessageSquare className="w-4 h-4" />
                        Falar no WhatsApp
                      </Button>
                      
                      <Button
                        variant="fire"
                        className="w-full flex items-center gap-2"
                        onClick={() => {
                          setIsContactModalOpen(true);
                          setIsOpen(false);
                        }}
                      >
                        <Phone className="w-4 h-4" />
                        Solicitar Orçamento
                      </Button>
                      
                      <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border">
                        <div className="font-medium">40 anos de experiência</div>
                        <div>Segurança certificada • Equipe habilitada</div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center justify-between h-14 md:h-16">
            {/* Logo */}
            <button onClick={() => navigate("/")} className="flex items-center gap-3 hover:opacity-80 transition-smooth">
              <img
                src="/m5logo.svg"
                alt="M5 Max Produções"
                className="w-8 h-8 md:w-10 md:h-10"
              />
              <div>
                <div className="font-bold text-lg text-fire-gradient">M5 Max</div>
                <div className="text-xs text-muted-foreground -mt-1">Produções</div>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="flex items-center gap-8">
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

            {/* Desktop Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-8 h-8 md:w-10 md:h-10"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Alternar tema</span>
              </Button>

              {/* Contact Buttons - Desktop */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open('https://wa.me/5561982735575', '_blank')}
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="hidden lg:inline">WhatsApp</span>
                </Button>
                
                <Button
                  variant="fire"
                  size="sm"
                  onClick={() => setIsContactModalOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span className="hidden lg:inline">Orçamento</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </>
  );
};

export default Header;