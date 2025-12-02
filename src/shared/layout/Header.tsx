import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PlatformSwitch } from "./switchers/PlatformSwitch";
import { Button } from "@/shared/ui/button";
import { Calendar } from "lucide-react";
import { useAppStore } from "@/shared/store/appStore";
import { useAnalytics } from "@/shared/hooks/useAnalytics";
import { DesktopHeader } from "./desktop/Header";
import { MobileHeader } from "./mobile/Header";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const getNavigationForPage = (pathname: string) => {
    const baseNavigation = [
      { name: "Réveillon", href: "/reveillon" },
    ];

    // Navegação específica por página
    if (pathname === '/') {
      // Homepage
      return [
        ...baseNavigation,
        { name: "Serviços", href: "#servicos" },
        { name: "Perguntas Frequentes", href: "#faq" },
        { name: "Sobre nós", href: "#empresa" },
      ];
    } else if (pathname === '/reveillon') {
      // Página Réveillon
      return [
        { name: "Início", href: "/" },
        { name: "Serviços", href: "#servicos" },
        { name: "Como Funciona", href: "#como-funciona" },
        { name: "Perguntas Frequentes", href: "#faq" },
        { name: "Sobre nós", href: "#empresa" },
      ];
    }

    // Fallback para outras páginas
    return [
      ...baseNavigation,
      { name: "Serviços", href: "#servicos" },
      { name: "Perguntas Frequentes", href: "#faq" },
      { name: "Sobre nós", href: "#empresa" },
    ];
  };

  const navigation = getNavigationForPage(location.pathname);

  const isActive = (href: string, currentPath: string, currentHash: string) => {
    if (href.startsWith('/')) return currentPath === href;
    if (href.startsWith('#')) return currentHash === href;
    return false;
  };

  const handleNavigation = (href: string) => {
    if (href.startsWith('/')) {
      navigate(href);
      setIsOpen(false);
      return;
    }

    if (href.startsWith('#')) {
      if (location.pathname === '/') {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
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

  const { openFormModal } = useAppStore();
  const { trackEvent } = useAnalytics();

  const handleHeaderBudget = () => {
    openFormModal({ source: 'header_cta', audience: 'general', page: location.pathname });
    trackEvent('header_budget_click', { page_category: 'general', source: 'header' });
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-background/20 backdrop-blur-sm border-b border-border/10 transition-transform duration-300 ease-in-out ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 py-2">
          <div className="flex-1">
            <PlatformSwitch
              desktop={<DesktopHeader navigation={navigation} handleNavigation={handleNavigation} location={location} isActive={isActive} />}
              mobile={<MobileHeader navigation={navigation} handleNavigation={handleNavigation} isOpen={isOpen} setIsOpen={setIsOpen} location={location} isActive={isActive} />}
            />
          </div>

          <Button
            size="sm"
            variant="outline"
            className="hidden sm:inline-flex items-center gap-2 border-blue-400/60 text-blue-50 bg-blue-500/10"
            data-testid="cta-orcamento"
            onClick={handleHeaderBudget}
          >
            <Calendar className="w-4 h-4" /> Orçamento
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
