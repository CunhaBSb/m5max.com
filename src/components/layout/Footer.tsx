import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, Phone, Mail, MapPin, Instagram, Facebook, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Company Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="M5 Max Produções"
                  className="w-12 h-12 invert"
                />
                <div>
                  <div className="font-bold text-lg">M5 Max</div>
                  <div className="text-sm opacity-70">Produções</div>
                </div>
              </div>
              <p className="text-sm opacity-70 leading-relaxed">
                40 anos criando momentos únicos com fogos de artifício profissionais. 
                Segurança, tecnologia e emoção em cada evento.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-8 h-8 bg-fire-orange rounded-full flex items-center justify-center hover:bg-fire-red transition-smooth">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-fire-orange rounded-full flex items-center justify-center hover:bg-fire-red transition-smooth">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 bg-fire-orange rounded-full flex items-center justify-center hover:bg-fire-red transition-smooth">
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Services */}
            <div className="space-y-4">
              <h3 className="font-bold text-fire-orange">Serviços</h3>
              <ul className="space-y-2 text-sm opacity-70">
                <li><a href="#" className="hover:opacity-100 transition-smooth">Shows Pirotécnicos</a></li>
                <li><a href="#" className="hover:opacity-100 transition-smooth">Chá Revelação</a></li>
                <li><a href="#" className="hover:opacity-100 transition-smooth">Kits DIY</a></li>
                <li><a href="#" className="hover:opacity-100 transition-smooth">Eventos Corporativos</a></li>
                <li><a href="#" className="hover:opacity-100 transition-smooth">Casamentos</a></li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h3 className="font-bold text-fire-orange">Suporte</h3>
              <ul className="space-y-2 text-sm opacity-70">
                <li><a href="#" className="hover:opacity-100 transition-smooth">Central de Ajuda</a></li>
                <li><a href="#" className="hover:opacity-100 transition-smooth">FAQ</a></li>
                <li><a href="#" className="hover:opacity-100 transition-smooth">Política de Privacidade</a></li>
                <li><a href="#" className="hover:opacity-100 transition-smooth">Termos de Uso</a></li>
                <li><a href="#" className="hover:opacity-100 transition-smooth">Certificações</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h3 className="font-bold text-fire-orange">Contato</h3>
              <div className="space-y-3 text-sm opacity-70">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>(11) 99999-9999</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>contato@m5max.com.br</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <span>São Paulo - SP<br />Atendemos todo Brasil</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-background/20" />

        {/* CTA Section */}
        <div className="py-8 lg:py-12 text-center">
          <h3 className="text-xl sm:text-2xl font-bold mb-4">
            Pronto para criar um evento <span className="text-fire-gold">inesquecível</span>?
          </h3>
          <p className="text-base sm:text-lg opacity-70 mb-6 lg:mb-8 px-4">
            Solicite seu orçamento agora e transforme sua celebração em um espetáculo
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button variant="fire" size="lg" className="bg-fire-orange hover:bg-fire-red flex items-center gap-2">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
              WhatsApp Direto
            </Button>
            <Button variant="outline" size="lg" className="border-background text-background hover:bg-background hover:text-foreground flex items-center gap-2">
              <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
              Solicitar Orçamento
            </Button>
          </div>
        </div>

        <Separator className="bg-background/20" />

        {/* Bottom */}
        <div className="py-6 lg:py-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm opacity-70">
          <div className="text-center sm:text-left">
            © 2024 M5 Max Produções. Todos os direitos reservados.
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-center">
            <span>CNPJ: 00.000.000/0001-00</span>
            <span className="hidden sm:inline">|</span>
            <span>Licença INMETRO: ABC-123456</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;