import jsPDF from "jspdf";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { OrcamentoPdfData } from "@/features/admin/modules/orcamentos/types";

type CompanyPdfConfig = {
  name: string;
  lines: [string, string];
  footer: [string, string];
};

const DEFAULT_COMPANY_CONFIG: CompanyPdfConfig = {
  name: "M5 MAX PRODUCOES",
  lines: ["Shows Pirotecnicos Profissionais", "40+ Anos de Experiencia"],
  footer: [
    "M5 MAX Producoes - Shows Pirotecnicos",
    "Luziânia - GO | Contato comercial sob demanda",
  ],
};

const PRIMARY_COLOR = [249, 115, 22] as const;
const MUTED_COLOR = [100, 100, 100] as const;

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const formatDate = (value: string | null | undefined): string => {
  if (!value) {
    return "Data nao informada";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return format(parsedDate, "dd/MM/yyyy", { locale: ptBR });
};

const sanitizeFilePart = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");

export const buildOrcamentoPdfFileName = (orcamento: OrcamentoPdfData) => {
  const idPart = sanitizeFilePart(String(orcamento.id).slice(0, 12)) || "sem-id";
  const clientPart = sanitizeFilePart(orcamento.nome_contratante) || "cliente";
  return `Orcamento_${idPart}_${clientPart}.pdf`;
};

export const createOrcamentoPdfDocument = (
  orcamento: OrcamentoPdfData,
  companyConfig: CompanyPdfConfig = DEFAULT_COMPANY_CONFIG,
) => {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let currentY = 20;

  pdf.setFont("helvetica");

  pdf.setFontSize(20);
  pdf.setTextColor(...PRIMARY_COLOR);
  pdf.text(companyConfig.name, pageWidth / 2, currentY, { align: "center" });

  currentY += 8;
  pdf.setFontSize(12);
  pdf.setTextColor(...MUTED_COLOR);
  pdf.text(companyConfig.lines[0], pageWidth / 2, currentY, { align: "center" });

  currentY += 5;
  pdf.text(companyConfig.lines[1], pageWidth / 2, currentY, { align: "center" });

  currentY += 15;
  pdf.setDrawColor(...PRIMARY_COLOR);
  pdf.line(20, currentY, pageWidth - 20, currentY);
  currentY += 10;

  pdf.setFontSize(16);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`ORCAMENTO #${String(orcamento.id).split('-')[0].toUpperCase()}`, 20, currentY);

  pdf.setFontSize(10);
  pdf.setTextColor(...MUTED_COLOR);
  pdf.text(
    `Gerado em: ${formatDate(new Date().toISOString())}`,
    pageWidth - 20,
    currentY,
    { align: "right" },
  );

  currentY += 15;

  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text("DADOS DO CLIENTE", 20, currentY);
  currentY += 8;

  pdf.setFontSize(10);
  pdf.text(`Nome: ${orcamento.nome_contratante}`, 25, currentY);
  currentY += 5;

  if (orcamento.telefone) {
    pdf.text(`Telefone: ${orcamento.telefone}`, 25, currentY);
    currentY += 5;
  }

  if (orcamento.cpf) {
    pdf.text(`CPF: ${orcamento.cpf}`, 25, currentY);
    currentY += 5;
  }

  currentY += 5;

  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text("DADOS DO EVENTO", 20, currentY);
  currentY += 8;

  pdf.setFontSize(10);
  pdf.text(`Evento: ${orcamento.evento_nome}`, 25, currentY);
  currentY += 5;
  pdf.text(`Data: ${formatDate(orcamento.evento_data)}`, 25, currentY);
  currentY += 5;

  if (orcamento.evento_local) {
    pdf.text(`Local: ${orcamento.evento_local}`, 25, currentY);
    currentY += 5;
  }

  currentY += 10;

  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text("PRODUTOS INCLUIDOS", 20, currentY);
  currentY += 8;

  pdf.setFillColor(...PRIMARY_COLOR);
  pdf.rect(20, currentY, pageWidth - 40, 7, "F");

  pdf.setFontSize(9);
  pdf.setTextColor(255, 255, 255);
  pdf.text("PRODUTO", 25, currentY + 5);
  pdf.text("QTD", pageWidth - 100, currentY + 5);
  pdf.text("VALOR UNIT.", pageWidth - 70, currentY + 5);
  pdf.text("SUBTOTAL", pageWidth - 30, currentY + 5);
  currentY += 10;

  pdf.setTextColor(0, 0, 0);

  (orcamento.orcamentos_produtos || []).forEach((item) => {
    if (currentY > pageHeight - 40) {
      pdf.addPage();
      currentY = 20;
    }

    const subtotal = item.quantidade * item.valor_unitario;

    pdf.setFontSize(9);
    pdf.text(item.produtos?.descricao_completa || "Produto sem descrição", 25, currentY);
    pdf.text(item.quantidade.toString(), pageWidth - 100, currentY, {
      align: "right",
    });
    pdf.text(formatCurrency(item.valor_unitario), pageWidth - 70, currentY, {
      align: "right",
    });
    pdf.text(formatCurrency(subtotal), pageWidth - 30, currentY, {
      align: "right",
    });

    currentY += 6;
  });

  currentY += 5;
  pdf.setDrawColor(200, 200, 200);
  pdf.line(20, currentY, pageWidth - 20, currentY);
  currentY += 8;

  pdf.setFontSize(12);
  pdf.setTextColor(0, 0, 0);
  pdf.text("VALOR TOTAL:", pageWidth - 80, currentY);
  pdf.setTextColor(...PRIMARY_COLOR);
  pdf.text(formatCurrency(orcamento.valor_total ?? 0), pageWidth - 30, currentY, {
    align: "right",
  });

  if (orcamento.observacoes) {
    currentY += 15;
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text("OBSERVACOES", 20, currentY);
    currentY += 8;

    pdf.setFontSize(10);
    const lines = pdf.splitTextToSize(orcamento.observacoes, pageWidth - 50);
    pdf.text(lines, 25, currentY);
  }

  const footerY = pageHeight - 30;
  pdf.setDrawColor(...PRIMARY_COLOR);
  pdf.line(20, footerY - 10, pageWidth - 20, footerY - 10);
  pdf.setFontSize(9);
  pdf.setTextColor(...MUTED_COLOR);
  pdf.text(companyConfig.footer[0], pageWidth / 2, footerY, { align: "center" });
  pdf.text(companyConfig.footer[1], pageWidth / 2, footerY + 5, {
    align: "center",
  });

  return {
    pdf,
    fileName: buildOrcamentoPdfFileName(orcamento),
  };
};

export const downloadOrcamentoPdf = (orcamento: OrcamentoPdfData): string => {
  const { pdf, fileName } = createOrcamentoPdfDocument(orcamento);
  pdf.save(fileName);
  return fileName;
};
