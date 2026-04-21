import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/shared/ui/dialog';
import { Sparkles, Building2, Church, CalendarHeart, ChevronRight, CheckCircle2, ArrowLeft, Mail, X } from 'lucide-react';
import { FaWhatsapp as WhatsApp } from 'react-icons/fa';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { supabase } from '@/shared/lib/supabase';

interface SaoJoaoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'selection' | 'form' | 'success';

export const SaoJoaoModal = ({ isOpen, onClose }: SaoJoaoModalProps) => {
  const [step, setStep] = useState<Step>('selection');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    clube: '',
    date: '',
    whatsapp: '',
    duration: '',
    email: ''
  });

  const handleSelect = (audienceType: 'b2b' | 'general') => {
    // Optionally store audienceType
    setStep('form');
  };

  const handleBack = () => {
    if (step === 'form') setStep('selection');
  };

  const formatWhatsAppMessage = () => {
    return `Olá Marcos, sou ${formData.name || '[NOME DO CLIENTE]'} do ${formData.clube || '[NOME DO CLUBE/CONDOMÍNIO]'}. 

Gostaria de receber a proposta completa para a Festa Junina 2026 com show pirotécnico premium sincronizado. 

Data aproximada: ${formData.date || '[DATA INFORMADA]'}
Duração desejada: ${formData.duration || '[NÃO INFORMADA]'}
${formData.email ? `E-mail: ${formData.email}` : ''}`;
  };

  const simulateSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        nome_completo: formData.name,
        email: formData.email || null,
        whatsapp: formData.whatsapp,
        tipo_solicitacao: 'festa_junina',
        tipo_evento: 'Festa Junina',
        data_evento: formData.date || null,
        localizacao_evento: formData.clube,
        kit_selecionado: formData.duration,
        observacoes: `Duração desejada: ${formData.duration}. Lead vindo da modal de São João 2026.`,
        enviado_email: false,
      };

      const { error } = await supabase.from('solicitacoes_orcamento').insert(payload);
      
      if (error) {
        console.error('Erro ao salvar lead no Supabase:', error);
      }
    } catch (err) {
      console.error('Erro inesperado ao salvar lead:', err);
    } finally {
      setIsSubmitting(false);
      setStep('success');
    }
  };

  const handleWhatsAppSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.whatsapp) return;

    // Open WhatsApp
    const msg = encodeURIComponent(formatWhatsAppMessage());
    window.open(`https://wa.me/5561982735575?text=${msg}`, '_blank');

    // Proceed to success
    await simulateSubmit();
  };

  const handleEmailSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.whatsapp) return;

    // Proceed to success directly
    await simulateSubmit();
  };

  // Helper to format WhatsApp number as user types
  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    let formatted = value;
    if (value.length > 2) {
      formatted = `(${value.slice(0, 2)}) `;
      if (value.length > 7) {
        formatted += `${value.slice(2, 7)}-${value.slice(7)}`;
      } else {
        formatted += value.slice(2);
      }
    }
    setFormData({ ...formData, whatsapp: formatted });
  };

  const renderSelection = () => (
    <>
      {/* Trust Text */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4">
        <span className="text-xs sm:text-sm font-medium text-white/90 tracking-wide">
          ⭐ 40 anos • +2.000 eventos • Já iluminamos os maiores clubes de Brasília
        </span>
      </div>

      {/* Titles */}
      <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-2 drop-shadow-lg">
        Reserve sua data para a <br className="hidden sm:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-fire-gold to-orange-500">
          Festa Junina 2026
        </span>
      </h2>

      <p className="text-base sm:text-lg text-white/80 max-w-xl mx-auto mb-6 leading-relaxed font-light">
        Shows pirotécnicos premium sincronizados • <span className="font-semibold text-white/95">Imagens que viralizam!</span>
      </p>

      {/* Selection Cards */}
      <div className="w-full max-w-2xl flex flex-col gap-2.5 mx-auto">

        {/* Card 1: Premium / Mais procurado */}
        <button
          onClick={() => handleSelect('b2b')}
          onMouseEnter={() => setHoveredCard(1)}
          onMouseLeave={() => setHoveredCard(null)}
          className="relative group w-full text-left overflow-hidden rounded-xl border border-fire-gold/50 bg-gradient-to-r from-fire-gold/10 via-orange-500/10 to-fire-gold/5 p-3 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_-10px_rgba(251,146,60,0.5)]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-fire-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fire-gold to-orange-600 flex items-center justify-center shadow-lg shrink-0">
                <Building2 className="w-5 h-5 text-black" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-white font-bold text-base sm:text-lg">Festa Junina em Clube ou Condomínio</span>
                  <span className="hidden sm:inline-flex items-center gap-1 bg-fire-orange text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> MAIS PROCURADO
                  </span>
                </div>
                <span className="text-white/70 text-sm block sm:hidden mb-0.5 text-fire-orange font-bold tracking-wider text-[10px] uppercase"><CheckCircle2 className="w-3 h-3 inline-block mr-1" /> MAIS PROCURADO</span>
                <p className="text-white/60 text-xs sm:text-sm">Estrutura completa e show de grande impacto visual.</p>
              </div>
            </div>
            <ChevronRight className={`w-5 h-5 text-fire-gold transition-transform duration-300 ${hoveredCard === 1 ? 'translate-x-1' : ''}`} />
          </div>
        </button>

        {/* Card 2 */}
        <button
          onClick={() => handleSelect('b2b')}
          onMouseEnter={() => setHoveredCard(2)}
          onMouseLeave={() => setHoveredCard(null)}
          className="relative group w-full text-left overflow-hidden rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 p-3 transition-all duration-300 hover:border-white/20"
        >
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <Church className="w-4 h-4 text-white/80" />
              </div>
              <div>
                <span className="text-white font-semibold text-sm sm:text-base block">Festa Junina em Associação ou Igreja</span>
                <p className="text-white/50 text-xs sm:text-sm mt-0.5">Formatos adequados para eventos paroquiais e comunitários.</p>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 text-white/40 transition-transform duration-300 ${hoveredCard === 2 ? 'translate-x-1 text-white/80' : ''}`} />
          </div>
        </button>

        {/* Card 3 */}
        <button
          onClick={() => handleSelect('general')}
          onMouseEnter={() => setHoveredCard(3)}
          onMouseLeave={() => setHoveredCard(null)}
          className="relative group w-full text-left overflow-hidden rounded-xl border border-white/5 bg-transparent hover:bg-white/5 p-3 transition-all duration-300"
        >
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                <CalendarHeart className="w-4 h-4 text-white/60" />
              </div>
              <div>
                <span className="text-white/90 font-medium text-sm sm:text-base block">Outro tipo de evento</span>
                <p className="text-white/50 text-xs sm:text-sm mt-0.5">Réveillon, aniversário, casamento, etc.</p>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 text-white/30 transition-transform duration-300 ${hoveredCard === 3 ? 'translate-x-1 text-white/60' : ''}`} />
          </div>
        </button>
      </div>
    </>
  );

  const renderForm = () => (
    <div className="w-full text-left flex flex-col md:flex-row gap-6 lg:gap-8">
      {/* Left Column: Context & Trust */}
      <div className="flex-1 flex flex-col animate-fade-in-up" style={{ animationFillMode: 'both' }}>
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-3 lg:mb-4 w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Voltar para opções</span>
        </button>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3 leading-[1.15]">
          Sua proposta exclusiva para a{' '}
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-fire-gold to-orange-500 mt-1">
            Festa Junina 2026
          </span>
        </h2>

        <p className="text-white/70 text-base lg:text-lg mb-5 leading-relaxed font-light">
          Preencha os dados e receba em até 24h sua proposta completa + simulação 3D do show no espaço do seu clube.
        </p>

        <div className="hidden md:block mt-auto pb-2 space-y-4">
          <h3 className="text-sm font-bold text-white/90 uppercase tracking-widest border-b border-white/10 pb-3 mb-4">
            Garantia M5 Max
          </h3>
          <div className="flex flex-col gap-5">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0 mt-0.5" />
              <span className="text-sm text-white/80 leading-relaxed font-medium">Espetáculo 100% legalizado. Cuidamos de todos os alvarás e licenças.</span>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0 mt-0.5" />
              <span className="text-sm text-white/80 leading-relaxed font-medium">Aprovação e vistoria técnica rigorosa junto ao Corpo de Bombeiros.</span>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0 mt-0.5" />
              <span className="text-sm text-white/80 leading-relaxed font-medium">Bônus exclusivo Festa Junina: fotos + vídeo profissional.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Form Container */}
      <div className="flex-1 w-full max-w-md mx-auto md:mx-0 animate-fade-in-up" style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
        <div className="bg-white/5 border border-white/10 p-4 sm:p-5 rounded-2xl shadow-2xl backdrop-blur-md relative overflow-hidden">
          {/* Subtle inner glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-1 bg-gradient-to-r from-transparent via-fire-gold/50 to-transparent blur-sm"></div>

          <form className="space-y-4 relative z-10">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-white/90 ml-1">Nome completo <span className="text-fire-orange">*</span></label>
              <Input
                required
                placeholder="Ex: João Silva"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-black/50 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-fire-gold h-10 rounded-xl px-4"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-white/40 ml-1">E-mail <span className="text-[10px] uppercase tracking-wider opacity-50 ml-1">(Opcional)</span></label>
              <Input
                type="email"
                placeholder="Ex: joao@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-black/50 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-fire-gold h-10 rounded-xl px-4"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-white/90 ml-1">Local do Evento <span className="text-fire-orange">*</span></label>
              <Input
                required
                placeholder="Ex: Iate Clube de Brasília - DF"
                value={formData.clube}
                onChange={(e) => setFormData({ ...formData, clube: e.target.value })}
                className="bg-black/50 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-fire-gold h-10 rounded-xl px-4"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-white/90 ml-1">Data da Festa Junina <span className="text-fire-orange">*</span></label>
              <Input
                required
                type="date"
                placeholder="dd/mm/aaaa"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="bg-black/50 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-fire-gold h-10 rounded-xl px-4 [color-scheme:dark]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-white/90 ml-1">WhatsApp <span className="text-fire-orange">*</span></label>
              <Input
                required
                placeholder="(61) 9 9999-9999"
                value={formData.whatsapp}
                onChange={handleWhatsAppChange}
                className="bg-black/50 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-fire-gold h-10 rounded-xl px-4"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-white/90 ml-1">Duração do show <span className="text-fire-orange">*</span></label>
              <Select
                value={formData.duration}
                onValueChange={(value) => setFormData({ ...formData, duration: value })}
              >
                <SelectTrigger className="bg-black/50 border-white/10 text-white focus:ring-fire-gold h-10 rounded-xl px-4">
                  <SelectValue placeholder="Selecione a duração" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/10 text-white max-h-[250px] overflow-y-auto custom-scrollbar">
                  <SelectItem value="1 minuto">1 minuto</SelectItem>
                  <SelectItem value="2 minutos">2 minutos</SelectItem>
                  <SelectItem value="3 minutos">3 minutos</SelectItem>
                  <SelectItem value="4 minutos">4 minutos</SelectItem>
                  <SelectItem value="5 minutos">5 minutos</SelectItem>
                  <SelectItem value="6 minutos">6 minutos</SelectItem>
                  <SelectItem value="7 minutos">7 minutos</SelectItem>
                  <SelectItem value="8 minutos">8 minutos</SelectItem>
                  <SelectItem value="9 minutos">9 minutos</SelectItem>
                  <SelectItem value="10 minutos">10 minutos</SelectItem>
                  <SelectItem value="12 minutos">12 minutos</SelectItem>
                  <SelectItem value="15 minutos">15 minutos</SelectItem>
                  <SelectItem value="20 minutos">20 minutos</SelectItem>
                  <SelectItem value="25 minutos">25 minutos</SelectItem>
                  <SelectItem value="30 minutos">30 minutos</SelectItem>
                  <SelectItem value="Personalizado">Personalizado / Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <Button
                disabled={!formData.name || !formData.clube || !formData.date || !formData.duration || formData.whatsapp.length < 14 || isSubmitting}
                onClick={handleWhatsAppSubmit}
                className="w-full h-11 bg-green-500 hover:bg-green-600 text-white font-bold text-base rounded-xl shadow-[0_0_20px_-5px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_-5px_rgba(34,197,94,0.5)] transition-all"
              >
                <WhatsApp className="w-4 h-4 mr-2" />
                Receber minha proposta no WhatsApp
              </Button>
              <Button
                variant="outline"
                disabled={!formData.name || !formData.clube || !formData.date || !formData.duration || formData.whatsapp.length < 14 || isSubmitting}
                onClick={handleEmailSubmit}
                className="w-full h-10 border-white/10 bg-transparent text-white/70 hover:bg-white/5 hover:text-white font-medium rounded-xl transition-all"
              >
                <Mail className="w-4 h-4 mr-2 opacity-70" />
                Receber proposta por e-mail
              </Button>
            </div>
          </form>

          {/* Mobile Trust Section */}
          <div className="md:hidden mt-5 pt-4 border-t border-white/10 space-y-3">
            <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest text-center">
              Garantia M5 Max
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <span className="text-xs text-white/70 leading-relaxed">Espetáculo 100% legalizado.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <span className="text-xs text-white/70 leading-relaxed">Vistoria junto aos Bombeiros.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <span className="text-xs text-white/70 leading-relaxed">Bônus: fotos + vídeo para o Instagram.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="w-full text-center flex flex-col items-center justify-center py-6">
      <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 animate-fade-in-up" style={{ animationFillMode: 'both' }}>
        <CheckCircle2 className="w-10 h-10 text-green-400" />
      </div>

      <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4 animate-fade-in-up" style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
        Obrigado! Sua proposta está sendo preparada.
      </h2>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8 text-left max-w-lg w-full animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
        <p className="text-white/90 font-medium mb-3">Em até 24 horas você receberá:</p>
        <ul className="text-base text-white/70 space-y-2 ml-4 list-disc marker:text-fire-gold mb-6">
          <li>Proposta personalizada</li>
          <li>Simulação 3D</li>
          <li>Vídeo de referência de show em clube</li>
        </ul>
        <p className="text-white/90 text-sm font-medium">Enquanto isso, assista este show que fizemos para um clube de Brasília:</p>
      </div>

      {/* Video Block */}
      <div className="w-full max-w-lg aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl relative bg-black/50 mb-8 animate-fade-in-up" style={{ animationDelay: '0.45s', animationFillMode: 'both' }}>
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/assets/videos/home-hero-desktop.webm"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
          <span className="text-white/90 text-sm font-medium drop-shadow-md">Show Pirotécnico Premium</span>
        </div>
      </div>

      <div className="w-full flex justify-center animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
        <Button
          onClick={() => {
            onClose();
            setTimeout(() => {
              setStep('selection'); // reset state
              setFormData({ name: '', clube: '', date: '', whatsapp: '', duration: '', email: '' });
            }, 300);
          }}
          className="w-full max-w-sm h-12 bg-white text-black hover:bg-gray-200 font-bold"
        >
          Voltar para o site
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        // Reset state after close animation
        setTimeout(() => {
          setStep('selection');
          setFormData({ name: '', clube: '', date: '', whatsapp: '', duration: '', email: '' });
        }, 300);
      }
    }}>
      <DialogContent className="block w-[95vw] md:max-w-[850px] lg:max-w-[1000px] p-0 border-0 overflow-hidden bg-black rounded-3xl shadow-[0_0_50px_-12px_rgba(251,146,60,0.4)] max-h-[90vh]">
        <VisuallyHidden>
          <DialogTitle>Reserve sua data para a Festa Junina 2026</DialogTitle>
        </VisuallyHidden>

        {/* Cinematic Background - Fixed behind content */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-black to-black z-0"></div>

          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[radial-gradient(ellipse_at_center,rgba(251,146,60,0.3)_0%,transparent_70%)] blur-2xl rounded-full mix-blend-screen"></div>
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.25)_0%,transparent_70%)] blur-2xl rounded-full mix-blend-screen"></div>
          <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[50%] bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.2)_0%,transparent_70%)] blur-3xl rounded-full mix-blend-screen"></div>

          <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay"></div>

          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60"></div>
        </div>

        {/* Explicit Close Button - Fixed to top right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-[60] w-10 h-10 flex items-center justify-center rounded-full bg-black/40 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white backdrop-blur-md transition-all duration-300 shadow-lg"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content Wrapper */}
        <div className="relative z-10 w-full max-h-[90vh] overflow-y-auto custom-scrollbar px-4 py-8 sm:px-10 flex flex-col items-center justify-center">
          {step === 'selection' && renderSelection()}
          {step === 'form' && renderForm()}
          {step === 'success' && renderSuccess()}
        </div>
      </DialogContent>
    </Dialog>
  );
};
