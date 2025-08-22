import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  MessageSquare,
  Send
} from "lucide-react";

export default function Contato() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="gradient-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">Entre em</span>
            <br />
            <span className="text-fire-gradient">Contato</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Estamos prontos para tornar seu evento inesquecível. 
            Fale conosco e receba uma proposta personalizada.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Fale Conosco</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-fire-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-fire-orange" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Telefone</h3>
                      <p className="text-muted-foreground">(11) 99999-9999</p>
                      <p className="text-sm text-muted-foreground">Segunda a sexta, 8h às 18h</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-fire-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-fire-orange" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">E-mail</h3>
                      <p className="text-muted-foreground">contato@m5max.com.br</p>
                      <p className="text-sm text-muted-foreground">Respondemos em até 2 horas</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-fire-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-6 h-6 text-fire-orange" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">WhatsApp</h3>
                      <p className="text-muted-foreground">(11) 99999-9999</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
                      >
                        Falar Agora
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-fire-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-fire-orange" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Localização</h3>
                      <p className="text-muted-foreground">São Paulo - SP</p>
                      <p className="text-sm text-muted-foreground">Atendemos todo o Brasil</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-fire-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-fire-orange" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Horário de Funcionamento</h3>
                      <p className="text-sm text-muted-foreground">Segunda a Sexta: 8h às 18h</p>
                      <p className="text-sm text-muted-foreground">Sábado: 8h às 14h</p>
                      <p className="text-sm text-muted-foreground">Domingo: Emergências</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Solicite seu Orçamento</CardTitle>
                  <CardDescription>
                    Preencha o formulário e receba uma proposta personalizada em até 2 horas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo *</Label>
                        <Input id="name" placeholder="Seu nome completo" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail *</Label>
                        <Input id="email" type="email" placeholder="seu@email.com" required />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone/WhatsApp *</Label>
                        <Input id="phone" placeholder="(11) 99999-9999" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="segment">Tipo de Evento *</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="b2b">Show Pirotécnico Profissional</SelectItem>
                            <SelectItem value="cha">Chá Revelação</SelectItem>
                            <SelectItem value="kits">Kits DIY</SelectItem>
                            <SelectItem value="casamento">Casamento</SelectItem>
                            <SelectItem value="corporativo">Evento Corporativo</SelectItem>
                            <SelectItem value="outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">Cidade *</Label>
                        <Input id="city" placeholder="São Paulo" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="eventDate">Data do Evento</Label>
                        <Input id="eventDate" type="date" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="budget">Orçamento Previsto</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a faixa de orçamento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ate-1k">Até R$ 1.000</SelectItem>
                          <SelectItem value="1k-5k">R$ 1.000 - R$ 5.000</SelectItem>
                          <SelectItem value="5k-10k">R$ 5.000 - R$ 10.000</SelectItem>
                          <SelectItem value="10k-20k">R$ 10.000 - R$ 20.000</SelectItem>
                          <SelectItem value="20k-mais">Acima de R$ 20.000</SelectItem>
                          <SelectItem value="nao-sei">Não sei ainda</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Detalhes do Evento</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Conte-nos mais sobre seu evento: número de convidados, tipo de local, expectativas..."
                        rows={4}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button type="submit" className="flex-1 bg-fire-orange hover:bg-fire-red">
                        <Send className="w-4 h-4 mr-2" />
                        Enviar Solicitação
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => window.open('https://wa.me/5511999999999', '_blank')}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        WhatsApp Direto
                      </Button>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      * Campos obrigatórios. Seus dados estão protegidos conforme nossa política de privacidade.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}