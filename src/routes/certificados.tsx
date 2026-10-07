import { createFileRoute } from "@tanstack/react-router";
import { ValidadorCertificado } from "@/components/ValidadorCertificado";

export const Route = createFileRoute("/certificados")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Validação de certificados — ALTiora" },
      {
        name: "description",
        content:
          "Confira a autenticidade de um certificado ALTiora informando o código impresso ou lido pelo QR Code.",
      },
      { property: "og:title", content: "Validação de certificados — ALTiora" },
      {
        property: "og:description",
        content: "Verificação pública de certificados emitidos pela ALTiora.",
      },
    ],
  }),
  component: Certificados,
});

function Certificados() {
  return (
    <div className="container-page py-14">
      <h1 className="text-3xl">Validação de certificados</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Todo certificado emitido pela Altiora recebe um código único e um QR Code. Informe o código
        abaixo para conferir o nome do aluno, o curso, a carga horária e a data de emissão.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-start">
        <ValidadorCertificado />

        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <h2 className="text-lg">Como funciona</h2>
          <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-gold text-xs font-bold text-accent-foreground">
                1
              </span>
              O aluno conclui 100% das aulas obrigatórias do curso.
            </li>
            <li className="flex gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-gold text-xs font-bold text-accent-foreground">
                2
              </span>
              Realiza a avaliação final e atinge a nota mínima exigida.
            </li>
            <li className="flex gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-gold text-xs font-bold text-accent-foreground">
                3
              </span>
              O certificado é emitido automaticamente com código e QR Code.
            </li>
            <li className="flex gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-gold text-xs font-bold text-accent-foreground">
                4
              </span>
              Qualquer pessoa pode validar o documento nesta página.
            </li>
          </ol>
          <p className="mt-5 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
            Para testar, use o código de exemplo ALT-2026-88412.
          </p>
        </div>
      </div>
    </div>
  );
}
