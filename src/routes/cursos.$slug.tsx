import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { formatarPreco, totalAulas } from "@/data/cursos";
import { cursoQuery } from "@/lib/cursos.functions";
import { InscreverBotao } from "@/components/InscreverBotao";

export const Route = createFileRoute("/cursos/$slug")({
  loader: async ({ params, context }) => {
    const curso = await context.queryClient.ensureQueryData(cursoQuery(params.slug));
    if (!curso) throw notFound();
    return { curso };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Curso não encontrado — ALTiora" }, { name: "robots", content: "noindex" }],
      };
    }
    const { curso } = loaderData;
    return {
      meta: [
        { title: `${curso.titulo} — ALTiora` },
        { name: "description", content: curso.resumo },
        { property: "og:title", content: `${curso.titulo} — ALTiora` },
        { property: "og:description", content: curso.resumo },
      ],
    };
  },
  notFoundComponent: CursoNaoEncontrado,
  component: PaginaCurso,
});

function CursoNaoEncontrado() {
  return (
    <div className="container-page py-20 text-center">
      <h1 className="text-2xl">Curso não encontrado</h1>
      <p className="mt-2 text-muted-foreground">O curso que você procura não está no catálogo.</p>
      <Link to="/cursos" className="btn-base btn-primary mt-6">
        Ver catálogo
      </Link>
    </div>
  );
}

function PaginaCurso() {
  const { curso } = Route.useLoaderData();
  const gratuito = curso.preco === 0;

  return (
    <article>
      <header className="border-b border-border bg-primary text-primary-foreground">
        <div className="container-page grid gap-8 py-12 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
              {curso.categoria}
            </p>
            <h1 className="mt-3 font-display text-3xl leading-tight md:text-4xl">{curso.titulo}</h1>
            <p className="mt-3 max-w-xl text-primary-foreground/75">{curso.descricao}</p>
            <p className="mt-4 text-sm text-primary-foreground/70">
              {curso.instrutor} · {curso.cargaHoraria}h · {curso.modulos.length} módulos ·{" "}
              {totalAulas(curso)} aulas · ★ {curso.nota.toFixed(1).replace(".", ",")}
            </p>
          </div>
          <img
            src={curso.imagem}
            alt={curso.titulo}
            loading="lazy"
            width={1024}
            height={640}
            className="w-full rounded-xl object-cover shadow-card"
          />
        </div>
      </header>

      <div className="container-page grid gap-8 py-12 lg:grid-cols-[1fr_20rem] lg:items-start">
        <div className="space-y-10">
          <section>
            <h2 className="text-xl">Objetivo</h2>
            <p className="mt-2 text-muted-foreground">{curso.objetivo}</p>
          </section>

          <section>
            <h2 className="text-xl">Público-alvo</h2>
            <p className="mt-2 text-muted-foreground">{curso.publico}</p>
          </section>

          <section>
            <h2 className="text-xl">Conteúdo programático</h2>
            <ol className="mt-4 space-y-3">
              {curso.modulos.map((m, i) => (
                <li key={m.titulo} className="rounded-xl border border-border bg-card p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Módulo {i + 1}
                  </p>
                  <h3 className="mt-1 text-lg">{m.titulo}</h3>
                  <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                    {m.aulas.map((a) => (
                      <li key={a} className="flex gap-2">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="text-xl">Materiais disponíveis</h2>
            <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              {curso.materiais.map((m) => (
                <li key={m} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />
                  {m}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl">Avaliação e certificado</h2>
            <p className="mt-2 text-muted-foreground">
              A avaliação final é corrigida automaticamente e exige nota mínima de{" "}
              {curso.notaMinima}% para aprovação. O certificado é emitido somente após a conclusão
              de 100% das aulas obrigatórias e a aprovação na avaliação, e pode ser verificado
              publicamente pelo código ou QR Code.
            </p>
          </section>
        </div>

        <aside className="rounded-xl border border-border bg-card p-6 shadow-card lg:sticky lg:top-24">
          <span
            className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              gratuito ? "bg-success-soft text-success" : "bg-gold-soft text-accent-foreground"
            }`}
          >
            {gratuito ? "Gratuito" : "Pago"}
          </span>
          <p className="mt-3 font-display text-3xl font-semibold">{formatarPreco(curso.preco)}</p>
          <InscreverBotao gratuito={gratuito} />
          <dl className="mt-5 space-y-2 border-t border-border pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Carga horária</dt>
              <dd className="font-medium">{curso.cargaHoraria}h</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Módulos</dt>
              <dd className="font-medium">{curso.modulos.length}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Aulas</dt>
              <dd className="font-medium">{totalAulas(curso)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Nota mínima</dt>
              <dd className="font-medium">{curso.notaMinima}%</dd>
            </div>
          </dl>
        </aside>
      </div>
    </article>
  );
}
