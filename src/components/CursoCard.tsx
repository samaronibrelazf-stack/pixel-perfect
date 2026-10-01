import { Link } from "@tanstack/react-router";
import { formatarPreco, totalAulas, type Curso } from "@/data/cursos";

export function CursoCard({ curso }: { curso: Curso }) {
  const gratuito = curso.preco === 0;

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card">
      <div className="relative">
        <img
          src={curso.imagem}
          alt={curso.titulo}
          loading="lazy"
          width={1024}
          height={640}
          className="aspect-[16/10] w-full object-cover"
        />
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            gratuito ? "bg-success-soft text-success" : "bg-gold-soft text-accent-foreground"
          }`}
        >
          {gratuito ? "Gratuito" : "Pago"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {curso.categoria}
        </p>
        <h3 className="mt-1.5 text-lg leading-snug">{curso.titulo}</h3>
        <p className="mt-1.5 text-sm text-muted-foreground">{curso.resumo}</p>

        <dl className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <dd>{curso.instrutor}</dd>
          <dd>·</dd>
          <dd>{curso.cargaHoraria}h</dd>
          <dd>·</dd>
          <dd>{curso.modulos.length} módulos</dd>
          <dd>·</dd>
          <dd>{totalAulas(curso)} aulas</dd>
        </dl>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <div>
            <p className="font-display text-lg font-semibold">{formatarPreco(curso.preco)}</p>
            <p className="text-xs text-muted-foreground">★ {curso.nota.toFixed(1).replace(".", ",")}</p>
          </div>
          <Link to="/cursos/$slug" params={{ slug: curso.slug }} className="btn-base btn-primary">
            Ver curso
          </Link>
        </div>
      </div>
    </article>
  );
}
