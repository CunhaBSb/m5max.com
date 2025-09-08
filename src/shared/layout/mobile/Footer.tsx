import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { MessageSquare, Mail, MapPin, Phone, Shield, Award } from "lucide-react";
import { FaInstagram as Instagram, FaWhatsapp as WhatsApp, FaYoutube as YouTube } from "react-icons/fa";

export const FooterMobile = () => {
  return (
    <footer className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-black text-slate-300 overflow-hidden">
      {/* Fire-themed background system */}
      <div className="absolute inset-0 bg-gradient-to-br from-fire-orange/8 via-background/95 to-fire-gold/6" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-0.5 h-0.5 bg-fire-gold rounded-full animate-ping opacity-20" style={{ animationDelay: '1s', animationDuration: '4s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-fire-orange rounded-full animate-pulse opacity-15" style={{ animationDelay: '2s', animationDuration: '3s' }} />
      </div>

      {/* Standardized Top Transition */}
      <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-background via-background/85 to-transparent pointer-events-none" />

      <div className="relative container mx-auto px-4 max-w-md">
        {/* Compact CTA Section */}
        <div className="py-8 text-center">
          <div className="inline-flex items-center gap-2 text-white font-medium text-xs bg-fire-orange/15 px-2.5 py-1 rounded-xl mb-6">
            <div className="w-2 h-2 bg-fire-orange rounded-full animate-pulse" />
            Transforme seu evento
          </div>
          
          <h3 className="text-lg font-bold mb-4">
            <span className="text-white">Evento </span>
            <span className="text-fire-gradient">inesquecível?</span>
          </h3>
          
          <p className="text-sm text-white/85 mb-6 leading-relaxed max-w-xs mx-auto">
            Solicite orçamento personalizado e garanta segurança total
          </p>
          
          {/* Compact Stats - Aligned */}
          <div className="flex items-center justify-center gap-1.5 mb-6">
            <div className="bg-fire-orange/15 px-2 py-0.5 rounded-full border border-fire-orange/25 backdrop-blur-sm">
              <span className="text-xs font-bold text-fire-orange">40 Anos</span>
            </div>
            <div className="bg-green-500/15 px-2 py-0.5 rounded-full border border-green-500/25 backdrop-blur-sm">
              <span className="text-xs font-bold text-green-500">100% Seguro</span>
            </div>
            <div className="bg-blue-500/15 px-2 py-0.5 rounded-full border border-blue-500/25 backdrop-blur-sm">
              <span className="text-xs font-bold text-blue-500">2K+ Shows</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 items-center">
            <Button 
              variant="ghost"
              className="w-full max-w-xs h-8 bg-gradient-to-r from-green-600/20 via-green-500/25 to-green-600/20 border border-green-500/40 text-white hover:from-green-500/25 hover:via-green-400/35 hover:to-green-500/25 hover:border-green-400/60 backdrop-blur-md transition-all duration-300 group relative overflow-hidden shadow-sm shadow-green-500/15"
              onClick={() => window.open('https://wa.me/5561982735575', '_blank')}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/8 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700" />
              <WhatsApp className="w-3 h-3 mr-2" />
              <span className="text-xs font-medium">WhatsApp Direto</span>
              <div className="flex items-center gap-1 ml-auto bg-green-400/15 px-1.5 py-0.5 rounded-full">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-green-200">24h</span>
              </div>
            </Button>
            
            <Button
              variant="outline-fire"
              className="w-full max-w-xs h-8 font-medium text-sm"
              onClick={() => {/* Add conversion modal logic */}}
            >
              <MessageSquare className="w-3 h-3 mr-2" />
              <span className="text-xs">Orçamento Gratuito</span>
              <div className="flex items-center gap-1 ml-auto bg-fire-orange/15 px-1.5 py-0.5 rounded-full">
                <span className="text-xs text-fire-orange font-bold">Grátis</span>
              </div>
            </Button>
          </div>
        </div>

        {/* Professional Separator */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-fire-orange/20 to-transparent h-px" />
          <div className="bg-gradient-to-r from-transparent via-slate-700/50 to-transparent h-px" />
        </div>

        {/* Company Info Section - Properly Aligned */}
        <div className="py-6 text-center">
          {/* Logo Section - Centered */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <img
              src="/fogosm5.svg"
              alt="M5 Max"
              className="w-10 h-10"
            />
            <div className="text-left">
              <div className="font-bold text-base text-fire-gradient">M5 Max</div>
              <div className="text-xs text-white/80">Produções Pirotécnicas</div>
            </div>
          </div>
          
          {/* Compact Grid - Properly Spaced */}
          <div className="grid grid-cols-2 gap-2 mb-6 max-w-xs mx-auto">
            <Card className="bg-gradient-to-br from-fire-orange/10 to-fire-gold/5 border border-fire-orange/25 backdrop-blur-sm">
              <CardContent className="p-2.5">
                <div className="flex items-center justify-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-green-400" />
                  <div className="text-center">
                    <div className="text-xs font-bold text-green-400">Certificado</div>
                    <div className="text-xs text-white/75">Exército BR</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-fire-orange/10 to-fire-gold/5 border border-fire-orange/25 backdrop-blur-sm">
              <CardContent className="p-2.5">
                <div className="flex items-center justify-center gap-2">
                  <Award className="w-3.5 h-3.5 text-fire-orange" />
                  <div className="text-center">
                    <div className="text-xs font-bold text-fire-orange">Nacional</div>
                    <div className="text-xs text-white/75">Todo Brasil</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info - Centered Layout */}
          <div className="space-y-2 mb-6">
            <a 
              href="https://wa.me/5561982735575"
              className="flex items-center justify-center gap-2 text-xs text-white/85 hover:text-green-400 transition-colors"
            >
              <Phone className="w-3 h-3" />
              <span>(61) 98273-5575</span>
            </a>
            <div className="flex items-center justify-center gap-2 text-xs text-white/85">
              <Mail className="w-3 h-3" />
              <span>fogosm5.max@gmail.com</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-white/85">
              <MapPin className="w-3 h-3" />
              <span>Luziânia - GO • Atendemos todo Brasil</span>
            </div>
          </div>

          {/* Social Links - Centered */}
          <div className="flex justify-center gap-3">
            <a 
              href="https://instagram.com/fogosm5" 
              target="_blank"
              className="w-9 h-9 bg-gradient-to-br from-pink-500/20 to-fire-orange/15 border border-pink-400/30 rounded-lg flex items-center justify-center hover:scale-110 hover:border-pink-400/50 transition-all duration-300"
            >
              <Instagram className="w-4 h-4 text-pink-400" />
            </a>
            <a 
              href="https://youtube.com/@m5maxproducoes" 
              target="_blank"
              className="w-9 h-9 bg-gradient-to-br from-red-600/20 to-red-500/15 border border-red-400/30 rounded-lg flex items-center justify-center hover:scale-110 hover:border-red-400/50 transition-all duration-300"
            >
              <YouTube className="w-4 h-4 text-red-400" />
            </a>
          </div>
        </div>

        {/* Professional Separator */}
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-fire-gold/15 to-transparent h-px" />
          <div className="bg-gradient-to-r from-transparent via-slate-700/40 to-transparent h-px" />
        </div>

        {/* Bottom Section - Properly Aligned */}
        <div className="pb-6 text-center">
          {/* Trust Badge - Centered */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-fire-orange/10 to-fire-gold/10 border border-fire-orange/25 px-3 py-1.5 rounded-full backdrop-blur-sm mb-4">
            <Shield className="w-3 h-3 text-fire-orange" />
            <span className="text-xs font-medium text-fire-orange">Licenciado pelo Exército Brasileiro</span>
          </div>

          {/* Copyright - Hierarchical */}
          <div className="space-y-1 mb-3">
            <div className="text-xs text-white/70 font-medium">
              © 2024 M5 Max Produções
            </div>
            <div className="text-xs text-white/60 font-mono">
              CNPJ: 04.286.098/0001-46
            </div>
          </div>

          {/* Final Trust Indicators - Balanced */}
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-white/70">Seguro</span>
            </div>
            <div className="w-px h-3 bg-slate-700/50" />
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-fire-orange rounded-full animate-pulse" />
              <span className="text-xs text-white/70">Certificado</span>
            </div>
            <div className="w-px h-3 bg-slate-700/50" />
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-xs text-white/70">Confiável</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterMobile;