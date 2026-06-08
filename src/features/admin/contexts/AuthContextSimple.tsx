import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/features/admin/lib/supabase';
import type { Database } from '@/features/admin/types/database';

type Usuario = Database['public']['Tables']['usuarios']['Row'];

interface AuthContextType {
  user: User | null;
  userData: Usuario | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let hasFetchedUserData = false;

    // Função idempotente pra buscar dados do usuário em `usuarios`
    // Usa flag pra não disparar query duplicada quando getSession() e
    // onAuthStateChange(INITIAL_SESSION) rodarem em sequência.
    const fetchUserData = async (userId: string) => {
      if (hasFetchedUserData) return;
      hasFetchedUserData = true;
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .single();
      if (!isMounted) return;
      if (!error && data) {
        setUserData(data);
      }
      setLoading(false);
    };

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      if (session?.user) {
        setUser(session.user);
        void fetchUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      if (session?.user) {
        setUser(session.user);
        if (event === 'INITIAL_SESSION') {
          // INITIAL_SESSION: dados já estão sendo buscados por getSession()
          // Não disparar query duplicada
          return;
        }
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          // Reseta flag só em eventos que mudam o perfil do usuário
          hasFetchedUserData = false;
          void fetchUserData(session.user.id);
          return;
        }
        // Default: também busca (SIGNED_IN, etc.)
        hasFetchedUserData = false;
        void fetchUserData(session.user.id);
      } else {
        setUser(null);
        setUserData(null);
        hasFetchedUserData = false;
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []); // Sem dependências - executar apenas uma vez

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserData(null);
  };

  const value = {
    user,
    userData,
    loading,
    signOut: handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};