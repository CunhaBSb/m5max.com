import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Phone, MessageSquare, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import ContactModal from "@/components/ContactModal";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const navigation = [
    { name: "Início", href: "#hero" },
    { name: "Serviços", href: "#servicos" },
    { name: "Diferenciais", href: "#diferenciais" },
    { name: "Portfólio", href: "#portfolio" },
    { name: "FAQ", href: "#faq" },
    { name: "Contato", href: "#contato" }
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="M5 Max Produções"
                className="w-8 h-8 md:w-10 md:h-10"
              />
              <div className="hidden sm:block">
                <div className="font-bold text-lg text-fire-gradient">M5 Max</div>
                <div className="text-xs text-muted-foreground -mt-1">Produções</div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="text-sm font-medium text-foreground hover:text-fire-orange transition-smooth"
                >
                  {item.name}
                </button>
              ))}
            </nav>

            {/* Actions */}
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
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
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

              {/* Mobile Menu */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="lg:hidden">
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
                        src="/logo.png"
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
                        <button
                          key={item.name}
                          onClick={() => scrollToSection(item.href)}
                          className="text-left font-medium text-foreground hover:text-fire-orange transition-smooth py-2"
                        >
                          {item.name}
                        </button>
                      ))}
                    </nav>

                    {/* Mobile Actions */}
                    <div className="mt-auto space-y-4">
                      <Button
                        variant="outline"
                        className="w-full flex items-center gap-2"
                        onClick={() => {
                          window.open('https://wa.me/5511999999999', '_blank');
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