import { createFileRoute, Link } from "@tanstack/react-router";
import logo from "@/assets/altiora-logo.svg.asset.json";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Sobre a ALTiora" },
      {
        name: "description",
        content:
          "A ALTiora é uma plataforma de educação digital para criar, distribuir e comercializar cursos online com certificação.",
      },
      { property: "og:title", content: "Sobre a ALTiora" },
      {
        property: "og:description",
        content: "Plataforma de educação digital com trilhas, avaliações e certificação.",
      },
    ],
  }),
  component: Sobre,
});

const pilares = [
  {
    titulo: "Cursos completos",
    texto:
      "Estrutura em curso, módulos, aulas e materiais, com videoaulas hospedadas em serviço de streaming e apostilas em PDF.",
  },
  {
    titulo: "Avaliações com regra",
    texto:
      "Provas de múltipla escolha e verdadeiro ou falso, com nota mínima, tempo limite e tentativas configuráveis.",
  },
  {
    titulo: "Certificação automática",
    texto:
      "Certificado emitido ao cumprir progresso e aprovação, com código público e QR Code de verificação.",
  },
  {
    titulo: "Gestão e relatórios",
    texto:
      "Perfis de aluno, instrutor, gestor e administrador, com acompanhamento de matrículas, desempenho e pagamentos.",
  },
];

function Sobre() {
  return (
    <div className="container-page py-14">
      <img src={logo.url} alt="ALTiora — Desenvolvimento Profissional" width={652} height={217} className="mb-6 h-auto w-72 max-w-full object-contain" />
      <h1 className="text-3xl">Sobre a ALTiora</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        A ALTiora é uma plataforma de educação digital criada para reunir, em um único ambiente, a
        criação, a distribuição e a comercialização de cursos online. O objetivo é simples: permitir
        que instituições e especialistas entreguem formação séria, com acompanhamento de progresso e
        certificação que pode ser comprovada por qualquer pessoa.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {pilares.map((p) => (
          <div key={p.titulo} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <div className="h-1 w-10 rounded-full bg-gold" />
            <h2 className="mt-4 text-lg">{p.titulo}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{p.texto}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link to="/cursos" className="btn-base btn-primary">
          Ver cursos
        </Link>
        <Link to="/certificados" className="btn-base btn-outline">
          Validar certificado
        </Link>
      </div>
    </div>
  );
}
