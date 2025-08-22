import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Scale, 
  Shield, 
  Eye, 
  FileText,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

export default function Legal() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="gradient-hero py-16">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="fire" className="mb-6">
            <Scale className="w-4 h-4 mr-2" />
            Informações Legais
          </Badge>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">Transparência e</span>
            <br />
            <span className="text-fire-gradient">Compliance</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Todas as informações legais, políticas de privacidade e termos de uso
            da M5 Max Produções, sempre em conformidade com a legislação brasileira.
          </p>
        </div>
      </section>

      {/* Legal Cards */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            
            {/* Política de Privacidade */}
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Eye className="w-8 h-8 text-fire-orange" />
                  <CardTitle className="text-2xl">Política de Privacidade</CardTitle>
                </div>
                <CardDescription>
                  Como coletamos, usamos e protegemos seus dados pessoais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h3 className="font-semibold">Coleta de Dados</h3>
                  <p className="text-sm text-muted-foreground">
                    Coletamos apenas os dados necessários para prestação de nossos serviços: 
                    nome, e-mail, telefone, endereço de entrega e informações do evento.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold">Uso das Informações</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Processamento de pedidos e orçamentos</li>
                    <li>• Comunicação sobre serviços contratados</li>
                    <li>• Melhorias em nossos produtos e atendimento</li>
                    <li>• Cumprimento de obrigações legais</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold">Proteção de Dados</h3>
                  <p className="text-sm text-muted-foreground">
                    Utilizamos criptografia SSL, armazenamento seguro e acesso restrito.
                    Seus dados nunca são vendidos ou compartilhados com terceiros sem autorização.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold">Seus Direitos (LGPD)</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Acessar seus dados pessoais</li>
                    <li>• Solicitar correção de informações</li>
                    <li>• Requerer exclusão de dados</li>
                    <li>• Portabilidade de dados</li>
                    <li>• Revogar consentimento a qualquer momento</li>
                  </ul>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm">
                    <strong>DPO (Encarregado de Dados):</strong> Para exercer seus direitos ou 
                    esclarecer dúvidas sobre o tratamento de dados, entre em contato via 
                    <strong> contato@m5max.com.br</strong> com o assunto "LGPD - Dados Pessoais".
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Termos de Uso */}
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-8 h-8 text-fire-orange" />
                  <CardTitle className="text-2xl">Termos de Uso</CardTitle>
                </div>
                <CardDescription>
                  Condições gerais para uso de nossos serviços e produtos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h3 className="font-semibold">Condições Gerais</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Uso exclusivo por pessoas maiores de 18 anos</li>
                    <li>• Informações fornecidas devem ser verdadeiras</li>
                    <li>• Responsabilidade por uso adequado dos produtos</li>
                    <li>• Cumprimento das normas de segurança</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold">Produtos e Serviços</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Todos os produtos são certificados pelo INMETRO</li>
                    <li>• Orçamentos válidos por 30 dias</li>
                    <li>• Preços sujeitos a alteração sem aviso prévio</li>
                    <li>• Disponibilidade conforme estoque</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold">Pagamento e Entrega</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Pagamento: à vista, cartão ou parcelado (consulte condições)</li>
                    <li>• Entrega: prazo informado no momento da compra</li>
                    <li>• Frete: calculado conforme destino e produto</li>
                    <li>• Seguro: incluído em todas as entregas</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold">Cancelamentos e Devoluções</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 7 dias para arrependimento (Lei do Consumidor)</li>
                    <li>• Produtos defeituosos: troca ou reembolso integral</li>
                    <li>• Eventos: política específica de cancelamento</li>
                    <li>• Produtos customizados: não aceita devolução</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Certificações e Licenças */}
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-8 h-8 text-fire-orange" />
                  <CardTitle className="text-2xl">Certificações</CardTitle>
                </div>
                <CardDescription>
                  Todas nossas licenças e certificados de conformidade
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h3 className="font-semibold">Licenças INMETRO</h3>
                  <p className="text-sm text-muted-foreground">
                    <strong>Registro:</strong> ABC-123456<br />
                    <strong>Validade:</strong> 31/12/2025<br />
                    <strong>Categoria:</strong> Artefatos Pirotécnicos Classe I, II e III
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold">Certificado Blaster</h3>
                  <p className="text-sm text-muted-foreground">
                    Nossa equipe técnica possui certificação Blaster para manuseio
                    e operação de espetáculos pirotécnicos profissionais.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold">Seguro de Responsabilidade Civil</h3>
                  <p className="text-sm text-muted-foreground">
                    <strong>Seguradora:</strong> [Nome da Seguradora]<br />
                    <strong>Apólice:</strong> [Número da Apólice]<br />
                    <strong>Cobertura:</strong> R$ 1.000.000,00
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold">Alvará de Funcionamento</h3>
                  <p className="text-sm text-muted-foreground">
                    Licença municipal para fabricação e comércio de artefatos
                    pirotécnicos, renovada anualmente.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="w-8 h-8 text-fire-orange" />
                  <CardTitle className="text-2xl">Avisos Importantes</CardTitle>
                </div>
                <CardDescription>
                  Informações de segurança e uso responsável
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h3 className="font-semibold">Idade Mínima</h3>
                  <p className="text-sm text-muted-foreground">
                    Produtos pirotécnicos são vendidos exclusivamente para maiores de 18 anos.
                    Uso por menores requer supervisão adulta constante.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold">Uso Responsável</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Leia sempre as instruções antes do uso</li>
                    <li>• Mantenha distância de segurança</li>
                    <li>• Use em local aberto e ventilado</li>
                    <li>• Tenha extintor ou água por perto</li>
                    <li>• Nunca reacenda produtos que falharam</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold">Armazenamento</h3>
                  <p className="text-sm text-muted-foreground">
                    Mantenha em local seco, fresco e longe de fontes de calor.
                    Evite exposição ao sol direto e umidade excessiva.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold">Primeiros Socorros</h3>
                  <p className="text-sm text-muted-foreground">
                    Em caso de acidentes, procure atendimento médico imediatamente.
                    Para queimaduras leves, use água fria abundante no local.
                  </p>
                </div>
                
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <p className="text-sm text-red-800">
                    <strong>Emergência:</strong> Em caso de acidentes graves,
                    ligue 192 (SAMU) ou 193 (Bombeiros) imediatamente.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Company Info */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Dados da Empresa</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-2">
              <p><strong>Razão Social:</strong> M5 Max Produções Ltda.</p>
              <p><strong>CNPJ:</strong> 00.000.000/0001-00</p>
              <p><strong>Inscrição Estadual:</strong> 123.456.789.012</p>
              <p><strong>Endereço:</strong> São Paulo - SP, Brasil</p>
              <p><strong>Telefone:</strong> (11) 99999-9999</p>
              <p><strong>E-mail:</strong> contato@m5max.com.br</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}