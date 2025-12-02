import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Checkbox } from '@/shared/ui/checkbox';
import { Textarea } from '@/shared/ui/textarea';
import { B2CFormData } from '@/shared/types/forms';
import { Heart } from 'lucide-react';

interface B2CFormProps {
  form: UseFormReturn<B2CFormData>;
}

const B2CForm: React.FC<B2CFormProps> = ({ form }) => {
  const eventType = form.watch('eventType');
  const isGenderReveal = form.watch('isGenderReveal');

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Seu Evento Especial</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Vamos criar momentos inesquecíveis juntos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="eventType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Evento</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="casamento">Casamento</SelectItem>
                  <SelectItem value="aniversario">Aniversário</SelectItem>
                  <SelectItem value="cha-revelacao">Chá de Revelação</SelectItem>
                  <SelectItem value="noivado">Noivado</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
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
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="cityUF"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cidade/UF</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Brasília/DF" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="attendeesRange"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Convidados</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ate-50">Até 50 pessoas</SelectItem>
                  <SelectItem value="50-100">50 a 100 pessoas</SelectItem>
                  <SelectItem value="100-200">100 a 200 pessoas</SelectItem>
                  <SelectItem value="200+">Mais de 200 pessoas</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="budgetRange"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Orçamento Estimado para Fogos</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ate-5k">Até R$ 5 mil</SelectItem>
                  <SelectItem value="5k-15k">R$ 5 mil a 15 mil</SelectItem>
                  <SelectItem value="15k-30k">R$ 15 mil a 30 mil</SelectItem>
                  <SelectItem value="30k+">Acima de R$ 30 mil</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="venueType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Local</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="residencia">Residência</SelectItem>
                  <SelectItem value="salao">Salão de Festas</SelectItem>
                  <SelectItem value="area-aberta">Área Aberta/Chácara</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hasNoiseRestrictions"
          render={({ field }) => (
            <FormItem className="flex flex-col justify-end pb-2">
              <div className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm">
                    Há restrições de ruído no local?
                  </FormLabel>
                  <FormDescription className="text-xs">
                    Podemos sugerir opções silenciosas
                  </FormDescription>
                </div>
              </div>
            </FormItem>
          )}
        />
      </div>

      {/* Gender Reveal Section */}
      {eventType === 'cha-revelacao' && (
        <div className="border rounded-lg p-4 bg-muted/30 space-y-4">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <span className="text-lg">👶</span>
            Chá de Revelação
          </h4>

          <FormField
            control={form.control}
            name="isGenderReveal"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm">
                    Deseja incluir revelação de gênero com fogos coloridos?
                  </FormLabel>
                  <FormDescription className="text-xs">
                    Azul ou Rosa - um momento especial!
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {isGenderReveal && (
            <FormField
              control={form.control}
              name="expectedGender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qual será a revelação?</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="menino">Menino (Azul) 💙</SelectItem>
                      <SelectItem value="menina">Menina (Rosa) 💗</SelectItem>
                      <SelectItem value="surpresa">Surpresa (nós não sabemos ainda!) 🎁</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs">
                    Esta informação é confidencial - apenas nossa equipe terá acesso
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="productType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kit Sugerido (Opcional)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha um kit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="kit-cha-basico">Kit Chá Básico</SelectItem>
                    <SelectItem value="kit-cha-premium">Kit Chá Premium</SelectItem>
                    <SelectItem value="kit-cha-surpresa">Kit Chá Surpresa</SelectItem>
                    <SelectItem value="personalizado">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      {/* Contact Information */}
      <div className="border-t pt-4">
        <h4 className="font-medium mb-3">Dados de Contato</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="contactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Seu Nome Completo</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="partnerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do(a) Parceiro(a) (Opcional)</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do parceiro" {...field} />
                </FormControl>
                <FormDescription className="text-xs">
                  Para casamentos e eventos em casal
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="contactEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="seu@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone/WhatsApp</FormLabel>
                <FormControl>
                  <Input placeholder="(61) 98273-5575" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="additionalInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conte-nos Mais Sobre Seu Evento (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Compartilhe detalhes especiais, temas, cores, horários específicos..."
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default B2CForm;
