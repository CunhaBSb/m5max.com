import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import RootLayout from '@/app/layouts/RootLayout';
import SectionSeparator from '@/shared/layout/SectionSeparator';
import FogosM5Complete from '@/shared/layout/desktop/FogosM5Complete';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent } from '@/shared/ui/card';
import { YouTubeEmbed } from '@/shared/ui/youtube-embed';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import { useAppStore } from '@/shared/store/appStore';
import { generateWhatsAppURL, getWhatsAppMessage } from '@/shared/lib/whatsapp';
import { Shield, DownloadCloud, MessageSquare, Sparkles, CheckCircle2, Clock3, FileCheck, Zap, Play, Award } from 'lucide-react';
import { heroContent as homeHeroContent } from '@/features/home/data/homeContent';
import { ORCAMENTO_IATE_PDF_URL, ORCAMENTO_IATE_VIDEO_ID } from '../data/constants';

const OrcamentoIateDesktop = () => {
  const { trackPageView, trackWhatsAppClick } = useAnalytics();
  const { attribution } = useAppStore();
  const [videoLoaded, setVideoLoaded] = useState(false);
  const showSecondaryButtons = true;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    trackPageView({
      page_title: 'Orçamento | Iate Clube de Brasília 2026',
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
      source: 'orcamento_iate_2026'
    });
  }, [attribution?.utm]);

  const handleWhatsApp = () => {
    trackWhatsAppClick({
      audience: 'b2b',
      source: 'orcamento_iate_2026',
      message_template: 'Iate Clube 2026',
      phone_number: '5561982735575'
    });
    window.open(whatsappUrl, '_blank');
  };

  const handleVideoClick = useCallback(() => {
    const target = document.getElementById('simulacao-section');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleVideoLoad = useCallback(() => setVideoLoaded(true), []);
  const handleVideoError = useCallback(() => setVideoLoaded(false), []);

  return (
    <>
      <Helmet>
        <title>Orçamento • Iate Clube de Brasília 2026 | M5 Max</title>
        <meta
          name="description"
          content="Orçamento reservado para o show pirotécnico personalizado do Iate Clube de Brasília em 2026."
        />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <RootLayout>
        <main className="min-h-screen bg-background">
          {/* HERO */}
          <section className="relative min-h-screen flex items-center gradient-hero overflow-hidden pt-24 md:pt-24 pb-14">
            <div className="absolute inset-0 z-0">
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
                style={{ opacity: videoLoaded ? 1 : 0 }}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                onCanPlayThrough={handleVideoLoad}
                onError={handleVideoError}
              >
                <source src={homeHeroContent.video.desktop} type="video/webm" />
              </video>

              <div
                className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black transition-opacity duration-2000 ease-out"
                style={{ opacity: videoLoaded ? 0 : 1 }}
              />
              {!videoLoaded && (
                <div className="absolute inset-0 w-full h-full">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-fire-orange/10 to-transparent animate-pulse" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.1),transparent_50%)] animate-ping" style={{ animationDuration: '3s' }} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent z-20 pointer-events-none" />
            </div>

            <div className="absolute bottom-0 left-0 w-full h-12 z-25 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-fire-orange/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-background/95 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-1/4 h-full bg-gradient-to-tr from-background/60 via-background/20 to-transparent"></div>
              <div className="absolute bottom-0 right-0 w-1/4 h-full bg-gradient-to-tl from-background/60 via-background/20 to-transparent"></div>
            </div>

            <div className="relative z-30 container mx-auto px-8">
              <div className="flex justify-start min-h-[80vh]">
                <div className="space-y-6 text-left max-w-3xl w-full">
                  <div className="flex flex-wrap gap-2">
                    <div className="inline-flex items-center gap-2 text-white font-medium text-sm bg-red-500/20 px-3 py-1.5 rounded-full backdrop-blur-sm border border-red-400/40">
                      <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                      Acesso reservado
                    </div>
                    <div className="inline-flex items-center gap-2 text-white font-medium text-sm bg-emerald-500/20 px-3 py-1.5 rounded-full backdrop-blur-sm border border-emerald-400/40">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                      Confirmação em até 15 dias
                    </div>
                    <div className="inline-flex items-center gap-2 text-white font-medium text-sm bg-yellow-500/15 px-3 py-1.5 rounded-full backdrop-blur-sm border border-yellow-400/40">
                      <div a="" className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                      Só 2 shows premium disponíveis
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h1 className="text-4xl font-bold leading-tight drop-shadow-lg">
                      <span className="text-white">Show para o Iate Clube de Brasília </span>
                      <br />
                      <span className="text-fire-gradient">Réveillon 2026</span>
                    </h1>
                    <p className="text-lg text-white/90 drop-shadow-md max-w-xl leading-relaxed">
                      Show coreografado para mídia e impulsionamento: mega efeitos desenhados para imagens incríveis, ápices com fumaça reduzida e impacto direto no público local. Nossa missão é eternizar a virada com estilo e garantir que seu evento seja o registro mais memorável de 2026.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="border-fire-orange/50 text-white">Réveillon 2026</Badge>
                      <Badge variant="outline" className="border-fire-gold/50 text-white">Iate Clube de Brasília</Badge>
                      <Badge variant="outline" className="border-primary/40 text-white">Proposta privada</Badge>
                    </div>
                  </div>

                  {/* Informações principais incorporadas à copy; cards removidos */}

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="ghost"
                      className="flex items-center justify-center gap-4 w-full h-16 bg-gradient-to-r from-yellow-500/20 via-yellow-400/30 to-yellow-500/20 border-2 border-yellow-400/50 text-white hover:from-yellow-400/30 hover:via-yellow-300/40 hover:to-yellow-400/30 hover:border-yellow-300/70 backdrop-blur-md transition-all duration-300 group relative overflow-hidden shadow-lg shadow-yellow-400/20 hover:shadow-yellow-300/30"
                      onClick={handleVideoClick}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700" />
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg group-hover:shadow-yellow-400/50 transition-all group-hover:scale-110">
                        <Play className="w-5 h-5 text-black fill-current ml-0.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-base font-bold">Assistir simulação 3D</span>
                        <span className="text-xs text-yellow-200/80">7 Minutos + 1 Minuto de Brinde</span>
                      </div>
                    </Button>

                    <div
                      className={`flex gap-3 transition-all duration-500 ${
                        showSecondaryButtons ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'
                      }`}
                    >
                      <Button
                        variant="ghost"
                        className="flex-1 h-12 bg-gradient-to-r from-green-600/20 via-green-500/30 to-green-600/20 border border-green-500/50 text-white hover:from-green-500/30 hover:via-green-400/40 hover:to-green-500/30 hover:border-green-400/70 backdrop-blur-md transition-all duration-300 group relative overflow-hidden shadow-md shadow-green-500/20"
                        onClick={handleWhatsApp}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700" />
                        <MessageSquare className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">Entrar em contato</span>
                        <div className="flex items-center gap-1 ml-2 bg-green-400/20 px-1.5 py-0.5 rounded-full">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                          <span className="text-xs text-green-200">Online</span>
                        </div>
                      </Button>

                      <Button
                        asChild
                        variant="ghost"
                        className="flex-1 h-12 bg-gradient-to-r from-blue-600/20 via-blue-500/30 to-blue-600/20 border border-blue-500/50 text-white hover:from-blue-500/30 hover:via-blue-400/40 hover:to-blue-500/30 hover:border-blue-400/70 backdrop-blur-md transition-all duration-300 group relative overflow-hidden shadow-md shadow-blue-500/20"
                      >
                        <a href={ORCAMENTO_IATE_PDF_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 w-full h-full justify-center">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700" />
                          <DownloadCloud className="w-4 h-4" />
                          <span className="text-sm font-medium">Baixar orçamento (PDF)</span>
                        </a>
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-start gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1.5 rounded-full border border-green-400/40">
                      <Shield className="w-3 h-3 text-green-400" />
                      <span className="text-white font-medium text-xs">Segurança</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1.5 rounded-full border border-yellow-400/40">
                      <Award className="w-3 h-3 text-yellow-400" />
                      <span className="text-white font-medium text-xs">Certificado</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1.5 rounded-full border border-blue-400/40">
                      <span className="text-blue-400 font-bold text-xs">40</span>
                      <span className="text-white font-medium text-xs">Anos</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1.5 rounded-full border border-purple-400/40">
                      <span className="text-purple-400 font-bold text-xs">2K+</span>
                      <span className="text-white font-medium text-xs">Eventos</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Seção de simulação inspirada em FogosM5Complete */}
          <SectionSeparator variant="fire-line" spacing="md" />
          <section id="simulacao-section" className="relative py-12 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-background via-slate-900/15 to-background" />
            <div className="absolute inset-0 bg-gradient-to-br from-fire-orange/12 via-fire-gold/8 to-fire-orange/6" />
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-1/4 left-1/6 w-1 h-1 bg-fire-gold rounded-full animate-ping opacity-60" style={{ animationDelay: '0.5s', animationDuration: '3s' }} />
              <div className="absolute top-1/3 right-1/4 w-0.5 h-0.5 bg-fire-orange rounded-full animate-pulse opacity-40" style={{ animationDelay: '1.2s', animationDuration: '2s' }} />
              <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-fire-gold/80 rounded-full animate-ping opacity-50" style={{ animationDelay: '2.1s', animationDuration: '4s' }} />
              <div className="absolute top-2/3 right-1/6 w-1 h-1 bg-fire-orange rounded-full animate-pulse opacity-45" style={{ animationDelay: '3s', animationDuration: '2.5s' }} />
            </div>

            <div className="container mx-auto px-6 relative z-10 max-w-6xl">
              <div className="text-center mb-10 space-y-2">
                <Badge variant="outline" className="border-fire-gold/50 text-white">Simulação 3D exclusiva</Badge>
                <h2 className="text-2xl md:text-3xl font-bold text-white">Visual previsto para a virada</h2>
                <p className="text-white/75 text-sm md:text-base max-w-2xl mx-auto">
                  Prévia coreografada para mídia e público 360° (terra e orla).
                </p>
              </div>

              <div className="grid grid-cols-5 gap-6 items-center">
                <div className="col-span-5 md:col-span-1 space-y-4">
                  {[{
                    icon: Clock3,
                    value: '8 min',
                    label: 'Sequência total',
                    desc: '7 min + 1 min de brinde'
                  }, {
                    icon: Sparkles,
                    value: 'Adaptação',
                    label: 'Controle meteorológico',
                    desc: 'Ajustes conforme vento e umidade'
                  }].map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <Card key={stat.label} className="bg-gradient-to-br from-fire-orange/12 to-fire-gold/8 backdrop-blur-sm border border-fire-orange/30 shadow-fire">
                        <CardContent className="p-4 space-y-1">
                          <div className="w-10 h-10 rounded-full bg-fire-gold/20 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-fire-orange" />
                          </div>
                          <div className="text-xl font-bold text-white">{stat.value}</div>
                          <div className="text-sm font-medium text-white/90 leading-tight">{stat.label}</div>
                          <div className="text-xs text-white/70 leading-tight">{stat.desc}</div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <div className="col-span-5 md:col-span-3 relative">
                  <Card className="overflow-hidden bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-fire-gold/25 shadow-2xl shadow-fire-gold/20">
                    <CardContent className="p-2 sm:p-4">
                      <YouTubeEmbed
                        youtubeId={ORCAMENTO_IATE_VIDEO_ID}
                        title="Simulação 3D — Show Iate Clube de Brasília 2026"
                        className="rounded-lg"
                      />
                    </CardContent>
                  </Card>
                </div>

                <div className="col-span-5 md:col-span-1 space-y-4">
                  {[{
                    icon: Shield,
                    value: 'Segurança',
                    label: '360°',
                    desc: 'Isolamento, vento, contingência'
                  }, {
                    icon: DownloadCloud,
                    value: 'Briefing',
                    label: 'Ajustes',
                    desc: 'Atualizações antes do show'
                  }].map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <Card key={stat.label} className="bg-gradient-to-br from-fire-gold/12 to-fire-orange/8 backdrop-blur-sm border border-fire-gold/30 shadow-fire">
                        <CardContent className="p-4 space-y-1">
                          <div className="w-10 h-10 rounded-full bg-fire-orange/20 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-fire-gold" />
                          </div>
                          <div className="text-xl font-bold text-white">{stat.value}</div>
                          <div className="text-sm font-medium text-white/90 leading-tight">{stat.label}</div>
                          <div className="text-xs text-white/70 leading-tight">{stat.desc}</div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                <Card className="bg-gradient-to-br from-amber-500/12 via-amber-500/8 to-white/4 border border-amber-400/30 shadow-elegant h-full">
                  <CardContent className="p-5 space-y-4 text-sm text-white/85 leading-relaxed">
                    <h4 className="text-white font-semibold text-base">Confiabilidade em campo</h4>
                    <p className="text-amber-100 text-xs leading-relaxed">
                      Simulação: por ser pólvora, tempos podem variar. Mantemos a ordem dos efeitos e comunicamos qualquer ajuste antes da execução. Ao vivo, as cores ficam mais intensas e vibrantes.
                    </p>
                    <div className="grid grid-cols-1 gap-2 text-white/80">
                      <div className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-emerald-400 mt-0.5" />
                        <span>Isolamento, vento e contingência revisados no dia</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Clock3 className="w-4 h-4 text-fire-orange mt-0.5" />
                        <span>Sequência de 8 minutos (7 + 1 brinde) confirmada em campo</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-fire-gold mt-0.5" />
                        <span>Validação de pontos de filmagem e áudio para mídia</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-white/8 via-white/5 to-white/3 border border-white/10 shadow-elegant h-full">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-center gap-2">
                      <DownloadCloud className="w-4 h-4 text-fire-orange" />
                      <h4 className="text-white font-semibold text-base">Ajustes e entrega</h4>
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed">
                      Atualizações finais e entrega do PDF com custos, cronograma e memorial. Canal direto aberto para ajustes rápidos.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="ghost"
                        className="border border-green-500/60 text-green-100 hover:text-white"
                        onClick={handleWhatsApp}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Validar ajustes finais
                      </Button>
                      <Button asChild variant="outline-fire">
                        <a href={ORCAMENTO_IATE_PDF_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                          <DownloadCloud className="w-4 h-4" /> Baixar orçamento (PDF)
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* POR QUE É EXCLUSIVO */}
          <SectionSeparator variant="fire-line" spacing="md" />
          <section className="container mx-auto px-6 max-w-6xl py-12">
            <div className="text-center mb-10 space-y-2">
              <Badge variant="outline" className="border-fire-gold/50 text-white">Por que esta proposta é única?</Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-white">Entrega dedicada para o Iate</h2>
              <p className="text-white/75 text-sm md:text-base max-w-2xl mx-auto">
                Engenharia pirotécnica orientada à visibilidade 360°, segurança máxima e registros impecáveis.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[{
                icon: CheckCircle2,
                title: 'Coreografia sob medida',
                desc: 'Desenho baseado no mapa do clube, plateia em terra e na orla.'
              }, {
                icon: FileCheck,
                title: 'Licenciamento conduzido',
                desc: 'Exército, Bombeiros, DF Legal e ART sob gestão M5 Max.'
              }, {
                icon: Clock3,
                title: 'Linha do tempo controlada',
                desc: 'Marcos de submissão, montagem, testes e backup meteorológico.'
              }].map(({ icon: Icon, title, desc }) => (
                <Card key={title} className="bg-gradient-to-br from-white/8 via-white/5 to-white/3 border border-white/10 h-full shadow-elegant">
                  <CardContent className="p-5 space-y-3">
                    <div className="w-10 h-10 rounded-lg bg-fire-orange/20 flex items-center justify-center ring-1 ring-fire-orange/40">
                      <Icon className="w-5 h-5 text-fire-orange" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                    <p className="text-white/75 text-sm leading-relaxed">{desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* ROADMAP */}
          <SectionSeparator variant="ember-glow" spacing="md" />
          <section className="container mx-auto px-6 max-w-6xl py-12">
            <div className="text-center mb-8 space-y-2">
              <Badge variant="outline" className="border-fire-orange/50 text-white">Próximos marcos</Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-white">Calibrando o espetáculo até a virada</h2>
              <p className="text-white/75 text-sm md:text-base max-w-2xl mx-auto">
                Linha do tempo para manter janela, licenças e operação sob controle.
              </p>
            </div>

            <div className="relative">
              <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-fire-orange/30 to-transparent" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {[{
                  icon: Sparkles,
                  title: 'Conceito aprovado',
                  desc: 'Coreografia validada e paleta de efeitos fechada.'
                }, {
                  icon: FileCheck,
                  title: 'Licenças & ART',
                  desc: 'Memoriais, plantas e ART protocolados (Exército/Bombeiros/DF Legal).'
                }, {
                  icon: Shield,
                  title: 'Montagem & testes',
                  desc: 'Check de campo, isolamento, redundâncias e briefing da equipe.'
                }, {
                  icon: Zap,
                  title: 'Show + contingência',
                  desc: 'Execução sincronizada + plano B meteorológico preparado.'
                }].map(({ icon: Icon, title, desc }, index) => (
                  <Card key={title} className="bg-gradient-to-br from-white/7 via-white/5 to-white/3 border border-white/10 h-full relative overflow-hidden">
                    <span className="absolute top-3 right-3 text-xs text-white/50">0{index + 1}</span>
                    <CardContent className="p-5 space-y-3">
                      <div className="w-10 h-10 rounded-full bg-fire-orange/20 flex items-center justify-center ring-1 ring-fire-orange/30">
                        <Icon className="w-5 h-5 text-fire-orange" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">{title}</h3>
                      <p className="text-white/75 text-sm leading-relaxed">{desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* ESCOPO */}
          <SectionSeparator variant="sparkle" spacing="md" />
          <section className="container mx-auto px-6 max-w-6xl py-12">
            <div className="mb-8 text-center">
              <Badge variant="outline" className="border-fire-orange/40 text-white mb-3">Escopo preliminar</Badge>
              <h2 className="text-2xl font-bold text-white">O que está incluído</h2>
              <p className="text-white/75 mt-2 text-sm md:text-base max-w-2xl mx-auto">
                Alinhado ao plano de segurança e às licenças oficiais do evento.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[ 
                'Show desenhado para visibilidade 360° na orla do lago',
                'Planos de segurança, isolamento e brigada conforme CBMDF/Exército',
                'Licenciamento e ART inclusos; cronograma de submissão definido',
                'Plano de contingência meteorológica e disparo redundante',
                'Equipe completa para montagem, checagem e operação em campo'
              ].map((item) => (
                <Card key={item} className="bg-gradient-to-br from-white/8 via-white/5 to-white/3 border border-white/10">
                  <CardContent className="py-4 px-5 text-white/85 text-sm leading-relaxed flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-fire-orange/20 flex items-center justify-center mt-0.5 ring-1 ring-fire-orange/40">
                      <CheckCircle2 className="w-3.5 h-3.5 text-fire-gold" />
                    </div>
                    <span>{item}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* SOBRE A M5 */}
          <SectionSeparator variant="ember-glow" spacing="md" />
          <FogosM5Complete />

          {/* ENTREGA DO ORÇAMENTO */}
          <SectionSeparator variant="sparkle" spacing="md" />
          <section className="container mx-auto px-6 max-w-4xl pb-16">
            <div className="bg-gradient-to-br from-white/8 via-white/6 to-white/3 border border-white/10 rounded-xl p-6 space-y-4 shadow-elegant">
              <div className="flex items-center gap-3">
                <DownloadCloud className="w-5 h-5 text-fire-orange" />
                <h3 className="text-lg font-semibold text-white">Orçamento detalhado</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-100">Disponível</span>
              </div>
              <p className="text-white/80 text-sm leading-relaxed">
                PDF com custos, cronograma, memorial e exigências locais. Disponível para consulta e download seguro.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Button asChild variant="outline-fire">
                  <a
                    href={ORCAMENTO_IATE_PDF_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <DownloadCloud className="w-4 h-4" /> Baixar orçamento (PDF)
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  className="border border-green-500/60 text-green-100 hover:text-white"
                  onClick={handleWhatsApp}
                >
                  Solicitar via WhatsApp agora
                </Button>
              </div>
            </div>
          </section>
        </main>
      </RootLayout>
    </>
  );
};

export default OrcamentoIateDesktop;
