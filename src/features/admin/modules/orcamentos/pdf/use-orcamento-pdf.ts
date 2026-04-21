import { useCallback } from "react";
import { useToast } from "@/features/admin/hooks/use-toast";
import { mapOrcamentoToPdfData } from "@/features/admin/modules/orcamentos/mappers";
import { downloadOrcamentoPdf } from "@/features/admin/modules/orcamentos/pdf/generate-orcamento-pdf";
import type { OrcamentoCompleto } from "@/features/admin/modules/orcamentos/types";

export const useOrcamentoPdf = () => {
  const { toast } = useToast();

  const generatePDF = useCallback(
    async (orcamento: OrcamentoCompleto) => {
      toast({
        title: "Gerando PDF...",
        description: "Montando o documento do orçamento.",
      });

      try {
        const fileName = downloadOrcamentoPdf(mapOrcamentoToPdfData(orcamento));

        toast({
          title: "PDF gerado com sucesso",
          description: `Arquivo ${fileName} pronto para download.`,
        });

        return fileName;
      } catch (error) {
        console.error("Erro ao gerar PDF:", error);
        toast({
          title: "Erro ao gerar PDF",
          description: "Nao foi possivel gerar o arquivo PDF.",
          variant: "destructive",
        });
        return null;
      }
    },
    [toast],
  );

  return {
    generatePDF,
    generatePdf: generatePDF,
  };
};
