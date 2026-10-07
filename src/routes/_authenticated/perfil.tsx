import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { apenasDigitos, cpfValido, formatarCpf, formatarTelefone } from "@/lib/validacao";

export const Route = createFileRoute("/_authenticated/perfil")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Meu perfil — ALTiora" },
      { name: "description", content: "Seus dados de cadastro na ALTiora." },
      { property: "og:title", content: "Meu perfil — ALTiora" },
      { property: "og:description", content: "Seus dados de cadastro na ALTiora." },
    ],
  }),
  component: Perfil,
});

const campo =
  "mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring";

function Perfil() {
  const { user } = Route.useRouteContext();
  const { isAdmin } = useAuth();
  const [f, setF] = useState({ nome: "", cpf: "", telefone: "" });
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("nome, cpf, telefone")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data)
          setF({
            nome: data.nome ?? "",
            cpf: formatarCpf(data.cpf ?? ""),
            telefone: formatarTelefone(data.telefone ?? ""),
          });
      });
  }, [user.id]);

  const salvar = async (e: FormEvent) => {
    e.preventDefault();
    if (f.nome.trim().length < 3) return toast.error("Informe seu nome completo.");
    if (f.cpf && !cpfValido(f.cpf)) return toast.error("CPF inválido.");
    setSalvando(true);
    const { error } = await supabase
      .from("profiles")
      .update({ nome: f.nome.trim(), cpf: apenasDigitos(f.cpf) || null, telefone: apenasDigitos(f.telefone) || null })
      .eq("id", user.id);
    setSalvando(false);
    if (error) toast.error("Não foi possível salvar.");
    else toast.success("Dados atualizados.");
    return undefined;
  };

  return (
    <div className="container-page max-w-2xl py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl">Meu perfil</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {user.email} · {isAdmin ? "Administrador" : "Aluno"}
          </p>
        </div>
        {isAdmin && (
          <Link to="/admin" className="btn-base btn-gold">
            Painel administrativo
          </Link>
        )}
      </div>

      <form onSubmit={salvar} className="mt-8 space-y-4 rounded-xl border border-border bg-card p-6 shadow-card">
        <label className="block text-sm font-medium">
          Nome completo
          <input value={f.nome} onChange={(e) => setF({ ...f, nome: e.target.value })} className={campo} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            CPF
            <input value={f.cpf} onChange={(e) => setF({ ...f, cpf: formatarCpf(e.target.value) })} className={campo} />
          </label>
          <label className="block text-sm font-medium">
            Telefone
            <input
              value={f.telefone}
              onChange={(e) => setF({ ...f, telefone: formatarTelefone(e.target.value) })}
              className={campo}
            />
          </label>
        </div>
        <button disabled={salvando} className="btn-base btn-primary">
          {salvando ? "Salvando..." : "Salvar alterações"}
        </button>
      </form>
    </div>
  );
}
