import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-primary text-primary-foreground">
      <div className="container-page flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-xl font-semibold">ALTiora</p>
          <p className="mt-1 text-sm text-primary-foreground/70">
            Educação profissional e certificação.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-primary-foreground/80">
          <Link to="/cursos">Cursos</Link>
          <Link to="/sobre">Sobre</Link>
          <Link to="/certificados">Validar certificado</Link>
        </nav>
      </div>
      <div className="container-page border-t border-primary-foreground/15 py-5 text-xs text-primary-foreground/60">
        © {new Date().getFullYear()} ALTiora. Todos os direitos reservados.
      </div>
    </footer>
  );
}
