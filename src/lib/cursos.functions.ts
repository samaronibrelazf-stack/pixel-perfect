import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { imagemPadrao, type Curso } from "@/data/cursos";

const SELECT =
  "id, slug, titulo, resumo, descricao, objetivo, publico, categoria, instrutor, carga_horaria, preco, imagem_url, materiais, nota_minima, nota, destaque, modulos(titulo, ordem, aulas(titulo, ordem))";

function clientePublico() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

type Linha = {
  id: string;
  slug: string;
  titulo: string;
  resumo: string;
  descricao: string;
  objetivo: string;
  publico: string;
  categoria: string;
  instrutor: string;
  carga_horaria: number;
  preco: number | string;
  imagem_url: string | null;
  materiais: string[];
  nota_minima: number;
  nota: number | string;
  destaque: boolean;
  modulos: { titulo: string; ordem: number; aulas: { titulo: string; ordem: number }[] }[];
};

function paraCurso(r: Linha): Curso {
  return {
    id: r.id,
    slug: r.slug,
    titulo: r.titulo,
    resumo: r.resumo,
    descricao: r.descricao,
    objetivo: r.objetivo,
    publico: r.publico,
    categoria: r.categoria,
    instrutor: r.instrutor,
    cargaHoraria: r.carga_horaria,
    preco: Number(r.preco),
    nota: Number(r.nota),
    destaque: r.destaque,
    imagem: r.imagem_url || imagemPadrao(r.slug, r.categoria),
    materiais: r.materiais ?? [],
    notaMinima: r.nota_minima,
    modulos: [...(r.modulos ?? [])]
      .sort((a, b) => a.ordem - b.ordem)
      .map((m) => ({
        titulo: m.titulo,
        aulas: [...(m.aulas ?? [])].sort((a, b) => a.ordem - b.ordem).map((a) => a.titulo),
      })),
  };
}

export const listarCursosPublicos = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await clientePublico()
    .from("cursos")
    .select(SELECT)
    .eq("status", "publicado")
    .order("destaque", { ascending: false })
    .order("created_at", { ascending: true });
  if (error) {
    console.error("listarCursosPublicos", error);
    return [] as Curso[];
  }
  return (data as unknown as Linha[]).map(paraCurso);
});

export const obterCursoPublico = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ slug: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const { data: row, error } = await clientePublico()
      .from("cursos")
      .select(SELECT)
      .eq("status", "publicado")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) console.error("obterCursoPublico", error);
    return row ? paraCurso(row as unknown as Linha) : null;
  });

export const cursosQuery = queryOptions({
  queryKey: ["cursos-publicos"],
  queryFn: () => listarCursosPublicos(),
});

export const cursoQuery = (slug: string) =>
  queryOptions({
    queryKey: ["curso-publico", slug],
    queryFn: () => obterCursoPublico({ data: { slug } }),
  });
