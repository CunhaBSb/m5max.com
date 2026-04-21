import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shared/ui/card";
import { useToast } from "@/features/admin/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/features/admin/lib/supabase";
import { useAuth } from "@/features/admin/contexts/AuthContextSimple";
import { motion } from "framer-motion";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, userData, loading } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }
    
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(false);
    navigate("/admin/produtos");
  }, [user, userData, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ AdminLogin: Erro no login:', error.message);
        toast({
          title: "Erro no login",
          description: "Credenciais inválidas ou erro de conexão.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (!data.user) {
        setIsLoading(false);
      }
    } catch (error) {
      console.error('❌ AdminLogin: Erro inesperado:', error);
      toast({
        title: "Erro inesperado",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4 selection:bg-primary/20 sm:p-6">
      {/* Background sutil e corporativo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-10 hidden text-center sm:block">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative inline-block mb-6"
          >
            <img src="/Logo.svg" alt="M5 MAX Logo" className="relative h-20 w-20 mx-auto" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">M5 MAX <span className="font-normal text-muted-foreground">PRODUÇÕES</span></h1>
            <p className="text-muted-foreground font-medium text-xs tracking-widest uppercase">Painel Administrativo</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="overflow-hidden rounded-[28px] border-border/50 bg-card shadow-xl sm:rounded-[32px]">
            <div className="h-1 w-full bg-primary"></div>
            <CardHeader className="space-y-1 px-5 pt-6 sm:px-6 sm:pt-8">
              <CardTitle className="text-xl font-bold text-center text-foreground">Acesso Restrito</CardTitle>
              <CardDescription className="text-center text-sm font-medium">
                Insira suas credenciais corporativas
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5 pb-6 sm:px-8 sm:pb-8">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-semibold text-foreground">E-mail Corporativo</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nome@m5max.com.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background border-input h-11 px-3 rounded-lg focus-visible:ring-1 focus-visible:ring-primary transition-all"
                    required
                  />
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-xs font-semibold text-foreground">Senha</Label>
                    <a href="mailto:suporte@m5max.com.br?subject=Recuperação de Senha - Painel" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                      Esqueceu a senha?
                    </a>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Sua senha de acesso"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-background border-input h-11 px-3 rounded-lg focus-visible:ring-1 focus-visible:ring-primary transition-all pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all duration-200 mt-2" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                      <span>Autenticando...</span>
                    </div>
                  ) : "Entrar"}
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-border/50 text-center">
                <p className="text-xs text-muted-foreground">
                  Problemas com seu acesso? <a href="mailto:suporte@m5max.com.br" className="text-foreground hover:text-primary font-medium transition-colors">Contate o Suporte TI</a>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <div className="mt-6 space-y-1 text-center text-xs font-medium text-muted-foreground/60 sm:mt-8">
          <p>&copy; {new Date().getFullYear()} M5 Max Produções. Todos os direitos reservados.</p>
          <p className="text-[10px] uppercase tracking-wider opacity-70">Acesso Restrito e Monitorado</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
