import { Button } from '@/shared/ui/button';
import { MessageSquare, Calendar, Play, Star, Shield, Clock } from 'lucide-react';

interface HeroProps {
  handleWhatsAppClick: () => void;
  handleOrçamentoClick: () => void;
}

const Hero = ({ handleWhatsAppClick, handleOrçamentoClick }: HeroProps) => {
  return (
    <div id="hero" className="relative min-h-screen flex items-center gradient-hero overflow-hidden pt-14">
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
      
      <div className="relative z-10 text-center px-4 space-y-5 w-full max-w-sm mx-auto">
        {/* Mobile Stats Header */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="bg-fire-orange/20 px-2 py-1 rounded-full border border-fire-orange/40">
            <span className="text-xs font-bold text-fire-orange">40 Anos</span>
          </div>
          <div className="bg-green-500/20 px-2 py-1 rounded-full border border-green-500/40">
            <span className="text-xs font-bold text-green-400">100% Seguro</span>
          </div>
          <div className="bg-yellow-500/20 px-2 py-1 rounded-full border border-yellow-500/40">
            <span className="text-xs font-bold text-yellow-400">2K+ Shows</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-white font-semibold text-xs bg-fire-gradient/80 px-3 py-1.5 rounded-full backdrop-blur-sm border border-fire-orange/60 shadow-lg">
            <Star className="w-3 h-3 text-yellow-300" />
            Shows Pirotécnicos Premium
          </div>
          
          <h1 className="text-2xl font-bold leading-tight drop-shadow-lg">
            <span className="text-white block">Espetáculos</span>
            <span className="text-fire-gradient block">Pirotécnicos</span>
            <span className="text-white/90 text-lg block">Profissionais</span>
          </h1>
          
          <p className="text-sm text-white/90 drop-shadow-md leading-relaxed px-2">
            4 décadas criando momentos únicos e inesquecíveis com máxima segurança
          </p>
        </div>

        {/* Mobile Action Buttons - Professional */}
        <div className="flex flex-col gap-3 pt-4">
          <Button 
            onClick={handleWhatsAppClick}
            className="w-full h-12 bg-gradient-to-r from-green-600 via-green-500 to-green-600 hover:from-green-500 hover:via-green-400 hover:to-green-500 text-white font-semibold shadow-lg shadow-green-500/30 border border-green-400/30"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            <span className="text-sm">WhatsApp Direto</span>
            <div className="ml-auto flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
              <span className="text-xs text-green-300">Online</span>
            </div>
          </Button>
          
          <Button 
            onClick={handleOrçamentoClick}
            variant="fire"
            className="w-full h-12 font-semibold shadow-lg text-sm"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Solicitar Orçamento Premium
          </Button>

          {/* Mobile Video Button - Enhanced */}
          <Button 
            variant="outline"
            className="w-full h-11 bg-gradient-to-r from-slate-800/60 to-slate-900/60 border-slate-500/40 text-white backdrop-blur-md hover:from-slate-700/60 hover:to-slate-800/60 hover:border-fire-orange/40"
          >
            <div className="w-7 h-7 rounded-full bg-fire-gradient flex items-center justify-center shadow-lg mr-2">
              <Play className="w-3 h-3 text-white ml-0.5" />
            </div>
            <span className="text-sm font-semibold">Ver Nossos Espetáculos</span>
          </Button>
          
          {/* Mobile Trust Footer */}
          <div className="flex items-center justify-center gap-3 pt-2 border-t border-white/10">
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-green-400" />
              <span className="text-xs text-green-400 font-medium">Licenciado</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-blue-400" />
              <span className="text-xs text-blue-400 font-medium">5min resposta</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400" />
              <span className="text-xs text-yellow-400 font-medium">Premium</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
