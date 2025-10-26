import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Heart, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const SupporterLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Preencha email e senha");
      return;
    }

    setLoading(true);

    try {
      console.log('🔐 Tentando login com:', email.trim());
      
      // 1. Tentar fazer login no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (authError) {
        console.error('❌ Erro no login:', authError);
        toast.error(`Email ou senha incorretos: ${authError.message}`);
        setLoading(false);
        return;
      }
      
      console.log('✅ Login Auth OK, user:', authData.user?.email);

      // 2. Buscar perfil da apoiadora
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_user_id', authData.user.id)
        .eq('user_type', 'supporter')
        .single();

      if (profileError || !profile) {
        console.error('Erro ao buscar perfil:', profileError);
        toast.error("Perfil não encontrado");
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      // 3. Verificar status de aprovação
      if (profile.status === 'pending') {
        toast.info("⏳ Seu cadastro ainda está em análise. Aguarde aprovação.");
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      if (profile.status === 'rejected') {
        toast.error("❌ Cadastro rejeitado. Entre em contato para mais informações.");
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      // 4. Login bem-sucedido!
      localStorage.setItem('profile_id', profile.id);
      localStorage.setItem('userProfile', 'supporter');
      localStorage.setItem('display_name', profile.display_name || 'Apoiadora');

      toast.success(`Bem-vinda de volta, ${profile.display_name}! 💜`);
      navigate("/app");

    } catch (error) {
      console.error('Erro:', error);
      toast.error("Erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    localStorage.setItem("selectedProfile", "supporter");
    navigate("/register");
  };

  const handleBack = () => {
    navigate("/profile-select");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 space-y-6 animate-fade-in">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="flex flex-col items-center space-y-3">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Login de Apoiadora</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Entre com seu email e senha
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Senha
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              disabled={loading}
              required
            />
          </div>

          <Button
            onClick={handleLogin}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Não tem conta?
              </span>
            </div>
          </div>

          <Button
            onClick={handleRegister}
            disabled={loading}
            variant="outline"
            className="w-full"
            size="lg"
          >
            Deseja se tornar apoiadora? Faça seu cadastro!
          </Button>
        </div>

        <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
          <p className="text-xs text-muted-foreground text-center">
            💜 Obrigada por fazer parte da nossa rede de apoio!
          </p>
        </div>
      </Card>
    </div>
  );
};

export default SupporterLogin;
