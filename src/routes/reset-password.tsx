import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Nova senha — ALTiora" },
      { name: "description", content: "Defina uma nova senha para sua conta ALTiora." },
      { property: "og:title", content: "Nova senha — ALTiora" },
      { property: "og:description", content: "Defina uma nova senha para sua conta." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: RedefinirSenha,
});

function RedefinirSenha() {
  const [senha, setSenha] = useState("");
  const [confirma, setConfirma] = useState("");
  const navigate = useNavigate();

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    if (senha.length < 8) return toast.error("A senha precisa ter pelo menos 8 caracteres.");
    if (senha !== confirma) return toast.error("As senhas não conferem.");
    const { error } = await supabase.auth.updateUser({ password: senha });
    if (error) return toast.error("Link expirado ou inválido. Solicite um novo.");
    toast.success("Senha atualizada!");
    navigate({ to: "/perfil" });
    return undefined;
  };

  const campo =
    "mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring";
  return (
    <div className="container-page flex justify-center py-14">
      <form onSubmit={enviar} className="w-full max-w-md space-y-4 rounded-xl border border-border bg-card p-7 shadow-card">
        <h1 className="text-2xl">Criar nova senha</h1>
        <label className="block text-sm font-medium">
          Nova senha
          <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} className={campo} />
        </label>
        <label className="block text-sm font-medium">
          Confirmar senha
          <input type="password" value={confirma} onChange={(e) => setConfirma(e.target.value)} className={campo} />
        </label>
        <button className="btn-base btn-primary w-full">Salvar senha</button>
      </form>
    </div>
  );
}
