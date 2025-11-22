import { useState, useEffect } from 'react';
import { X, Package, Clock, Shield, FileText, Zap, Calendar, MapPin, Users, Phone, Mail, Building, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Checkbox } from '@/shared/ui/checkbox';
import { useAnalytics } from '@/shared/hooks/useAnalytics';
import { generateWhatsAppURL } from '@/shared/lib/whatsapp';
import { formatPreco, type ProdutoKit } from '../../data/produtos';

interface ProductModalProps {
  product: ProdutoKit | null;
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  // Personal Info
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  companyName: string;
  
  // Event Details
  eventType: string;
  eventDate: string;
  venue: string;
  city: string;
  guestCount: number;
  budget: string;
  
  // Product Specific
  quantity: number;
  eventTime: string;
  specialRequests: string;
  
  // Legal & Compliance
  ageConfirmed: boolean;
  termsAccepted: boolean;
  safetyAcknowledged: boolean;
}

const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'quote'>('details');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    companyName: '',
    eventType: '',
    eventDate: '',
    venue: '',
    city: '',
    guestCount: 0,
    budget: '',
    quantity: 1,
    eventTime: '',
    specialRequests: '',
    ageConfirmed: false,
    termsAccepted: false,
    safetyAcknowledged: false
  });

  const { trackEvent, trackWhatsAppClick } = useAnalytics();

  useEffect(() => {
    if (isOpen && product) {
      trackEvent('view_item', {
        currency: 'BRL',
        value: product.price || 0,
        items: [{
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          price: product.price || 0
        }]
      });

      // Pre-select event type based on product category
      setFormData(prev => ({
        ...prev,
        eventType: product.category === 'kit_revelacao' ? 'cha_revelacao' : ''
      }));
    }
  }, [isOpen, product, trackEvent]);

  if (!isOpen || !product) return null;

  const calculateLeadScore = () => {
    let score = 0;
    
    // Event type scoring
    const eventTypeScores = {
      'casamento': 25,
      'formatura': 20,
      'aniversario': 15,
      'reveillon': 25,
      'corporativo': 30,
      'festa_junina': 15,
      'cha_revelacao': 20
    };
    score += eventTypeScores[formData.eventType as keyof typeof eventTypeScores] || 10;

    // Budget scoring
    const budgetScores = {
      'ate_500': 5,
      '500_1000': 15,
      '1000_2000': 25,
      'acima_2000': 30
    };
    score += budgetScores[formData.budget as keyof typeof budgetScores] || 0;

    // Guest count scoring
    if (formData.guestCount > 200) score += 20;
    else if (formData.guestCount > 100) score += 15;
    else if (formData.guestCount > 50) score += 10;
    else if (formData.guestCount > 0) score += 5;

    // Event date scoring
    if (formData.eventDate) {
      const eventDate = new Date(formData.eventDate);
      const now = new Date();
      const daysUntilEvent = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilEvent <= 30) score += 25;
      else if (daysUntilEvent <= 60) score += 20;
      else if (daysUntilEvent <= 90) score += 15;
      else score += 10;
    }

    // Company bonus
    if (formData.companyName) score += 15;

    // Product value scoring
    const totalValue = (product.price || 0) * formData.quantity;
    if (totalValue > 1500) score += 25;
    else if (totalValue > 1000) score += 20;
    else if (totalValue > 500) score += 15;
    else if (totalValue > 0) score += 10;

    return Math.min(score, 100);
  };

  const generateWhatsAppMessage = () => {
    const leadScore = calculateLeadScore();
    const totalValue = (product.price || 0) * formData.quantity;

    return `🎆 *SOLICITAÇÃO DE ORÇAMENTO - M5 MAX*

🎯 *PRODUTO SELECIONADO:*
• ${product.name}
• Quantidade: ${formData.quantity}
• Valor estimado: ${formatPreco(totalValue)}

📋 *DETALHES DO EVENTO:*
• Tipo: ${formData.eventType}
• Data: ${new Date(formData.eventDate).toLocaleDateString('pt-BR')}
${formData.eventTime ? `• Horário: ${formData.eventTime}` : ''}
• Local: ${formData.venue}, ${formData.city}
• Convidados: ${formData.guestCount} pessoas
• Orçamento: ${formData.budget}

👤 *DADOS DE CONTATO:*
• Nome: ${formData.contactName}
• WhatsApp: ${formData.contactPhone}
• E-mail: ${formData.contactEmail}
${formData.companyName ? `• Empresa: ${formData.companyName}` : ''}

${formData.specialRequests ? `📝 *OBSERVAÇÕES:*\n${formData.specialRequests}` : ''}

✅ *CONFIRMAÇÕES DE SEGURANÇA:*
• Idade confirmada (18+): Sim
• Termos aceitos: Sim
• Segurança reconhecida: Sim

🔥 Lead Score: ${leadScore}/100
💰 Valor Total: ${formatPreco(totalValue)}

Aguardo contato para finalizar este orçamento!`;
  };

  const handleSubmit = () => {
    if (!formData.ageConfirmed || !formData.termsAccepted || !formData.safetyAcknowledged) {
      alert('Por favor, confirme todos os termos de segurança e responsabilidade.');
      return;
    }

    setIsSubmitting(true);
    
    const message = generateWhatsAppMessage();
    const whatsappUrl = generateWhatsAppURL(message, undefined, {
      audience: formData.companyName ? 'b2b' : 'b2c',
      source: 'product_modal',
      leadScore: calculateLeadScore()
    });

    // Track conversion
    trackEvent('purchase', {
      transaction_id: `product_quote_${Date.now()}`,
      value: (product.price || 0) * formData.quantity,
      currency: 'BRL',
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price || 0,
        quantity: formData.quantity
      }]
    });

    trackWhatsAppClick({
      audience: formData.companyName ? 'b2b' : 'b2c',
      source: 'product_modal',
      message_template: 'product_quote',
      phone_number: '5561982735575',
      lead_score: calculateLeadScore()
    });

    window.open(whatsappUrl, '_blank');
    setIsSubmitting(false);
    onClose();
  };

  const isFormValid = () => {
    return formData.contactName &&
           formData.contactPhone &&
           formData.eventType &&
           formData.eventDate &&
           formData.venue &&
           formData.city &&
           formData.guestCount > 0 &&
           formData.budget &&
           formData.ageConfirmed &&
           formData.termsAccepted &&
           formData.safetyAcknowledged;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              product.category === 'kit_festa' 
                ? 'bg-gradient-to-r from-fire-gold to-fire-orange'
                : 'bg-gradient-to-r from-pink-500 to-blue-500'
            }`}>
              {product.category === 'kit_festa' ? (
                <Package className="w-6 h-6 text-white" />
              ) : (
                <Calendar className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{product.name}</h2>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            className="w-10 h-10 p-0"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {[
            { id: 'details', label: 'Detalhes', icon: Package },
            { id: 'specs', label: 'Especificações', icon: FileText },
            { id: 'quote', label: 'Solicitar Orçamento', icon: Phone }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'details' | 'specs' | 'quote')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 transition-colors ${
                activeTab === tab.id
                  ? 'bg-fire-orange/10 text-fire-orange border-b-2 border-fire-orange'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'details' && (
            <div className="space-y-8">
              {/* Product Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-4">Visão Geral</h3>
                    <div className="bg-accent/10 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Duração:</span>
                        <span className="font-medium">{product.duration}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Preço:</span>
                        <span className="font-bold text-fire-orange text-lg">{formatPreco(product.price)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Categoria:</span>
                        <Badge variant="outline">
                          {product.category === 'kit_festa' ? 'Kit Festa' : 'Kit Chá Revelação'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h3 className="text-xl font-bold mb-4">Características</h3>
                    <div className="space-y-3">
                      {product.includes_instructions && (
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-safety-green" />
                          <span>Instruções detalhadas incluídas</span>
                        </div>
                      )}
                      {product.includes_detonator && (
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-safety-green" />
                          <span>Detonador profissional incluído</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-safety-green" />
                        <span>Certificado de segurança</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-safety-green" />
                        <span>Suporte técnico 24h</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Safety Info */}
                  <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-yellow-800 dark:text-yellow-200 mb-2">
                          Informações de Segurança
                        </h4>
                        <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                          <li>• Uso restrito para maiores de 18 anos</li>
                          <li>• Seguir rigorosamente as instruções</li>
                          <li>• Manter distância de segurança</li>
                          <li>• Não utilizar em locais fechados</li>
                          <li>• Verificar regulamentações locais</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Recommended Events */}
                  <div>
                    <h3 className="text-xl font-bold mb-4">Eventos Recomendados</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {(product.category === 'kit_festa' ? [
                        'Casamentos',
                        'Formaturas',
                        'Aniversários',
                        'Réveillon',
                        'Eventos Corporativos',
                        'Festas de Confraternização'
                      ] : [
                        'Chá Revelação',
                        'Gender Reveal',
                        'Festa de Bebê',
                        'Anúncio Especial',
                        'Família e Amigos',
                        'Celebração Íntima'
                      ]).map(event => (
                        <div key={event} className="bg-accent/10 rounded-lg p-2 text-center text-sm">
                          {event}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Especificações Técnicas</h3>
              
              {/* Components */}
              <div>
                <h4 className="text-lg font-bold mb-4">Componentes Inclusos</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {product.components.map((component, index) => (
                    <div key={index} className="bg-accent/10 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-fire-gold rounded-full mt-2 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-foreground">{component}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* What's Included */}
              <div>
                <h4 className="text-lg font-bold mb-4">O que está Incluído</h4>
                <div className="space-y-3">
                  {product.includes.map((include, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-safety-green flex-shrink-0" />
                      <span>{include}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Clock className="w-4 h-4 text-fire-orange" />
                      Duração
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-fire-orange">{product.duration}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Shield className="w-4 h-4 text-safety-green" />
                      Segurança
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      <div className="font-bold text-safety-green mb-1">Nível Profissional</div>
                      <div className="text-muted-foreground">Certificado NBR</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-tech-blue" />
                      Alcance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      <div className="font-bold text-tech-blue mb-1">Espaços Abertos</div>
                      <div className="text-muted-foreground">Distância mínima: 25m</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'quote' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Solicitar Orçamento</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form */}
                <div className="space-y-6">
                  {/* Personal Info */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold">Dados de Contato</h4>
                    
                    <Input
                      placeholder="Seu nome completo *"
                      value={formData.contactName}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                    />
                    
                    <Input
                      placeholder="WhatsApp (11) 99999-9999 *"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                    />
                    
                    <Input
                      type="email"
                      placeholder="E-mail (opcional)"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                    />
                    
                    <Input
                      placeholder="Nome da empresa (se aplicável)"
                      value={formData.companyName}
                      onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                    />
                  </div>

                  {/* Event Details */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold">Detalhes do Evento</h4>
                    
                    <select
                      value={formData.eventType}
                      onChange={(e) => setFormData(prev => ({ ...prev, eventType: e.target.value }))}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                    >
                      <option value="">Tipo de evento *</option>
                      <option value="casamento">Casamento</option>
                      <option value="formatura">Formatura</option>
                      <option value="aniversario">Aniversário</option>
                      <option value="reveillon">Réveillon</option>
                      <option value="corporativo">Evento Corporativo</option>
                      <option value="festa_junina">Festa Junina</option>
                      <option value="cha_revelacao">Chá Revelação</option>
                    </select>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        type="date"
                        value={formData.eventDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, eventDate: e.target.value }))}
                      />
                      <Input
                        type="time"
                        placeholder="Horário (opcional)"
                        value={formData.eventTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, eventTime: e.target.value }))}
                      />
                    </div>
                    
                    <Input
                      placeholder="Local do evento *"
                      value={formData.venue}
                      onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value }))}
                    />
                    
                    <Input
                      placeholder="Cidade *"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        type="number"
                        placeholder="Número de convidados *"
                        value={formData.guestCount || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, guestCount: parseInt(e.target.value) || 0 }))}
                      />
                      
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                        className="px-3 py-2 border border-border rounded-lg bg-background"
                      >
                        <option value="">Orçamento *</option>
                        <option value="ate_500">Até R$ 500</option>
                        <option value="500_1000">R$ 500 - R$ 1.000</option>
                        <option value="1000_2000">R$ 1.000 - R$ 2.000</option>
                        <option value="acima_2000">Acima de R$ 2.000</option>
                      </select>
                    </div>
                  </div>

                  {/* Product Options */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-bold">Opções do Produto</h4>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Quantidade</label>
                      <Input
                        type="number"
                        min="1"
                        value={formData.quantity}
                        onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                      />
                    </div>
                    
                    <Textarea
                      placeholder="Observações especiais ou requisitos específicos"
                      value={formData.specialRequests}
                      onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  {/* Legal Compliance */}
                  <div className="space-y-4 border-t pt-4">
                    <h4 className="text-lg font-bold">Termos e Segurança</h4>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={formData.ageConfirmed}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, ageConfirmed: !!checked }))}
                        />
                        <label className="text-sm">
                          <strong>Confirmo que tenho 18 anos ou mais</strong> e estou ciente das restrições de idade para produtos pirotécnicos.
                        </label>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={formData.safetyAcknowledged}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, safetyAcknowledged: !!checked }))}
                        />
                        <label className="text-sm">
                          <strong>Reconheço os riscos</strong> e comprometo-me a seguir todas as instruções de segurança fornecidas.
                        </label>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={formData.termsAccepted}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, termsAccepted: !!checked }))}
                        />
                        <label className="text-sm">
                          <strong>Aceito os termos</strong> de uso e responsabilidade da M5 Max Produções.
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quote Summary */}
                <div className="space-y-6">
                  <div className="bg-accent/10 rounded-lg p-6 sticky top-0">
                    <h4 className="text-lg font-bold mb-4">Resumo do Orçamento</h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Produto:</span>
                        <span className="font-medium">{product.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quantidade:</span>
                        <span className="font-medium">{formData.quantity}x</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Valor unitário:</span>
                        <span className="font-medium">{formatPreco(product.price)}</span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total estimado:</span>
                          <span className="text-fire-orange">
                            {formatPreco((product.price || 0) * formData.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Lead Score Preview */}
                    {formData.eventType && formData.budget && (
                      <div className="mt-6 pt-4 border-t">
                        <div className="text-sm text-muted-foreground mb-2">Qualificação do Lead:</div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Score:</span>
                          <Badge variant="outline" className="text-xs">
                            {calculateLeadScore()}/100
                          </Badge>
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={handleSubmit}
                      disabled={!isFormValid() || isSubmitting}
                      className="w-full mt-6 shadow-fire hover:scale-105 transition-bounce"
                      variant="fire"
                      size="lg"
                    >
                      {isSubmitting ? 'Enviando...' : 'Enviar Solicitação via WhatsApp'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
