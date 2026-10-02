import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";

export function InscreverBotao({ gratuito }: { gratuito: boolean }) {
  const { user, carregando } = useAuth();
  const rotulo = gratuito ? "Inscrever-se" : "Comprar curso";

  if (!carregando && !user) {
    return (
      <Link to="/auth" className="btn-base btn-primary mt-5 w-full">
        Entre para {gratuito ? "se inscrever" : "comprar"}
      </Link>
    );
  }
  return (
    <>
      <button type="button" disabled className="btn-base btn-primary mt-5 w-full opacity-60">
        {rotulo}
      </button>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Matrículas serão liberadas em breve.
      </p>
    </>
  );
}
