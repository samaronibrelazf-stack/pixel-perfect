import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type CursoRow = Database["public"]["Tables"]["cursos"]["Row"];

export const Route = createFileRoute("/_authenticated/admin/cursos/$id")({
  component: EditarCurso,
});

const campo =
  "mt-1.5 h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring";

function EditarCurso() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const { data: curso } = useQuery({
    queryKey: ["admin-curso", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("cursos").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    },
  });
  const { data: modulos = [] } = useQuery({
    queryKey: ["admin-modulos", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("modulos")
        .select("id, titulo, ordem, aulas(id, titulo, ordem)")
        .eq("curso_id", id)
        .order("ordem");
      if (error) throw error;
      return data.map((m) => ({ ...m, aulas: [...m.aulas].sort((a, b) => a.ordem - b.ordem) }));
    },
  });
  const [f, setF] = useState<Partial<CursoRow>>({});
  useEffect(() => {
    if (curso) setF(curso);
  }, [curso]);

  const recarregar = () => qc.invalidateQueries({ queryKey: ["admin-modulos", id] });

  const salvar = async () => {
    const problemas: string[] = [];
    if (!f.titulo?.trim()) problemas.push("Informe o título do curso.");
    if (!f.slug?.trim()) problemas.push("Informe o endereço (slug) do curso.");
    else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(f.slug.trim()))
      problemas.push("O endereço (slug) só pode ter letras minúsculas, números e hífens, sem espaços.");
    if (!f.resumo?.trim()) problemas.push("Informe um resumo do curso.");
    if (!f.categoria?.trim()) problemas.push("Informe a categoria.");
    if (!f.instrutor?.trim()) problemas.push("Informe o instrutor responsável.");
    const carga = Number(f.carga_horaria);
    if (!Number.isFinite(carga) || carga <= 0) problemas.push("A carga horária precisa ser maior que zero.");
    const preco = Number(f.preco);
    if (!Number.isFinite(preco) || preco < 0) problemas.push("O preço não pode ser negativo (use 0 para curso gratuito).");
    const notaMin = Number(f.nota_minima);
    if (!Number.isFinite(notaMin) || notaMin < 0 || notaMin > 100)
      problemas.push("A nota mínima precisa estar entre 0 e 100.");
    if (f.imagem_url && !/^https?:\/\/.+/.test(f.imagem_url.trim()))
      problemas.push("O endereço da imagem de capa precisa começar com http:// ou https://.");
    if (problemas.length > 0) {
      toast.error("Revise o formulário antes de salvar:", {
        description: problemas.map((p) => `• ${p}`).join("\n"),
        duration: 8000,
      });
      return;
    }

    const { error } = await supabase
      .from("cursos")
      .update({
        titulo: f.titulo!.trim(), slug: f.slug!.trim(), resumo: f.resumo!.trim(),
        descricao: f.descricao ?? "", objetivo: f.objetivo ?? "",
        publico: f.publico ?? "", categoria: f.categoria!.trim(), instrutor: f.instrutor!.trim(),
        carga_horaria: carga, preco,
        imagem_url: f.imagem_url?.trim() || null, materiais: f.materiais ?? [], nota_minima: notaMin,
        destaque: f.destaque ?? false, status: f.status ?? "rascunho",
      })
      .eq("id", id);
    if (error) {
      if (error.code === "23505")
        toast.error("Não foi possível salvar: já existe outro curso com este endereço (slug). Escolha um endereço diferente.");
      else if (error.code === "42501" || error.message?.includes("row-level security"))
        toast.error("Não foi possível salvar: sua conta não tem permissão de administrador.");
      else
        toast.error("Não foi possível salvar o curso. Verifique sua conexão e tente novamente.", {
          description: error.message,
        });
    } else {
      toast.success("Curso salvo com sucesso.");
      qc.invalidateQueries();
    }
  };

  const trocar = async (tabela: "modulos" | "aulas", a: { id: string; ordem: number }, b?: { id: string; ordem: number }) => {
    if (!b) return;
    await supabase.from(tabela).update({ ordem: b.ordem }).eq("id", a.id);
    await supabase.from(tabela).update({ ordem: a.ordem }).eq("id", b.id);
    recarregar();
  };

  if (!curso) return <p className="text-muted-foreground">Carregando...</p>;

  const txt = (k: keyof CursoRow, rotulo: string, tipo = "text") => (
    <label className="block text-sm font-medium">
      {rotulo}
      <input type={tipo} value={String(f[k] ?? "")} onChange={(e) => setF({ ...f, [k]: e.target.value })} className={campo} />
    </label>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/admin" className="text-sm text-muted-foreground">← Voltar aos cursos</Link>
        <button onClick={salvar} className="btn-base btn-primary">Salvar curso</button>
      </div>

      <section className="grid gap-4 rounded-xl border border-border bg-card p-6 shadow-card sm:grid-cols-2">
        {txt("titulo", "Título")}
        {txt("slug", "Endereço (slug)")}
        {txt("categoria", "Categoria")}
        {txt("instrutor", "Instrutor")}
        {txt("carga_horaria", "Carga horária (h)", "number")}
        {txt("preco", "Preço (R$, 0 = gratuito)", "number")}
        {txt("nota_minima", "Nota mínima (%)", "number")}
        {txt("imagem_url", "Endereço da imagem de capa")}
        {txt("resumo", "Resumo")}
        {txt("publico", "Público-alvo")}
        <label className="block text-sm font-medium sm:col-span-2">
          Descrição
          <textarea rows={3} value={f.descricao ?? ""} onChange={(e) => setF({ ...f, descricao: e.target.value })} className={`${campo} h-auto py-2`} />
        </label>
        <label className="block text-sm font-medium sm:col-span-2">
          Objetivo
          <textarea rows={2} value={f.objetivo ?? ""} onChange={(e) => setF({ ...f, objetivo: e.target.value })} className={`${campo} h-auto py-2`} />
        </label>
        <label className="block text-sm font-medium sm:col-span-2">
          Materiais (um por linha)
          <textarea rows={3} value={(f.materiais ?? []).join("\n")} onChange={(e) => setF({ ...f, materiais: e.target.value.split("\n").filter(Boolean) })} className={`${campo} h-auto py-2`} />
        </label>
        <label className="block text-sm font-medium">
          Status
          <select value={f.status} onChange={(e) => setF({ ...f, status: e.target.value as CursoRow["status"] })} className={campo}>
            <option value="rascunho">Rascunho</option>
            <option value="publicado">Publicado</option>
            <option value="arquivado">Arquivado</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" checked={!!f.destaque} onChange={(e) => setF({ ...f, destaque: e.target.checked })} />
          Curso em destaque
        </label>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-xl">Módulos e aulas</h2>
          <button
            className="btn-base btn-outline"
            onClick={async () => {
              const titulo = prompt("Título do módulo");
              if (!titulo) return;
              await supabase.from("modulos").insert({ curso_id: id, titulo, ordem: (modulos.at(-1)?.ordem ?? 0) + 1 });
              recarregar();
            }}
          >
            Adicionar módulo
          </button>
        </div>
        <ol className="mt-4 space-y-3">
          {modulos.map((m, i) => (
            <li key={m.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">Módulo {i + 1}</span>
                <strong className="flex-1">{m.titulo}</strong>
                <button className="text-xs underline" onClick={() => trocar("modulos", m, modulos[i - 1])}>Subir</button>
                <button className="text-xs underline" onClick={() => trocar("modulos", m, modulos[i + 1])}>Descer</button>
                <button className="text-xs underline" onClick={async () => { const t = prompt("Novo título", m.titulo); if (t) { await supabase.from("modulos").update({ titulo: t }).eq("id", m.id); recarregar(); } }}>Renomear</button>
                <button className="text-xs text-destructive underline" onClick={async () => { if (confirm("Excluir módulo e suas aulas?")) { await supabase.from("modulos").delete().eq("id", m.id); recarregar(); } }}>Excluir</button>
              </div>
              <ul className="mt-3 space-y-1.5 border-l border-border pl-4 text-sm">
                {m.aulas.map((a, j) => (
                  <li key={a.id} className="flex flex-wrap items-center gap-2">
                    <span className="flex-1">{a.titulo}</span>
                    <button className="text-xs underline" onClick={() => trocar("aulas", a, m.aulas[j - 1])}>Subir</button>
                    <button className="text-xs underline" onClick={() => trocar("aulas", a, m.aulas[j + 1])}>Descer</button>
                    <button className="text-xs underline" onClick={async () => { const t = prompt("Novo título", a.titulo); if (t) { await supabase.from("aulas").update({ titulo: t }).eq("id", a.id); recarregar(); } }}>Renomear</button>
                    <button className="text-xs text-destructive underline" onClick={async () => { if (confirm("Excluir aula?")) { await supabase.from("aulas").delete().eq("id", a.id); recarregar(); } }}>Excluir</button>
                  </li>
                ))}
                <li>
                  <button
                    className="text-xs font-medium underline"
                    onClick={async () => {
                      const titulo = prompt("Título da aula");
                      if (!titulo) return;
                      await supabase.from("aulas").insert({ modulo_id: m.id, titulo, ordem: (m.aulas.at(-1)?.ordem ?? 0) + 1 });
                      recarregar();
                    }}
                  >
                    + Adicionar aula
                  </button>
                </li>
              </ul>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
