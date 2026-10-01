import { useState } from "react";
import { certificados } from "@/data/cursos";

export function ValidadorCertificado() {
  const [codigo, setCodigo] = useState("");
  const [resultado, setResultado] = useState<"inicial" | "valido" | "invalido">("inicial");
  const [encontrado, setEncontrado] = useState<(typeof certificados)[number] | null>(null);

  function validar(e: React.FormEvent) {
    e.preventDefault();
    const achado = certificados.find(
      (c) => c.codigo.toLowerCase() === codigo.trim().toLowerCase(),
    );
    setEncontrado(achado ?? null);
    setResultado(achado ? "valido" : "invalido");
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-card">
      <h3 className="text-lg">Validação de certificado</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Digite o código impresso no certificado ou lido pelo QR Code para conferir a autenticidade.
      </p>

      <form onSubmit={validar} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          placeholder="ALT-2026-88412"
          aria-label="Código do certificado"
          className="h-11 flex-1 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring"
        />
        <button type="submit" className="btn-base btn-primary">
          Verificar
        </button>
      </form>

      {resultado === "valido" && encontrado && (
        <div className="mt-4 rounded-lg border border-border bg-success-soft p-4">
          <p className="text-sm font-semibold text-success">Certificado válido</p>
          <dl className="mt-3 space-y-1 text-sm text-foreground">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Aluno</dt>
              <dd className="text-right font-medium">{encontrado.aluno}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Curso</dt>
              <dd className="text-right font-medium">{encontrado.curso}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Carga horária</dt>
              <dd className="text-right font-medium">{encontrado.cargaHoraria}h</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Nota final</dt>
              <dd className="text-right font-medium">{encontrado.nota}%</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Emitido em</dt>
              <dd className="text-right font-medium">{encontrado.emitidoEm}</dd>
            </div>
          </dl>
        </div>
      )}

      {resultado === "invalido" && (
        <p className="mt-4 rounded-lg border border-border bg-muted p-4 text-sm text-muted-foreground">
          Nenhum certificado encontrado para esse código. Confira os dados e tente novamente.
        </p>
      )}
    </div>
  );
}
