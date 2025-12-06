import RootLayout from '@/app/layouts/RootLayout';
import SectionSeparator from '@/shared/layout/SectionSeparator';
import { LazySection } from '@/shared/layout/LazySection';
import FogosM5Complete from '@/shared/layout/mobile/FogosM5Complete';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent } from '@/shared/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { YouTubeEmbed } from '@/shared/ui/youtube-embed';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import { useAppStore } from '@/shared/store/appStore';
import { generateWhatsAppURL, getWhatsAppMessage } from '@/shared/lib/whatsapp';
import { Shield, DownloadCloud, MessageSquare, Sparkles, CheckCircle2, Clock3, FileCheck, Zap, Play } from 'lucide-react';
import { ORCAMENTO_IATE_PDF_URL, ORCAMENTO_IATE_VIDEO_ID, ORCAMENTO_IATE_BG_VIDEO } from '../data/constants';
import BudgetTriage from '../components/BudgetTriage';
import { useEffect, useMemo, useState } from 'react';
import { buildSeo, seoOrcamentoIate } from '@/shared/data/seo';
import { SeoHead } from '@/shared/layout/SeoHead';

const orcamentoSeo = buildSeo(seoOrcamentoIate);

const OrcamentoIateMobile = () => {
  const { trackPageView, trackWhatsAppClick } = useAnalytics();
  const { attribution } = useAppStore();
  const [pdfOpen, setPdfOpen] = useState(false);

  useEffect(() => {
    trackPageView({
      page_title: 'Orçamento | Iate Clube de Brasília 2026 - Mobile',
      page_location: window.location.href,
      page_category: 'b2b'
    });
  }, [trackPageView]);

  const whatsappUrl = useMemo(() => {
    const message = getWhatsAppMessage('b2b', {
      eventType: 'Show pirotécnico personalizado',
      cityUF: 'Brasília - DF',
      eventDate: 'Réveillon 2026'
    });

    return generateWhatsAppURL(message, attribution?.utm, {
      audience: 'b2b',
      source: 'orcamento_iate_2026_mobile'
    });
  }, [attribution?.utm]);

  const handleWhatsApp = () => {
    trackWhatsAppClick({
      audience: 'b2b',
      source: 'orcamento_iate_2026_mobile',
      message_template: 'Iate Clube 2026',
      phone_number: '5561982735575'
    });
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <SeoHead meta={orcamentoSeo} />

      <RootLayout>
        <main className="min-h-screen bg-background">
          {/* Hero Mobile */}
          <section className="relative min-h-screen flex items-center gradient-hero overflow-hidden pt-20 pb-12 px-4">
            {/* vídeo e overlay padrão */}
            <div className="absolute inset-0 z-0">
              <video
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              >
                <source src={ORCAMENTO_IATE_BG_VIDEO} type="video/webm" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/70 to-background" />
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/5 left-1/6 w-0.5 h-0.5 bg-fire-gold rounded-full animate-ping opacity-50" style={{ animationDelay: '0.8s', animationDuration: '3s' }} />
                <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-fire-orange rounded-full animate-pulse opacity-35" style={{ animationDelay: '1.5s', animationDuration: '2.5s' }} />
                <div className="absolute bottom-1/3 left-1/3 w-0.5 h-0.5 bg-fire-gold/70 rounded-full animate-ping opacity-40" style={{ animationDelay: '2.2s', animationDuration: '4s' }} />
                <div className="absolute top-2/3 right-1/6 w-0.5 h-0.5 bg-fire-orange rounded-full animate-pulse opacity-30" style={{ animationDelay: '3.1s', animationDuration: '2s' }} />
              </div>
            </div>

            <div className="relative z-10 space-y-6 w-full max-w-xl mx-auto text-center">
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="outline" className="border-red-400/50 text-white">Acesso reservado</Badge>
                <Badge variant="outline" className="border-emerald-400/50 text-white">Confirmação em até 15 dias</Badge>
                <Badge variant="outline" className="border-yellow-400/50 text-white">Só 2 shows premium</Badge>
              </div>

              <h1 className="text-3xl font-bold leading-tight text-white">
                Show para o Iate Clube de Brasília
                <span className="block text-fire-gradient text-2xl">Réveillon 2026</span>
              </h1>

              <p className="text-white/85 text-base leading-relaxed">
                Coreografado para mídia: efeitos para imagens impecáveis, picos com baixa fumaça e impacto direto no público. Missão: eternizar a virada com estilo.
              </p>

              {/* Informações chave estão na copy; cards removidos para layout compacto */}

              <div className="flex flex-col gap-2">
                <Button
                  variant="ghost"
                  className="h-11 bg-gradient-to-r from-yellow-500/20 via-yellow-400/30 to-yellow-500/20 border-2 border-yellow-400/50 text-white shadow-fire"
                  onClick={() => {
                    const target = document.getElementById('simulacao-section');
                    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                >
                  <Play className="w-4 h-4 mr-2" /> Assistir simulação 3D
                </Button>

                <Button
                  variant="ghost"
                  className="h-11 bg-gradient-to-r from-green-600/20 via-green-500/30 to-green-600/20 border border-green-500/50 text-white shadow-elegant"
                  onClick={handleWhatsApp}
                >
                  <MessageSquare className="w-4 h-4 mr-2" /> Entrar em contato
                </Button>

                <Button variant="outline-fire" className="h-11" onClick={() => setPdfOpen(true)}>
                  <DownloadCloud className="w-4 h-4 mr-2" /> Ver orçamento
                </Button>
              </div>
            </div>
          </section>

          {/* Simulação */}
          <SectionSeparator variant="fire-line" spacing="md" />

          <LazySection>
            <div className="px-4">
              <BudgetTriage variant="mobile" source="orcamento_iate_2026_mobile" />
            </div>
          </LazySection>

          <SectionSeparator variant="fire-line" spacing="md" />
          <LazySection>
            <section id="simulacao-section" className="px-4 py-10 space-y-4">
            <div className="text-center space-y-2">
              <Badge variant="outline" className="border-fire-gold/50 text-white">Simulação 3D</Badge>
              <h2 className="text-2xl font-bold text-white">Visual previsto</h2>
              <p className="text-white/75 text-sm max-w-xl mx-auto">Sequência de 8 minutos (7 + 1 brinde), picos limpos para mídia.</p>
            </div>

            <Card className="bg-white/8 border-white/10 shadow-fire">
              <CardContent className="p-3 space-y-3">
                <YouTubeEmbed
                  youtubeId={ORCAMENTO_IATE_VIDEO_ID}
                  title="Simulação 3D — Show Iate Clube de Brasília 2026"
                  className="rounded-lg"
                />
                <div className="text-xs text-white/70 leading-relaxed">
                  Por ser pólvora, tempos podem variar. Mantemos a ordem dos efeitos e comunicamos qualquer ajuste antes do show. Cores ficam mais intensas ao vivo.
                </div>
              </CardContent>
            </Card>
          </section>
          </LazySection>

          {/* Por que é único */}
          <SectionSeparator variant="fire-line" spacing="md" />
          <LazySection>
            <section className="px-4 py-10 space-y-6">
            <div className="text-center space-y-2">
              <Badge variant="outline" className="border-fire-gold/50 text-white">Diferenciais</Badge>
              <h2 className="text-2xl font-bold text-white">Entrega dedicada ao Iate</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[{
                icon: CheckCircle2,
                title: 'Coreografia sob medida',
                desc: 'Mapa do clube e plateia 360°'
              }, {
                icon: FileCheck,
                title: 'Licenciamento completo',
                desc: 'Exército, Bombeiros, DF Legal, ART'
              }, {
                icon: Shield,
                title: 'Segurança 360°',
                desc: 'Isolamento, vento e contingência'
              }, {
                icon: Zap,
                title: 'Plano B pronto',
                desc: 'Backup meteorológico e redundâncias'
              }].map(({ icon: Icon, title, desc }) => (
                <Card key={title} className="bg-white/8 border-white/10 shadow-elegant">
                  <CardContent className="p-4 space-y-2">
                    <div className="w-9 h-9 rounded-full bg-fire-orange/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-fire-orange" />
                    </div>
                    <h3 className="text-white font-semibold text-base">{title}</h3>
                    <p className="text-white/75 text-sm leading-relaxed">{desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
          </LazySection>

          {/* Escopo */}
          <SectionSeparator variant="sparkle" spacing="md" />
          <LazySection>
            <section className="px-4 py-10 space-y-6">
            <div className="text-center space-y-2">
              <Badge variant="outline" className="border-fire-orange/40 text-white">Escopo</Badge>
              <h2 className="text-2xl font-bold text-white">O que está incluído</h2>
              <p className="text-white/75 text-sm max-w-xl mx-auto">Alinhado ao plano de segurança e licenças oficiais.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[ 
                'Show 360° na orla do lago',
                'Planos de segurança e brigada (CBMDF/Exército)',
                'Licenciamento e ART com cronograma definido',
                'Contingência meteorológica e disparo redundante',
                'Equipe completa para montagem, checagem e operação'
              ].map((item) => (
                <Card key={item} className="bg-white/8 border-white/10 shadow-elegant">
                  <CardContent className="p-3 text-white/85 text-sm leading-relaxed flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-fire-gold mt-0.5" />
                    <span>{item}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
          </LazySection>

          {/* Sobre M5 */}
          <SectionSeparator variant="ember-glow" spacing="md" />
          <LazySection>
            <FogosM5Complete />
          </LazySection>

          {/* Orçamento */}
          <SectionSeparator variant="sparkle" spacing="md" />
          <LazySection>
            <section className="px-4 pb-16">
            <Card className="bg-white/8 border-white/10 shadow-elegant">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <DownloadCloud className="w-4 h-4 text-fire-orange" />
                  <h3 className="text-white font-semibold text-base">Orçamento detalhado</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-100">Disponível</span>
                </div>
                <p className="text-white/80 text-sm leading-relaxed">
                  PDF com custos, cronograma e memorial. Download seguro abaixo.
                </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline-fire" className="h-11" onClick={() => setPdfOpen(true)}>
                  <DownloadCloud className="w-4 h-4 mr-2" /> Ver orçamento
                </Button>
                <Button
                  variant="ghost"
                  className="h-11 border border-green-500/60 text-green-100 hover:text-white"
                  onClick={handleWhatsApp}
                >
                  <MessageSquare className="w-4 h-4 mr-2" /> Falar no WhatsApp
                </Button>
              </div>
              </CardContent>
            </Card>
          </section>
          </LazySection>
        </main>

        <Dialog open={pdfOpen} onOpenChange={setPdfOpen}>
          <DialogContent className="max-w-[1100px] w-[98vw] h-[98vh] p-0 overflow-hidden">
            <DialogHeader className="px-4 pt-4 pb-2 border-b border-white/10">
              <DialogTitle className="text-base font-semibold">Orçamento Iate Clube de Brasília — Réveillon 2026</DialogTitle>
            </DialogHeader>
            <div className="h-[82vh]">
              <iframe
                src={ORCAMENTO_IATE_PDF_URL}
                title="Orçamento Iate Clube de Brasília — Réveillon 2026"
                className="w-full h-full border-0"
              />
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 text-sm text-white/80 bg-background/80 backdrop-blur">
              <Button asChild variant="outline-fire" className="h-10">
                <a href={ORCAMENTO_IATE_PDF_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <DownloadCloud className="w-4 h-4" /> Baixar PDF
                </a>
              </Button>
              <p className="text-xs text-white/60">Arraste para rolar. Feche no ícone “X”.</p>
            </div>
          </DialogContent>
        </Dialog>
      </RootLayout>
    </>
  );
};

export default OrcamentoIateMobile;
