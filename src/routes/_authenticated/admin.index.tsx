import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { formatarPreco, gerarSlug } from "@/data/cursos";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminCursos,
});

const rotuloStatus = { rascunho: "Rascunho", publicado: "Publicado", arquivado: "Arquivado" } as const;
const corStatus = {
  rascunho: "bg-muted text-muted-foreground",
  publicado: "bg-success-soft text-success",
  arquivado: "bg-gold-soft text-accent-foreground",
} as const;

function AdminCursos() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: cursos = [], isLoading } = useQuery({
    queryKey: ["admin-cursos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cursos")
        .select("id, titulo, categoria, preco, status, carga_horaria, modulos(count)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const novo = async () => {
    const titulo = "Novo curso";
    const { data, error } = await supabase
      .from("cursos")
      .insert({ titulo, slug: `${gerarSlug(titulo)}-${Date.now().toString(36)}` })
      .select("id")
      .single();
    if (error) return toast.error("Não foi possível criar o curso.");
    qc.invalidateQueries({ queryKey: ["admin-cursos"] });
    navigate({ to: "/admin/cursos/$id", params: { id: data.id } });
    return undefined;
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl">Cursos</h1>
        <button onClick={novo} className="btn-base btn-primary">
          Novo curso
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-4">Curso</th>
              <th className="p-4">Categoria</th>
              <th className="p-4">Preço</th>
              <th className="p-4">Módulos</th>
              <th className="p-4">Status</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-muted-foreground">
                  Carregando...
                </td>
              </tr>
            )}
            {cursos.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0">
                <td className="p-4 font-medium">{c.titulo}</td>
                <td className="p-4 text-muted-foreground">{c.categoria}</td>
                <td className="p-4">{formatarPreco(Number(c.preco))}</td>
                <td className="p-4">{(c.modulos as unknown as { count: number }[])[0]?.count ?? 0}</td>
                <td className="p-4">
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${corStatus[c.status]}`}>
                    {rotuloStatus[c.status]}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <Link to="/admin/cursos/$id" params={{ id: c.id }} className="btn-base btn-outline">
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
