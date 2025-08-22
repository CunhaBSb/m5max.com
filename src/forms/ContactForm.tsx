import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, MessageSquare } from "lucide-react";
import { getUTMParams, getTrackingParams } from "@/utils";
import type { Lead, PublicSegment } from "@/types";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  phone: z.string().min(10, {
    message: "Telefone deve ter pelo menos 10 dígitos.",
  }),
  segment: z.string({
    required_error: "Selecione o tipo de evento.",
  }),
  eventType: z.string().optional(),
  eventDate: z.string().optional(),
  city: z.string().min(2, {
    message: "Cidade deve ter pelo menos 2 caracteres.",
  }),
  state: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ContactFormProps {
  defaultSegment?: PublicSegment;
  onSubmit?: (data: Lead) => void;
  onWhatsApp?: (data: Partial<Lead>) => void;
}

export function ContactForm({ defaultSegment, onSubmit, onWhatsApp }: ContactFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      segment: defaultSegment || "",
    },
  });

  const watchedSegment = form.watch("segment");

  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true);
    
    try {
      const utmParams = getUTMParams();
      const trackingParams = getTrackingParams();
      
      const leadData: Lead = {
        ...values,
        segment: values.segment as PublicSegment,
        state: values.state || "SP",
        ...utmParams,
        ...trackingParams,
        createdAt: new Date(),
      };

      // Track form submission event
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'lead_form_submit', {
          event_category: 'Form',
          event_label: values.segment,
          audience_segment: values.segment,
          value: 1,
        });
      }

      onSubmit?.(leadData);
      
      // Reset form after successful submission
      form.reset();
      
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppClick = () => {
    const values = form.getValues();
    
    // Track WhatsApp click event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'whatsapp_click', {
        event_category: 'Contact',
        event_label: 'Form WhatsApp Button',
        audience_segment: values.segment,
      });
    }

    onWhatsApp?.(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo *</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="seu@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone/WhatsApp *</FormLabel>
                <FormControl>
                  <Input placeholder="(11) 99999-9999" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="segment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Evento *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="b2b">Show Pirotécnico Profissional</SelectItem>
                    <SelectItem value="cha">Chá Revelação</SelectItem>
                    <SelectItem value="kits">Kits DIY</SelectItem>
                    <SelectItem value="casamento">Casamento</SelectItem>
                    <SelectItem value="corporativo">Evento Corporativo</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {watchedSegment === "cha" && (
          <FormField
            control={form.control}
            name="eventType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Chá Revelação</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="kit-basico">Kit Básico</SelectItem>
                    <SelectItem value="kit-premium">Kit Premium</SelectItem>
                    <SelectItem value="show-completo">Show Completo</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade *</FormLabel>
                <FormControl>
                  <Input placeholder="São Paulo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="eventDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data do Evento</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormDescription>
                  Informe a data prevista (se já tiver)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Orçamento Previsto</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a faixa de orçamento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ate-1k">Até R$ 1.000</SelectItem>
                  <SelectItem value="1k-5k">R$ 1.000 - R$ 5.000</SelectItem>
                  <SelectItem value="5k-10k">R$ 5.000 - R$ 10.000</SelectItem>
                  <SelectItem value="10k-20k">R$ 10.000 - R$ 20.000</SelectItem>
                  <SelectItem value="20k-mais">Acima de R$ 20.000</SelectItem>
                  <SelectItem value="nao-sei">Não sei ainda</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Detalhes do Evento</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Conte-nos mais sobre seu evento: número de convidados, tipo de local, expectativas..."
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Quanto mais detalhes, melhor poderemos ajudar!
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            type="submit" 
            className="flex-1 bg-fire-orange hover:bg-fire-red" 
            disabled={isLoading}
          >
            <Send className="w-4 h-4 mr-2" />
            {isLoading ? "Enviando..." : "Enviar Solicitação"}
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            className="flex-1"
            onClick={handleWhatsAppClick}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            WhatsApp Direto
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          * Campos obrigatórios. Seus dados estão protegidos conforme nossa política de privacidade.
        </p>
      </form>
    </Form>
  );
}