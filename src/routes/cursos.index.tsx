import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CursoCard } from "@/components/CursoCard";
import { cursosQuery } from "@/lib/cursos.functions";

export const Route = createFileRoute("/cursos/")({
  head: () => ({
    meta: [
      { title: "Catálogo de cursos — ALTiora" },
      {
        name: "description",
        content:
          "Busque, filtre e compare cursos gratuitos e pagos da ALTiora por categoria, preço e avaliação.",
      },
      { property: "og:title", content: "Catálogo de cursos — ALTiora" },
      {
        property: "og:description",
        content: "Cursos gratuitos e pagos com certificado validável.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(cursosQuery),
  component: Catalogo,
});

const precos = ["Todos", "Gratuitos", "Pagos"] as const;
const ordens = ["Relevância", "Melhor avaliados", "Maior carga horária", "Menor preço"] as const;

function Catalogo() {
  const { data: cursos } = useSuspenseQuery(cursosQuery);
  const categorias = ["Todas", ...Array.from(new Set(cursos.map((c) => c.categoria)))];
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [preco, setPreco] = useState<(typeof precos)[number]>("Todos");
  const [ordem, setOrdem] = useState<(typeof ordens)[number]>("Relevância");

  const lista = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    let r = cursos.filter((c) => {
      const casaBusca =
        !termo ||
        c.titulo.toLowerCase().includes(termo) ||
        c.instrutor.toLowerCase().includes(termo) ||
        c.categoria.toLowerCase().includes(termo);
      const casaCategoria = categoria === "Todas" || c.categoria === categoria;
      const casaPreco =
        preco === "Todos" ||
        (preco === "Gratuitos" && c.preco === 0) ||
        (preco === "Pagos" && c.preco > 0);
      return casaBusca && casaCategoria && casaPreco;
    });

    r = [...r];
    if (ordem === "Melhor avaliados") r.sort((a, b) => b.nota - a.nota);
    if (ordem === "Maior carga horária") r.sort((a, b) => b.cargaHoraria - a.cargaHoraria);
    if (ordem === "Menor preço") r.sort((a, b) => a.preco - b.preco);
    if (ordem === "Relevância") r.sort((a, b) => Number(b.destaque) - Number(a.destaque));
    return r;
  }, [cursos, busca, categoria, preco, ordem]);

  return (
    <div className="container-page py-12">
      <h1 className="text-3xl">Catálogo de cursos</h1>
      <p className="mt-2 text-muted-foreground">
        {lista.length} {lista.length === 1 ? "curso encontrado" : "cursos encontrados"}
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[16rem_1fr]">
        <aside className="h-max rounded-xl border border-border bg-card p-5 shadow-card">
          <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Buscar
          </label>
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Curso, área ou instrutor"
            className="mt-2 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring"
          />

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Categoria
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {categorias.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategoria(c)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  categoria === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Preço
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {precos.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPreco(p)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  preco === p
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Ordenar por
          </p>
          <select
            value={ordem}
            onChange={(e) => setOrdem(e.target.value as (typeof ordens)[number])}
            className="mt-2 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring"
          >
            {ordens.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </aside>

        <div>
          {lista.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-10 text-center">
              <p className="font-display text-lg">Nenhum curso encontrado</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Ajuste a busca ou limpe os filtros para ver mais opções.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {lista.map((c) => (
                <CursoCard key={c.slug} curso={c} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
