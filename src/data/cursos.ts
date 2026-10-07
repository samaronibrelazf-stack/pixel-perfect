import financas from "@/assets/altiora-administracao.webp.asset.json";
import dados from "@/assets/curso-dados.webp.asset.json";
import projetos from "@/assets/curso-projetos.webp.asset.json";
import comunicacao from "@/assets/altiora-atendimento.webp.asset.json";

export type Curso = {
  id: string;
  slug: string;
  titulo: string;
  resumo: string;
  descricao: string;
  objetivo: string;
  publico: string;
  categoria: string;
  instrutor: string;
  cargaHoraria: number;
  modulos: { titulo: string; aulas: string[] }[];
  nota: number;
  preco: number; // 0 = gratuito
  destaque: boolean;
  imagem: string;
  materiais: string[];
  notaMinima: number;
};

/** Capa padrão quando o curso ainda não tem imagem própria. */
export const imagemPadrao = (slug: string, categoria: string) => {
  if (slug === "gestao-financeira") return financas.url;
  if (slug === "comunicacao-corporativa") return comunicacao.url;
  if (categoria === "Tecnologia") return dados.url;
  return projetos.url;
};

export const descricaoImagemCurso = (curso: Curso) => {
  if (curso.imagem === financas.url) return "Imagem ilustrativa: profissionais analisam documentos e gráficos financeiros em uma rotina administrativa.";
  if (curso.imagem === dados.url) return "Imagem ilustrativa: análise de gráficos e dados em um computador.";
  if (curso.imagem === projetos.url) return "Imagem ilustrativa: quadro de tarefas e cronograma de um projeto.";
  if (curso.imagem === comunicacao.url) return "Imagem ilustrativa: profissionais praticam comunicação e atendimento com computador e headset.";
  return `Capa do curso ${curso.titulo}`;
};

export const formatarPreco = (preco: number) =>
  preco === 0
    ? "Gratuito"
    : preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });

export const totalAulas = (curso: Curso) =>
  curso.modulos.reduce((soma, m) => soma + m.aulas.length, 0);

export const gerarSlug = (texto: string) =>
  texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export type Certificado = {
  codigo: string;
  aluno: string;
  curso: string;
  cargaHoraria: number;
  emitidoEm: string;
  nota: number;
};

// Certificados de exemplo — serão substituídos pela emissão real na etapa 2.
export const certificados: Certificado[] = [
  {
    codigo: "ALT-2026-88412",
    aluno: "Ana Beatriz Moraes",
    curso: "Gestão Financeira para Pequenos Negócios",
    cargaHoraria: 40,
    emitidoEm: "12/05/2026",
    nota: 92,
  },
  {
    codigo: "ALT-2026-10237",
    aluno: "Carlos Henrique Lima",
    curso: "Análise de Dados com Python",
    cargaHoraria: 48,
    emitidoEm: "03/08/2026",
    nota: 85,
  },
];
