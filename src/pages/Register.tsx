import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Heart, Shield, Copy, KeyRound } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Register = () => {
  const navigate = useNavigate();
  const { createProfile, loading } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [userType, setUserType] = useState<"user" | "supporter" | null>(null);
  const [analyzingIA, setAnalyzingIA] = useState(false);
  const [userPin, setUserPin] = useState<string | null>(null);
  const [showPinDialog, setShowPinDialog] = useState(false);
  
  // Campos específicos para apoiadoras
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [motivation, setMotivation] = useState("");
  const [causesText, setCausesText] = useState(""); // Texto livre em vez de array

  useEffect(() => {
    // Verificar se veio da seleção de perfil
    const selectedProfile = localStorage.getItem("selectedProfile") as "user" | "supporter" | null;
    if (!selectedProfile) {
      navigate("/profile-select");
    } else {
      setUserType(selectedProfile);
    }
  }, [navigate]);

  const handleContinue = async () => {
    if (!userType) return;

    // Validação para apoiadoras
    if (userType === 'supporter') {
      if (!email || !password || !phone || !motivation || !causesText) {
        toast.error("Por favor, preencha todos os campos obrigatórios");
        return;
      }
      
      if (password.length < 6) {
        toast.error("A senha deve ter pelo menos 6 caracteres");
        return;
      }

      // Análise com IA via Netlify Function (evita CORS/ITP no iOS)
      setAnalyzingIA(true);
      toast.info("🤖 Analisando seu cadastro...", { duration: 2000 });

      let analysis;
      try {
        // Chamar função serverless do Netlify (timeout de 15s)
        const response = await Promise.race([
          fetch('/.netlify/functions/ai-approval', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              displayName: displayName.trim(),
              email: email.trim(),
              phone: phone.trim(),
              motivation: motivation.trim(),
              causes: causesText.trim()
            })
          }),
          new Promise<Response>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 15000)
          )
        ]);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        analysis = await response.json();
      } catch (err: any) {
        console.warn('⏱️ Timeout ou erro na análise IA, usando REVIEW como fallback', err);
        analysis = {
          decision: 'REVIEW',
          reason: 'Análise demorou muito - revisão manual'
        };
      } finally {
        setAnalyzingIA(false);
      }
      console.log('📊 Análise IA:', analysis);

      // 1. Criar conta no Supabase Auth (timeout de 15s para iOS)
      const { supabase } = await import('@/lib/supabase');
      
      console.log('📝 Criando conta para:', email.trim());
      
      let authData, authError;
      try {
        // Timeout defensivo: 15 segundos para signUp
        const result = await Promise.race([
          supabase.auth.signUp({
            email: email.trim(),
            password: password.trim(),
            options: {
              emailRedirectTo: undefined,
              data: {
                display_name: displayName.trim(),
              }
            }
          }),
          new Promise<any>((_, reject) => 
            setTimeout(() => reject(new Error('AuthTimeout')), 15000)
          )
        ]);
        authData = result.data;
        authError = result.error;
      } catch (err: any) {
        if (err.message === 'AuthTimeout') {
          console.error('⏱️ Timeout ao criar conta no Supabase');
          toast.error('Conexão lenta. Tente novamente em alguns instantes.');
          return;
        }
        authError = err;
      }

      if (authError) {
        console.error('❌ Erro ao criar conta:', authError);
        if (authError.message.includes('already registered')) {
          toast.error("Este email já está cadastrado. Faça login!");
        } else {
          toast.error(`Erro ao criar conta: ${authError.message}`);
        }
        return;
      }
      
      if (!authData.user) {
        console.error('❌ Usuário não criado');
        toast.error("Erro ao criar conta. Tente novamente.");
        return;
      }
      
      console.log('✅ Conta criada com sucesso! User ID:', authData.user.id);

      // 2. Criar perfil com status baseado na análise
      const profile = await createProfile({
        userType,
        displayName: displayName.trim() || undefined,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        motivation: motivation.trim() || undefined,
        causes: causesText.trim() ? [causesText.trim()] : undefined,
        authUserId: authData.user.id  // Vincular com Supabase Auth
      });

      if (profile) {
        localStorage.removeItem("selectedProfile");

        if (analysis.decision === 'APPROVE') {
          // Aprovar automaticamente no banco
          await updateProfileStatus(profile.id, 'approved');
          toast.success("✅ Cadastro aprovado! Você já pode fazer login. 💜");
          navigate("/");
        } else if (analysis.decision === 'REVIEW') {
          toast.info("⏳ Cadastro em análise. Retorno em até 24h.");
          navigate("/");
        } else {
          toast.error("❌ Cadastro rejeitado. Entre em contato se achar que houve erro.");
          navigate("/");
        }
      } else {
        toast.error("Erro ao criar perfil. Tente novamente.");
      }
    } else {
      // User (vítima) - fluxo normal sem IA
      const profile = await createProfile({
        userType,
        displayName: displayName.trim() || undefined
      });

      if (profile) {
        // Buscar PIN gerado automaticamente
        const pin = await fetchUserPin(profile.id);
        
        if (pin) {
          setUserPin(pin);
          setShowPinDialog(true);
        } else {
          toast.success(displayName ? `Bem-vinda, ${displayName}! 💜` : "Bem-vinda! 💜");
          localStorage.removeItem("selectedProfile");
          navigate("/app");
        }
      } else {
        toast.error("Erro ao criar perfil. Tente novamente.");
      }
    }
  };

  // Função auxiliar para atualizar status no banco
  const updateProfileStatus = async (profileId: string, status: string) => {
    try {
      const { supabase } = await import('@/lib/supabase');
      await supabase
        .from('profiles')
        .update({ status })
        .eq('id', profileId);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  // Função para buscar PIN do perfil criado
  const fetchUserPin = async (profileId: string) => {
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data, error } = await supabase.rpc('get_pin_by_profile', {
        p_profile_id: profileId
      });

      if (error) {
        console.error('Erro ao buscar PIN:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erro ao buscar PIN:', error);
      return null;
    }
  };

  const handleSkip = async () => {
    // Apenas users podem pular (apoiadoras precisam preencher)
    if (!userType || userType !== 'user') return;

    const profile = await createProfile({ userType });

    if (profile) {
      // Buscar PIN gerado automaticamente
      const pin = await fetchUserPin(profile.id);
      
      if (pin) {
        setUserPin(pin);
        setShowPinDialog(true);
      } else {
        toast.success("Bem-vinda! 💜");
        localStorage.removeItem("selectedProfile");
        navigate("/app");
      }
    } else {
      toast.error("Erro ao criar perfil. Tente novamente.");
    }
  };

  if (!userType) {
    return null;
  }

  const Icon = userType === "user" ? Shield : Heart;
  const title = userType === "user" ? "Preciso de Apoio" : "Sou Apoiadora";

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 space-y-6 animate-fade-in">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">💜 Quase lá!</h1>
            <p className="text-sm text-muted-foreground">
              Você escolheu: <span className="font-semibold text-primary">{title}</span>
            </p>
          </div>
        </div>

        {/* FORMULÁRIO PARA USUÁRIA (SIMPLES E ANÔNIMO) */}
        {userType === "user" && (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="displayName" className="text-sm font-medium text-foreground">
                  Como quer ser chamada? (opcional)
                </label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Maria, Ana, ou deixe em branco"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="text-base"
                  maxLength={50}
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  Exemplos: Maria, Anônima, ou deixe em branco
                </p>
              </div>

              <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                <p className="text-xs text-muted-foreground text-center">
                  ℹ️ Não pedimos dados pessoais. Totalmente seguro e discreto.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleContinue}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? "Criando perfil..." : "Continuar →"}
              </Button>

              <button
                onClick={handleSkip}
                disabled={loading}
                className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Pular e continuar anônima
              </button>
            </div>
          </>
        )}

        {/* FORMULÁRIO PARA APOIADORA (COMPLETO COM VALIDAÇÃO) */}
        {userType === "supporter" && (
          <>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="space-y-2">
                <label htmlFor="displayName" className="text-sm font-medium text-foreground">
                  Nome Completo <span className="text-destructive">*</span>
                </label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Seu nome completo"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  E-mail <span className="text-destructive">*</span>
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
                  Senha <span className="text-destructive">*</span>
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Use esta senha para fazer login depois
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-foreground">
                  Telefone <span className="text-destructive">*</span>
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="motivation" className="text-sm font-medium text-foreground">
                  Por que quer ser apoiadora? <span className="text-destructive">*</span>
                </label>
                <Textarea
                  id="motivation"
                  placeholder="Conte-nos sua motivação para ajudar..."
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  disabled={loading}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="causes" className="text-sm font-medium text-foreground">
                  Causas que defende <span className="text-destructive">*</span>
                </label>
                <Textarea
                  id="causes"
                  placeholder="Ex: Combate à violência doméstica, direitos da mulher, saúde mental feminina, apoio psicológico, empoderamento..."
                  value={causesText}
                  onChange={(e) => setCausesText(e.target.value)}
                  disabled={loading}
                  rows={3}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Descreva as causas que você apoia e defende
                </p>
              </div>

              <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                <p className="text-xs text-muted-foreground text-center">
                  🤖 Seu cadastro será analisado automaticamente por IA. Perfis qualificados são aprovados na hora!
                </p>
              </div>
            </div>

            <Button
              onClick={handleContinue}
              disabled={loading || analyzingIA}
              className="w-full"
              size="lg"
            >
              {analyzingIA ? "🤖 Analisando..." : loading ? "Enviando..." : "Enviar Cadastro"}
            </Button>
          </>
        )}
      </Card>

      {/* Dialog de Exibição do PIN */}
      <Dialog open={showPinDialog} onOpenChange={(open) => {
        if (!open) {
          // Só permite fechar depois de confirmar
          if (userPin && window.confirm("Você anotou seu PIN? Não será possível recuperá-lo depois!")) {
            setShowPinDialog(false);
            toast.success("Bem-vinda! 💜");
            localStorage.removeItem("selectedProfile");
            navigate("/app");
          }
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <KeyRound className="w-8 h-8 text-primary" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">
              Seu PIN de Acesso 🔑
            </DialogTitle>
            <DialogDescription className="text-center">
              Anote este código em um local seguro. Você precisará dele para recuperar seu histórico.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* PIN Display */}
            <div className="bg-muted rounded-lg p-6 text-center">
              <p className="text-xs text-muted-foreground mb-2">SEU PIN É:</p>
              <div className="text-5xl font-mono font-bold tracking-widest text-primary">
                {userPin}
              </div>
            </div>

            {/* Botão Copiar */}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                if (userPin) {
                  navigator.clipboard.writeText(userPin);
                  toast.success("PIN copiado! 📋");
                }
              }}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copiar PIN
            </Button>

            {/* Avisos Importantes */}
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-400 mb-2">
                ⚠️ Importante:
              </p>
              <ul className="text-xs text-yellow-600 dark:text-yellow-300 space-y-1">
                <li>• Anote este PIN em um local seguro</li>
                <li>• Use ele para recuperar seu acesso</li>
                <li>• Não compartilhe com ninguém</li>
                <li>• Se perder, não poderá ser recuperado</li>
              </ul>
            </div>

            {/* Botão Continuar */}
            <Button
              className="w-full"
              size="lg"
              onClick={() => {
                setShowPinDialog(false);
                toast.success("Bem-vinda! 💜");
                localStorage.removeItem("selectedProfile");
                navigate("/app");
              }}
            >
              Anotei meu PIN, Continuar →
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Register;
