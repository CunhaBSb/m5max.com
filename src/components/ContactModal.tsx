import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Send, Phone } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    message: ""
  });

  const handleWhatsApp = () => {
    const message = `Olá! Gostaria de solicitar um orçamento.
    
Nome: ${formData.name}
Email: ${formData.email}
Telefone: ${formData.phone}
Tipo de Evento: ${formData.eventType}
Mensagem: ${formData.message}`;
    
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleWhatsApp();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-fire-gradient">
            Solicitar Orçamento
          </DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo e enviaremos seu orçamento personalizado
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventType">Tipo de Evento</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, eventType: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de evento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="show-profissional">Show Pirotécnico Profissional</SelectItem>
                <SelectItem value="cha-revelacao">Chá Revelação</SelectItem>
                <SelectItem value="kit-diy">Kit DIY</SelectItem>
                <SelectItem value="casamento">Casamento</SelectItem>
                <SelectItem value="reveillon">Réveillon</SelectItem>
                <SelectItem value="corporativo">Evento Corporativo</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Detalhes do Evento</Label>
            <Textarea
              id="message"
              placeholder="Conte-nos mais sobre seu evento: data, local, número de convidados, etc."
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              className="min-h-[80px]"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              type="submit"
              variant="whatsapp" 
              className="flex items-center gap-2 flex-1"
            >
              <MessageSquare className="w-4 h-4" />
              Enviar via WhatsApp
            </Button>
            <Button 
              type="button"
              variant="tech" 
              className="flex items-center gap-2 flex-1"
            >
              <Send className="w-4 h-4" />
              Enviar por E-mail
            </Button>
          </div>

          <div className="text-xs text-center text-muted-foreground pt-2">
            Responderemos em até 2 horas • Sem compromisso
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;