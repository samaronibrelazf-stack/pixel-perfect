import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/useAuth";
import { apenasDigitos, cadastroSchema, formatarCpf, formatarTelefone } from "@/lib/validacao";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar ou criar conta — ALTiora" },
      { name: "description", content: "Acesse sua conta ALTiora ou cadastre-se para estudar." },
      { property: "og:title", content: "Entrar ou criar conta — ALTiora" },
      { property: "og:description", content: "Acesse sua conta ALTiora ou cadastre-se." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PaginaAuth,
});

type Modo = "entrar" | "cadastrar" | "esqueci";
const campo =
  "mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring";

function PaginaAuth() {
  const [modo, setModo] = useState<Modo>("entrar");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate({ to: "/perfil", replace: true });
  }, [user, navigate]);

  return (
    <div className="container-page flex justify-center py-14">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-7 shadow-card">
        <h1 className="text-2xl">
          {modo === "entrar" ? "Entrar" : modo === "cadastrar" ? "Criar conta" : "Recuperar senha"}
        </h1>
        {modo === "entrar" && <FormEntrar />}
        {modo === "cadastrar" && <FormCadastro />}
        {modo === "esqueci" && <FormEsqueci />}

        {modo !== "esqueci" && (
          <>
            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> ou <span className="h-px flex-1 bg-border" />
            </div>
            <button
              type="button"
              className="btn-base btn-outline w-full"
              onClick={async () => {
                const r = await lovable.auth.signInWithOAuth("google", {
                  redirect_uri: window.location.origin,
                });
                if (r.error) toast.error("Não foi possível entrar com o Google.");
              }}
            >
              Continuar com Google
            </button>
          </>
        )}

        <div className="mt-6 space-y-1 text-center text-sm text-muted-foreground">
          {modo === "entrar" && (
            <>
              <p>
                Não tem conta?{" "}
                <button className="font-medium text-foreground underline" onClick={() => setModo("cadastrar")}>
                  Cadastre-se
                </button>
              </p>
              <p>
                <button className="underline" onClick={() => setModo("esqueci")}>
                  Esqueci minha senha
                </button>
              </p>
            </>
          )}
          {modo !== "entrar" && (
            <p>
              Já tem conta?{" "}
              <button className="font-medium text-foreground underline" onClick={() => setModo("entrar")}>
                Entrar
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function FormEntrar() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [enviando, setEnviando] = useState(false);

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: senha });
    setEnviando(false);
    if (error) {
      toast.error(
        error.message.includes("not confirmed")
          ? "Confirme seu e-mail antes de entrar."
          : "E-mail ou senha incorretos.",
      );
    }
  };

  return (
    <form onSubmit={enviar} className="mt-5 space-y-4">
      <label className="block text-sm font-medium">
        E-mail
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={campo} />
      </label>
      <label className="block text-sm font-medium">
        Senha
        <input type="password" required value={senha} onChange={(e) => setSenha(e.target.value)} className={campo} />
      </label>
      <button disabled={enviando} className="btn-base btn-primary w-full">
        {enviando ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}

function FormCadastro() {
  const [f, setF] = useState({ nome: "", email: "", cpf: "", telefone: "", senha: "" });
  const [erros, setErros] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    const r = cadastroSchema.safeParse(f);
    if (!r.success) {
      const map: Record<string, string> = {};
      r.error.issues.forEach((i) => (map[String(i.path[0])] = i.message));
      setErros(map);
      return;
    }
    setErros({});
    setEnviando(true);
    const { data, error } = await supabase.auth.signUp({
      email: r.data.email,
      password: r.data.senha,
      options: {
        emailRedirectTo: window.location.origin,
        data: { nome: r.data.nome, cpf: apenasDigitos(r.data.cpf), telefone: apenasDigitos(r.data.telefone) },
      },
    });
    setEnviando(false);
    if (error) {
      toast.error(
        error.message.toLowerCase().includes("registered")
          ? "Este e-mail já está cadastrado."
          : error.message.toLowerCase().includes("password")
            ? "Escolha uma senha mais forte."
            : "Não foi possível criar a conta. Tente novamente.",
      );
      return;
    }
    if (data.user && data.user.identities?.length === 0) {
      toast.error("Este e-mail já está cadastrado.");
      return;
    }
    setEnviado(true);
  };

  if (enviado) {
    return (
      <p className="mt-5 rounded-lg bg-success-soft p-4 text-sm text-success">
        Conta criada! Enviamos um link de confirmação para <strong>{f.email}</strong>. Abra seu e-mail
        para ativar o acesso.
      </p>
    );
  }

  const input = (nome: keyof typeof f, rotulo: string, props: Record<string, unknown> = {}, fmt?: (v: string) => string) => (
    <label className="block text-sm font-medium">
      {rotulo}
      <input
        value={f[nome]}
        onChange={(e) => setF({ ...f, [nome]: fmt ? fmt(e.target.value) : e.target.value })}
        className={campo}
        {...props}
      />
      {erros[nome] && <span className="mt-1 block text-xs text-destructive">{erros[nome]}</span>}
    </label>
  );

  return (
    <form onSubmit={enviar} className="mt-5 space-y-4" noValidate>
      {input("nome", "Nome completo", { autoComplete: "name" })}
      {input("email", "E-mail", { type: "email", autoComplete: "email" })}
      {input("cpf", "CPF", { inputMode: "numeric", placeholder: "000.000.000-00" }, formatarCpf)}
      {input("telefone", "Telefone", { inputMode: "tel", placeholder: "(00) 00000-0000" }, formatarTelefone)}
      {input("senha", "Senha", { type: "password", autoComplete: "new-password" })}
      <p className="text-xs text-muted-foreground">
        Seus dados são usados apenas para matrícula e emissão de certificados, conforme a LGPD.
      </p>
      <button disabled={enviando} className="btn-base btn-primary w-full">
        {enviando ? "Criando conta..." : "Criar conta"}
      </button>
    </form>
  );
}

function FormEsqueci() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setEnviado(true);
  };

  if (enviado) {
    return (
      <p className="mt-5 text-sm text-muted-foreground">
        Se houver uma conta com esse e-mail, você receberá um link para criar uma nova senha.
      </p>
    );
  }
  return (
    <form onSubmit={enviar} className="mt-5 space-y-4">
      <label className="block text-sm font-medium">
        E-mail da conta
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={campo} />
      </label>
      <button className="btn-base btn-primary w-full">Enviar link</button>
      <Link to="/" className="hidden" />
    </form>
  );
}
