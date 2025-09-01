import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PlatformSwitch } from "@/shared/PlatformSwitch";
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

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-background/20 backdrop-blur-sm border-b border-border/10 transition-transform duration-300 ease-in-out ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    } transform scale-[1.15] origin-top`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <PlatformSwitch
          desktop={<DesktopHeader navigation={navigation} handleNavigation={handleNavigation} />}
          mobile={<MobileHeader navigation={navigation} handleNavigation={handleNavigation} isOpen={isOpen} setIsOpen={setIsOpen} />}
        />
      </div>
    </header>
  );
};

export default Header;