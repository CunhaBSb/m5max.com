import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, Phone, Mail, MapPin, Instagram, Facebook, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img
                  src="/m5logo.svg"
                  alt="M5 Max Produções"
                  className="w-10 h-10 invert"
                />
                <div>
                  <div className="font-bold text-base">M5 Max</div>
                  <div className="text-xs opacity-70">Produções</div>
                </div>
              </div>
              <p className="text-xs opacity-70 leading-relaxed">
                40 anos criando momentos únicos com fogos de artifício profissionais. 
                Segurança, tecnologia e emoção em cada evento.
              </p>
              <div className="flex gap-2">
                <a href="#" className="w-7 h-7 bg-fire-orange rounded-full flex items-center justify-center hover:bg-fire-red transition-smooth">
                  <Instagram className="w-3 h-3" />
                </a>
                <a href="#" className="w-7 h-7 bg-fire-orange rounded-full flex items-center justify-center hover:bg-fire-red transition-smooth">
                  <Facebook className="w-3 h-3" />
                </a>
                <a href="#" className="w-7 h-7 bg-fire-orange rounded-full flex items-center justify-center hover:bg-fire-red transition-smooth">
                  <Youtube className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Services */}
            <div className="space-y-3">
              <h3 className="font-bold text-fire-orange text-sm">Serviços</h3>
              <ul className="space-y-1.5 text-xs opacity-70">
                <li><a href="#" className="hover:opacity-100 transition-smooth">Shows Pirotécnicos</a></li>
                <li><a href="#" className="hover:opacity-100 transition-smooth">Chá Revelação</a></li>
                <li><a href="#" className="hover:opacity-100 transition-smooth">Kits DIY</a></li>
                <li><a href="#" className="hover:opacity-100 transition-smooth">Eventos Corporativos</a></li>
                <li><a href="#" className="hover:opacity-100 transition-smooth">Casamentos</a></li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-3">
              <h3 className="font-bold text-fire-orange text-sm">Suporte</h3>
              <ul className="space-y-1.5 text-xs opacity-70">
                <li><a href="#" className="hover:opacity-100 transition-smooth">Central de Ajuda</a></li>
                <li><a href="#" className="hover:opacity-100 transition-smooth">FAQ</a></li>
                <li><a href="#" className="hover:opacity-100 transition-smooth">Política de Privacidade</a></li>
                <li><a href="#" className="hover:opacity-100 transition-smooth">Termos de Uso</a></li>
                <li><a href="#" className="hover:opacity-100 transition-smooth">Certificações</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-3">
              <h3 className="font-bold text-fire-orange text-sm">Contato</h3>
              <div className="space-y-2 text-xs opacity-70">
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3" />
                  <span>(61) 98273-5575</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3 h-3" />
                  <span>fogosm5.max@gmail.com</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-3 h-3 mt-0.5" />
                  <span>Luziânia - GO<br />Atendemos todo Brasil</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-slate-800" />

        {/* CTA Section */}
        <div className="py-6 lg:py-8 text-center">
          <h3 className="text-lg sm:text-xl font-bold mb-3">
            Pronto para criar um evento <span className="text-fire-gold">inesquecível</span>?
          </h3>
          <p className="text-sm sm:text-base opacity-70 mb-4 lg:mb-6 px-4">
            Solicite seu orçamento agora e transforme sua celebração em um espetáculo
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center px-4">
            <Button variant="fire" size="default" className="bg-fire-orange hover:bg-fire-red flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              WhatsApp Direto
            </Button>
            <Button variant="outline" size="default" className="border-slate-600 text-slate-300 bg-transparent hover:bg-slate-800 hover:border-slate-500 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Solicitar Orçamento
            </Button>
          </div>
        </div>

        <Separator className="bg-slate-800" />

        {/* Bottom */}
        <div className="py-4 lg:py-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs opacity-70">
          <div className="text-center sm:text-left">
            © 2024 M5 Max Produções. Todos os direitos reservados.
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-4 text-center">
            <span>CNPJ: 04.286.098/0001-46</span>
            <span className="hidden sm:inline">|</span>
            <span>Licença INMETRO: ABC-123456</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;