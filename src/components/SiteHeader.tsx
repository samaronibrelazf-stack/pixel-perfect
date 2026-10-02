import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const links = [
  { to: "/", label: "Início" },
  { to: "/cursos", label: "Cursos" },
  { to: "/sobre", label: "Sobre" },
  { to: "/certificados", label: "Certificados" },
] as const;

export function SiteHeader() {
  const [aberto, setAberto] = useState(false);
  const { user, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setAberto(false)}>
          <span className="grid size-9 place-items-center rounded-lg bg-primary font-display text-lg font-semibold text-primary-foreground">
            A
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">ALTiora</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              {isAdmin && <Link to="/admin" className="btn-base btn-outline">Painel</Link>}
              <Link to="/perfil" className="btn-base btn-outline">Meu perfil</Link>
              <button className="btn-base btn-primary" onClick={async () => { await supabase.auth.signOut(); window.location.replace("/auth"); }}>Sair</button>
            </>
          ) : (
            <Link to="/auth" className="btn-base btn-primary">Entrar / Criar conta</Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          aria-label="Abrir menu"
          className="btn-base btn-outline px-3 md:hidden"
        >
          Menu
        </button>
      </div>

      {aberto && (
        <nav className="border-t border-border bg-card md:hidden">
          <div className="container-page flex flex-col py-2">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setAberto(false)}
                className="py-3 text-sm font-medium text-muted-foreground"
                activeProps={{ className: "text-foreground" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
            <Link to={user ? "/perfil" : "/auth"} onClick={() => setAberto(false)} className="btn-base btn-primary my-3">
              {user ? "Meu perfil" : "Entrar / Criar conta"}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
