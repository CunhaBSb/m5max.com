import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { MessageSquare, Mail, MapPin, Youtube } from "lucide-react";
import { FaInstagram as Instagram, FaFacebook as Facebook, FaWhatsapp as WhatsApp } from "react-icons/fa";

export const FooterMobile = () => {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="py-4 xs:py-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2 xs:mb-3">
            <div className="w-6 h-6 xs:w-8 xs:h-8 rounded-full bg-fire-gradient flex items-center justify-center">
              <MessageSquare className="w-3 h-3 xs:w-4 xs:h-4 text-white" />
            </div>
            <h3 className="text-base xs:text-lg font-bold">
              Evento <span className="text-fire-orange">inesquecível</span>?
            </h3>
          </div>
          
          <p className="text-xs xs:text-sm opacity-70 mb-3 xs:mb-4 px-2 xs:px-4 leading-relaxed">
            Solicite seu orçamento agora e transforme sua celebração em um espetáculo
          </p>
          
          <div className="flex items-center justify-center gap-2 xs:gap-3 mb-3">
            <div className="bg-fire-orange/10 px-2 py-1 rounded-full border border-fire-orange/30">
              <span className="text-xs font-bold text-fire-orange">40 Anos</span>
            </div>
            <div className="bg-green-500/10 px-2 py-1 rounded-full border border-green-500/30">
              <span className="text-xs font-bold text-green-500">100% Seguro</span>
            </div>
          </div>
          
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
          </div>
        </div>

        <Separator className="bg-slate-800" />
        <div className="py-6 xs:py-8">
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 xs:gap-6">
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
              
              <div className="grid grid-cols-3 gap-2">
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
                <li><a href="#" className="hover:opacity-100 hover:text-fire-orange transition-smooth flex items-center gap-1.5">
                  <div className="w-1 h-1 bg-fire-orange/50 rounded-full" />
                  Casamentos
                </a></li>
              </ul>
            </div>

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
              </ul>
            </div>

            <div className="space-y-1.5 xs:space-y-2 xs:col-span-2">
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
                  <WhatsApp className="w-3 h-3" />
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

        <div className="py-3 xs:py-4">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="bg-gradient-to-r from-fire-orange/10 to-fire-gold/10 border border-fire-orange/30 px-3 py-1.5 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 bg-fire-orange rounded-full animate-pulse" />
              <span className="text-xs font-medium text-fire-orange">Licenciado pelo Exército</span>
            </div>
          </div>

          <div className="flex flex-col xs:flex-row justify-between items-center gap-2 xs:gap-3 text-xs opacity-70">
            <div className="text-center xs:text-left">
              © 2024 M5 Max Produções. Todos os direitos reservados.
            </div>
            <div className="flex flex-col xs:flex-row items-center gap-1 xs:gap-3">
              <span className="font-mono">CNPJ: 04.286.098/0001-46</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4 mt-2">
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

export default FooterMobile;