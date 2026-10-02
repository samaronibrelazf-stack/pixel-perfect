import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthState = { user: User | null; isAdmin: boolean; carregando: boolean };

const AuthContext = createContext<AuthState>({ user: null, isAdmin: false, carregando: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<AuthState>({ user: null, isAdmin: false, carregando: true });

  useEffect(() => {
    let ativo = true;
    const atualizar = async (user: User | null) => {
      let isAdmin = false;
      if (user) {
        const { data } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
        isAdmin = !!data;
      }
      if (ativo) setEstado({ user, isAdmin, carregando: false });
    };
    const { data: sub } = supabase.auth.onAuthStateChange((_evento, session) => {
      // adiado para não chamar o banco dentro do callback de autenticação
      setTimeout(() => atualizar(session?.user ?? null), 0);
    });
    supabase.auth.getSession().then(({ data }) => atualizar(data.session?.user ?? null));
    return () => {
      ativo = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return <AuthContext.Provider value={estado}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
