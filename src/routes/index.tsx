import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/altiora-capacitacao.webp";
import { CursoCard } from "@/components/CursoCard";
import { useSuspenseQuery } from "@tanstack/react-query";
import { cursosQuery } from "@/lib/cursos.functions";
import { ValidadorCertificado } from "@/components/ValidadorCertificado";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "ALTiora — Cursos online com certificado validável" },
      {
        name: "description",
        content:
          "Cursos gratuitos e pagos com videoaulas, apostilas, avaliações e certificado digital validável por código.",
      },
      { property: "og:title", content: "ALTiora — Cursos online com certificado validável" },
      {
        property: "og:description",
        content: "Plataforma EAD brasileira com trilhas profissionais e certificação.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(cursosQuery),
  component: Index,
});

const beneficios = [
  { titulo: "Trilhas estruturadas", texto: "Cursos divididos em módulos e aulas, com materiais de apoio em PDF." },
  { titulo: "Avaliação com nota mínima", texto: "Provas com correção automática e tentativas configuradas por curso." },
  { titulo: "Certificado validável", texto: "Emissão automática com código público de verificação." },
];

function Index() {
  const { data: cursos } = useSuspenseQuery(cursosQuery);
  const destaques = cursos.filter((c) => c.destaque);
  const gratuitos = cursos.filter((c) => c.preco === 0);
  const pagos = cursos.filter((c) => c.preco > 0);

  return (
    <>
      <section className="border-b border-border bg-primary-gradient text-primary-foreground">
        <div className="container-page grid gap-10 py-14 md:grid-cols-2 md:items-center md:py-20">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
              Educação profissional
            </p>
            <h1 className="mt-4 font-display text-4xl leading-[1.05] md:text-5xl">
              Conhecimento que se comprova.
            </h1>
            <p className="mt-4 max-w-md text-primary-foreground/75">
              Cursos online com carga horária real, instrutores qualificados e certificado digital
              que qualquer pessoa pode validar pelo código.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/cursos" className="btn-base btn-gold">
                Explorar cursos
              </Link>
              <Link to="/certificados" className="btn-base btn-outline">
                Validar certificado
              </Link>
            </div>
          </div>
          <img
            src={heroImg}
            alt="Imagem ilustrativa: instrutora orienta um grupo em uma capacitação profissional com computadores e cadernos."
            fetchPriority="high"
            decoding="async"
            width={1672}
            height={941}
            className="aspect-video w-full rounded-xl object-contain shadow-card"
          />
        </div>
      </section>

      <section className="container-page py-14">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl">Cursos em destaque</h2>
          <Link to="/cursos" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Ver catálogo
          </Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {destaques.map((c) => (
            <CursoCard key={c.slug} curso={c} />
          ))}
        </div>
      </section>

      <section className="container-page pb-14">
        <h2 className="text-2xl">Cursos gratuitos</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {gratuitos.map((c) => (
            <CursoCard key={c.slug} curso={c} />
          ))}
        </div>
      </section>

      <section className="container-page pb-14">
        <h2 className="text-2xl">Cursos pagos</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pagos.map((c) => (
            <CursoCard key={c.slug} curso={c} />
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="container-page grid gap-8 py-14 md:grid-cols-3">
          {beneficios.map((b) => (
            <div key={b.titulo}>
              <div className="h-1 w-10 rounded-full bg-gold" />
              <h3 className="mt-4 text-lg">{b.titulo}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{b.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          <div>
            <h2 className="text-2xl">Sobre a ALTiora</h2>
            <p className="mt-3 text-muted-foreground">
              A ALTiora reúne criação, distribuição e comercialização de cursos online em um só
              lugar: videoaulas, apostilas, avaliações, acompanhamento de progresso e certificação
              automática ao final da trilha.
            </p>
            <Link to="/sobre" className="btn-base btn-outline mt-5">
              Conhecer a plataforma
            </Link>
          </div>
          <ValidadorCertificado />
        </div>
      </section>

      <section className="container-page pb-16">
        <div className="rounded-xl border border-border bg-primary-gradient p-8 text-primary-foreground sm:p-10">
          <h2 className="text-2xl">Comece hoje, sem custo</h2>
          <p className="mt-2 max-w-xl text-primary-foreground/75">
            Crie sua conta gratuita e matricule-se nos cursos liberados para iniciar sua trilha.
          </p>
          <Link to="/cursos" className="btn-base btn-gold mt-6">
            Criar conta
          </Link>
        </div>
      </section>
    </>
  );
}
