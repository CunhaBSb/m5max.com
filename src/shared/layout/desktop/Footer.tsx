import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { Calendar, Mail, MapPin } from "lucide-react";
import { FaYoutube as Youtube } from "react-icons/fa";
import { FaInstagram as Instagram, FaFacebook as Facebook, FaWhatsapp as WhatsApp } from "react-icons/fa";
import { useAppStore } from "@/shared/store/appStore";
import { useAnalytics } from "@/shared/hooks/useAnalytics";
import { generateWhatsAppURL, getWhatsAppMessage } from "@/shared/lib/whatsapp";

export const FooterDesktop = () => {
  const { openFormModal, attribution } = useAppStore();
  const { trackWhatsAppClick } = useAnalytics();

  const handleOrçamentoClick = () => {
    openFormModal({
      source: 'footer',
      audience: 'general',
      page: 'home'
    });
  };

  const handleWhatsAppClick = () => {
    const message = getWhatsAppMessage('general');
    const url = generateWhatsAppURL(
      message,
      attribution?.utm,
      { audience: 'general', source: 'footer' }
    );

    trackWhatsAppClick({
      audience: 'general',
      source: 'footer',
      message_template: message,
      phone_number: '5561982735575'
    });

    window.open(url, '_blank');
  };

  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-fire-gradient flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-xl font-bold">
              Evento <span className="text-fire-orange">inesquecível</span>?
            </h3>
          </div>
          
          <p className="text-base opacity-70 mb-6 leading-relaxed">
            Solicite seu orçamento agora e transforme sua celebração em um espetáculo
          </p>
          
          <div className="flex justify-center gap-3">
            <Button 
              onClick={handleWhatsAppClick}
              className="h-11 bg-green-600 hover:bg-green-500 text-white flex items-center gap-2 text-sm transition-all duration-200"
            >
              <WhatsApp className="w-4 h-4" />
              WhatsApp Direto
              <div className="flex items-center gap-1 ml-1 bg-white/20 px-1.5 py-0.5 rounded-full">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs">Online</span>
              </div>
            </Button>
            
            <Button 
              variant="outline-fire"
              onClick={handleOrçamentoClick}
              className="h-11 flex items-center gap-2 text-sm"
            >
              <Calendar className="w-4 h-4" />
              Orçamento Online
            </Button>
          </div>
        </div>

        <Separator className="bg-slate-800" />
        <div className="py-12">
          <div className="grid grid-cols-4 gap-6">
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-2">
                <img
                  src="/fogosm5.svg"
                  alt="M5 Max Produções"
                  className="w-10 h-10"
                />
                <div>
                  <div className="font-bold text-base text-fire-gradient">M5 Max</div>
                  <div className="text-xs opacity-70">Produções</div>
                </div>
              </div>
              
              <p className="text-xs opacity-70 leading-relaxed">
                40 anos criando momentos únicos com fogos de artifício profissionais. 
                Segurança, tecnologia e emoção em cada evento.
              </p>
              
              <div className="flex justify-start gap-2">
                <a 
                  href="https://instagram.com/m5maxproducoes" 
                  target="_blank"
                  className="w-8 h-8 bg-gradient-to-br from-pink-500 to-fire-orange rounded-full flex items-center justify-center hover:scale-110 transition-all"
                >
                  <Instagram className="w-3.5 h-3.5 text-white" />
                </a>
                <a 
                  href="https://youtube.com/@M5MaxProducoes" 
                  target="_blank"
                  className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center hover:scale-110 transition-all"
                >
                  <Youtube className="w-3.5 h-3.5 text-white" />
                </a>
                <a 
                  href="#" 
                  className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition-all"
                >
                  <Facebook className="w-3.5 h-3.5 text-white" />
                </a>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-fire-orange text-sm flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-fire-orange/20 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-fire-orange rounded-full" />
                </div>
                Serviços
              </h3>
              <ul className="space-y-1.5 text-xs opacity-70">
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
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-fire-orange text-sm flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                </div>
                Suporte
              </h3>
              <ul className="space-y-1.5 text-xs opacity-70">
                <li><a href="#" className="hover:opacity-100 hover:text-blue-400 transition-smooth flex items-center gap-1.5">
                  <div className="w-1 h-1 bg-blue-400/50 rounded-full" />
                  FAQ
                </a></li>
                <li><a href="#" className="hover:opacity-100 hover:text-blue-400 transition-smooth flex items-center gap-1.5">
                  <div className="w-1 h-1 bg-blue-400/50 rounded-full" />
                  Certificações
                </a></li>
                <li><a href="#" className="hover:opacity-100 hover:text-blue-400 transition-smooth flex items-center gap-1.5">
                  <div className="w-1 h-1 bg-blue-400/50 rounded-full" />
                  Política de Privacidade
                </a></li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-fire-orange text-sm flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-green-500/20 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                </div>
                Contato
              </h3>
              <div className="space-y-2 text-xs opacity-70">
                <a 
                  href="https://wa.me/5561982735575"
                  className="flex items-center gap-2 hover:opacity-100 hover:text-green-400 transition-smooth"
                >
                  <WhatsApp className="w-3 h-3" />
                  <span>(61) 98273-5575</span>
                  <div className="flex items-center gap-1 bg-green-500/20 px-1.5 py-0.5 rounded-full ml-2">
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

        <div className="py-6">
          <div className="flex justify-between items-center text-xs opacity-70">
            <div className="text-left">
              © 2024 M5 Max Produções. Todos os direitos reservados.
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono">CNPJ: 04.286.098/0001-46</span>
              <span>|</span>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Licenciado pelo Exército Brasileiro</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterDesktop;