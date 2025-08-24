import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileCheck, Download, Shield, CheckCircle } from "lucide-react";

const checklist_items = [
  "Documentação necessária para eventos",
  "Licenças municipais obrigatórias", 
  "Certificações de segurança",
  "Protocolo de emergência",
  "Lista de equipamentos de proteção",
  "Cronograma de aprovação"
];

const LeadMagnet = () => {
  return (
    <section className="py-20 gradient-hero">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-fire bg-card overflow-hidden">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Content */}
                <div className="p-8 lg:p-12 space-y-6">
                  <div className="flex items-center gap-3 text-fire-orange">
                    <FileCheck className="w-6 h-6" />
                    <span className="font-semibold uppercase tracking-wide">Guia Gratuito</span>
                  </div>
                  
                  <h2 className="text-3xl lg:text-4xl font-bold">
                    <span className="text-foreground">Checklist Completo de</span>
                    <br />
                    <span className="text-fire-gradient">Licenças para Eventos</span>
                  </h2>
                  
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Evite problemas legais e garanta que seu evento aconteça sem contratempos. 
                    Baixe nosso guia completo com todas as licenças necessárias.
                  </p>

                  <div className="space-y-3">
                    {checklist_items.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-fire-orange flex-shrink-0" />
                        <span className="text-foreground">{item}</span>
                      </div>
                    ))}
                    <div className="text-muted-foreground text-sm">
                      + {checklist_items.length - 3} itens adicionais no guia completo
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button variant="fire" size="lg" className="flex items-center gap-3">
                      <Download className="w-5 h-5" />
                      Baixar Checklist Gratuito
                    </Button>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="w-4 h-4" />
                      Sem spam • 100% gratuito
                    </div>
                  </div>
                </div>

                {/* Visual */}
                <div className="relative bg-gradient-to-br from-fire-orange/10 to-fire-red/10 p-8 lg:p-12 flex items-center justify-center">
                  <div className="relative">
                    {/* Document Icon */}
                    <div className="w-32 h-40 bg-card shadow-elegant rounded-lg p-4 transform rotate-3 hover:rotate-0 transition-bounce">
                      <div className="space-y-2">
                        <div className="h-2 bg-fire-orange rounded" />
                        <div className="h-1.5 bg-metal-silver rounded" />
                        <div className="h-1.5 bg-metal-silver rounded w-3/4" />
                        <div className="h-1.5 bg-metal-silver rounded w-1/2" />
                        <div className="mt-4 space-y-1">
                          {[...Array(8)].map((_, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-fire-orange rounded-full" />
                              <div className="h-1 bg-metal-silver rounded flex-1" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Floating checkmarks */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-fire-orange rounded-full flex items-center justify-center sparkle-animation">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-fire-gold rounded-full flex items-center justify-center sparkle-animation" style={{animationDelay: '0.5s'}}>
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default LeadMagnet;