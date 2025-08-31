import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { MessageSquare, Phone, Mail, MapPin, Youtube } from "lucide-react";
import { FaInstagram as Instagram, FaFacebook as Facebook } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile-First CTA Section */}
        <div className="py-4 xs:py-6 lg:py-8 text-center">
          {/* Mobile Compact Header */}
          <div className="flex items-center justify-center gap-2 mb-2 xs:mb-3">
            <div className="w-6 h-6 xs:w-8 xs:h-8 rounded-full bg-fire-gradient flex items-center justify-center">
              <MessageSquare className="w-3 h-3 xs:w-4 xs:h-4 text-white" />
            </div>
            <h3 className="text-base xs:text-lg sm:text-xl font-bold">
              Evento <span className="text-fire-orange">inesquecível</span>?
            </h3>
          </div>
          
          <p className="text-xs xs:text-sm sm:text-base opacity-70 mb-3 xs:mb-4 lg:mb-6 px-2 xs:px-4 leading-relaxed">
            Solicite seu orçamento agora e transforme sua celebração em um espetáculo
          </p>
          
          {/* Mobile Quick Stats */}
          <div className="flex items-center justify-center gap-2 xs:gap-3 mb-3 sm:hidden">
            <div className="bg-fire-orange/10 px-2 py-1 rounded-full border border-fire-orange/30">
              <span className="text-xs font-bold text-fire-orange">40 Anos</span>
            </div>
            <div className="bg-green-500/10 px-2 py-1 rounded-full border border-green-500/30">
              <span className="text-xs font-bold text-green-500">100% Seguro</span>
            </div>
          </div>
          
          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 justify-center px-2 xs:px-4">
            <Button 
              variant="fire" 
              size="sm"
              className="h-10 xs:h-11 bg-fire-orange hover:bg-fire-red flex items-center gap-1.5 xs:gap-2 text-xs xs:text-sm"
              onClick={() => window.open('https://wa.me/5561982735575', '_blank')}
            >
              <MessageSquare className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
              WhatsApp Direto
              <div className="hidden xs:flex items-center gap-1 ml-1 bg-white/20 px-1.5 py-0.5 rounded-full">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs">Online</span>
              </div>
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="h-10 xs:h-11 border-slate-600 text-slate-300 bg-transparent hover:bg-slate-800 hover:border-slate-500 flex items-center gap-1.5 xs:gap-2 text-xs xs:text-sm"
            >
              <Phone className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
              Solicitar Orçamento
              <div className="hidden xs:flex items-center gap-1 ml-1 bg-blue-500/20 px-1.5 py-0.5 rounded-full">
                <span className="text-xs text-blue-300 font-bold">Grátis</span>
              </div>
            </Button>
          </div>
        </div>

        <Separator className="bg-slate-800" />
        {/* Mobile-Optimized Footer Content */}
        <div className="py-6 xs:py-8 sm:py-12">
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-6 lg:gap-6">
            {/* Company Info - Mobile First */}
            <div className="space-y-3 xs:space-y-4 text-center xs:text-left">
              <div className="flex items-center justify-center xs:justify-start gap-2">
                <img
                  src="/fogosm5.svg"
                  alt="M5 Max Produções"
                  className="w-8 h-8 xs:w-10 xs:h-10"
                />
                <div>
                  <div className="font-bold text-sm xs:text-base text-fire-gradient">M5 Max</div>
                  <div className="text-xs opacity-70">Produções</div>
                </div>
              </div>
              
              {/* Mobile Stats */}
              <div className="grid grid-cols-3 gap-2 xs:hidden">
                <div className="bg-slate-800/50 p-2 rounded-lg text-center">
                  <div className="text-sm font-bold text-fire-orange">40+</div>
                  <div className="text-xs opacity-70">Anos</div>
                </div>
                <div className="bg-slate-800/50 p-2 rounded-lg text-center">
                  <div className="text-sm font-bold text-green-400">100%</div>
                  <div className="text-xs opacity-70">Seguro</div>
                </div>
                <div className="bg-slate-800/50 p-2 rounded-lg text-center">
                  <div className="text-sm font-bold text-blue-400">2K+</div>
                  <div className="text-xs opacity-70">Shows</div>
                </div>
              </div>
              
              <p className="text-xs opacity-70 leading-relaxed hidden xs:block">
                40 anos criando momentos únicos com fogos de artifício profissionais. 
                Segurança, tecnologia e emoção em cada evento.
              </p>
              
              {/* Enhanced Social Links */}
              <div className="flex justify-center xs:justify-start gap-2">
                <a 
                  href="https://instagram.com/m5maxproducoes" 
                  target="_blank"
                  className="w-7 h-7 xs:w-8 xs:h-8 bg-gradient-to-br from-pink-500 to-fire-orange rounded-full flex items-center justify-center hover:scale-110 transition-all"
                >
                  <Instagram className="w-3 h-3 xs:w-3.5 xs:h-3.5 text-white" />
                </a>
                <a 
                  href="https://youtube.com/@M5MaxProducoes" 
                  target="_blank"
                  className="w-7 h-7 xs:w-8 xs:h-8 bg-red-600 rounded-full flex items-center justify-center hover:scale-110 transition-all"
                >
                  <Youtube className="w-3 h-3 xs:w-3.5 xs:h-3.5 text-white" />
                </a>
                <a 
                  href="#" 
                  className="w-7 h-7 xs:w-8 xs:h-8 bg-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition-all"
                >
                  <Facebook className="w-3 h-3 xs:w-3.5 xs:h-3.5 text-white" />
                </a>
              </div>
            </div>

            {/* Services - Compact Mobile */}
            <div className="space-y-2 xs:space-y-3">
              <h3 className="font-bold text-fire-orange text-xs xs:text-sm flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-fire-orange/20 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-fire-orange rounded-full" />
                </div>
                Serviços
              </h3>
              <ul className="space-y-1 xs:space-y-1.5 text-xs opacity-70">
                <li><a href="#" className="hover:opacity-100 hover:text-fire-orange transition-smooth flex items-center gap-1.5">
                  <div className="w-1 h-1 bg-fire-orange/50 rounded-full" />
                  Shows Pirotécnicos
                </a></li>
                <li><a href="#" className="hover:opacity-100 hover:text-fire-orange transition-smooth flex items-center gap-1.5">
                  <div className="w-1 h-1 bg-fire-orange/50 rounded-full" />
                  Chá Revelação
                </a></li>
                <li><a href="#" className="hover:opacity-100 hover:text-fire-orange transition-smooth flex items-center gap-1.5">
                  <div className="w-1 h-1 bg-fire-orange/50 rounded-full" />
                  Eventos Corporativos
                </a></li>
                <li className="xs:hidden"><a href="#" className="hover:opacity-100 hover:text-fire-orange transition-smooth flex items-center gap-1.5">
                  <div className="w-1 h-1 bg-fire-orange/50 rounded-full" />
                  Casamentos
                </a></li>
              </ul>
            </div>

            {/* Support - Mobile Optimized */}
            <div className="space-y-2 xs:space-y-3">
              <h3 className="font-bold text-fire-orange text-xs xs:text-sm flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                </div>
                Suporte
              </h3>
              <ul className="space-y-1 xs:space-y-1.5 text-xs opacity-70">
                <li><a href="#" className="hover:opacity-100 hover:text-blue-400 transition-smooth flex items-center gap-1.5">
                  <div className="w-1 h-1 bg-blue-400/50 rounded-full" />
                  FAQ
                </a></li>
                <li><a href="#" className="hover:opacity-100 hover:text-blue-400 transition-smooth flex items-center gap-1.5">
                  <div className="w-1 h-1 bg-blue-400/50 rounded-full" />
                  Certificações
                </a></li>
                <li className="hidden xs:block"><a href="#" className="hover:opacity-100 hover:text-blue-400 transition-smooth flex items-center gap-1.5">
                  <div className="w-1 h-1 bg-blue-400/50 rounded-full" />
                  Política de Privacidade
                </a></li>
              </ul>
            </div>

            {/* Contact - Enhanced Mobile */}
            <div className="space-y-2 xs:space-y-3 xs:col-span-2 lg:col-span-1">
              <h3 className="font-bold text-fire-orange text-xs xs:text-sm flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-green-500/20 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                </div>
                Contato
              </h3>
              <div className="space-y-1.5 xs:space-y-2 text-xs opacity-70">
                <a 
                  href="https://wa.me/5561982735575"
                  className="flex items-center gap-2 hover:opacity-100 hover:text-green-400 transition-smooth"
                >
                  <Phone className="w-3 h-3" />
                  <span>(61) 98273-5575</span>
                  <div className="flex items-center gap-1 bg-green-500/20 px-1.5 py-0.5 rounded-full ml-auto xs:ml-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-green-400 font-medium">24h</span>
                  </div>
                </a>
                <div className="flex items-center gap-2">
                  <Mail className="w-3 h-3" />
                  <span>fogosm5.max@gmail.com</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-3 h-3 mt-0.5" />
                  <span>Luziânia - GO<br />
                    <span className="text-fire-orange font-medium">Atendemos todo Brasil</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-slate-800" />

        {/* Enhanced Bottom Section - Mobile Professional */}
        <div className="py-3 xs:py-4 lg:py-6">
          {/* Mobile Certification Badge */}
          <div className="flex items-center justify-center gap-2 mb-3 xs:hidden">
            <div className="bg-gradient-to-r from-fire-orange/10 to-fire-gold/10 border border-fire-orange/30 px-3 py-1.5 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 bg-fire-orange rounded-full animate-pulse" />
              <span className="text-xs font-medium text-fire-orange">Licenciado pelo Exército</span>
            </div>
          </div>

          {/* Main Bottom Content */}
          <div className="flex flex-col xs:flex-row justify-between items-center gap-2 xs:gap-3 text-xs opacity-70">
            <div className="text-center xs:text-left">
              © 2024 M5 Max Produções. Todos os direitos reservados.
            </div>
            <div className="flex flex-col xs:flex-row items-center gap-1 xs:gap-3 sm:gap-4 text-center">
              <span className="font-mono">CNPJ: 04.286.098/0001-46</span>
              <span className="hidden xs:inline">|</span>
              <div className="hidden xs:flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Licenciado pelo Exército Brasileiro</span>
              </div>
            </div>
          </div>
          
          {/* Mobile Trust Indicators */}
          <div className="flex items-center justify-center gap-4 mt-2 xs:hidden">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs opacity-70">Seguro</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-fire-orange rounded-full animate-pulse" />
              <span className="text-xs opacity-70">Certificado</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-xs opacity-70">Confiável</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;