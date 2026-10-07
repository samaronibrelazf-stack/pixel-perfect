import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async ({ context }) => {
    const { data } = await supabase.rpc("has_role", { _user_id: context.user.id, _role: "admin" });
    if (!data) throw redirect({ to: "/perfil" });
  },
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Painel administrativo — ALTiora" },
      { name: "description", content: "Gestão de cursos, módulos e aulas da ALTiora." },
      { property: "og:title", content: "Painel administrativo — ALTiora" },
      { property: "og:description", content: "Gestão de cursos da ALTiora." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <div className="container-page py-10">
      <div className="mb-8 flex flex-wrap items-center gap-4 border-b border-border pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Painel administrativo
        </p>
        <Link
          to="/admin"
          activeOptions={{ exact: true }}
          className="text-sm font-medium text-muted-foreground"
          activeProps={{ className: "text-foreground" }}
        >
          Cursos
        </Link>
      </div>
      <Outlet />
    </div>
  );
}
