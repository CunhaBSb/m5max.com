import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/shared/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu";
import { Menu, Phone, MessageSquare, ChevronDown } from "lucide-react";
import ContactModal from "@/shared/modal/ContactModal";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 100) {
        // Always show when near top
        setIsVisible(true);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsVisible(true);
      } else {
        // Scrolling down
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navigation = [
    { 
      name: "Réveillon", 
      href: "/reveillon"
    },
    { 
      name: "Empresa", 
      href: "#empresa",
      dropdown: [
        { name: "Sobre a M5", href: "#empresa", description: "Nossa história e experiência" },
        { name: "Nossos Serviços", href: "#servicos", description: "O que oferecemos" },
        { name: "Perguntas Frequentes", href: "#faq", description: "Tire suas dúvidas" }
      ]
    }
  ];

  const handleNavigation = (href: string) => {
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
      <header className={`fixed top-0 left-0 right-0 z-50 bg-background/20 backdrop-blur-sm border-b border-border/10 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Layout */}
          <div className="lg:hidden flex items-center justify-between h-12 md:h-14">
            {/* WhatsApp Quick Action - Left */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open('https://wa.me/5561982735575', '_blank')}
              className="flex items-center gap-1.5 px-2 py-1.5 h-8 text-xs hover:text-fire-orange transition-smooth"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">WhatsApp</span>
            </Button>

            {/* Centered Logo */}
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
            
            {/* Mobile Menu + Quick Quote - Right */}
            <div className="flex items-center gap-1">
              <Button
                variant="fire"
                size="sm" 
                onClick={() => setIsContactModalOpen(true)}
                className="flex items-center gap-1 px-2 py-1.5 h-8 text-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Orçar</span>
              </Button>
              
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-8 h-8 p-1.5">
                    <Menu className="h-4 w-4" />
                    <span className="sr-only">Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72 sm:w-80">
                  <div className="flex flex-col h-full">
                    {/* Header with Logo & Status */}
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

                    {/* Quick Actions Bar */}
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
                        <MessageSquare className="w-3.5 h-3.5" />
                        WhatsApp
                      </Button>
                      <Button
                        variant="fire"
                        size="sm"
                        onClick={() => {
                          setIsContactModalOpen(true);
                          setIsOpen(false);
                        }}
                        className="flex-1 flex items-center gap-1.5 h-9 text-xs"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        Orçamento
                      </Button>
                    </div>

                    {/* Compact Navigation */}
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

                    {/* Professional Footer */}
                    <div className="mt-auto space-y-3 pt-4 border-t border-border">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-background/50 p-2 rounded-lg">
                          <div className="text-lg font-bold text-fire-orange">40+</div>
                          <div className="text-xs text-muted-foreground">Anos</div>
                        </div>
                        <div className="bg-background/50 p-2 rounded-lg">
                          <div className="text-lg font-bold text-fire-orange">500+</div>
                          <div className="text-xs text-muted-foreground">Eventos</div>
                        </div>
                        <div className="bg-background/50 p-2 rounded-lg">
                          <div className="text-lg font-bold text-fire-orange">100%</div>
                          <div className="text-xs text-muted-foreground">Seguro</div>
                        </div>
                      </div>
                      
                      <div className="text-center text-xs text-muted-foreground bg-gradient-to-r from-fire-orange/5 to-fire-gold/5 p-2 rounded-lg">
                        <div className="font-medium text-fire-gradient">Licenciado pelo Exército</div>
                        <div>Segurança certificada • Equipe habilitada</div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center justify-between h-14 md:h-16">
            {/* Logo */}
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