import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Lock, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export default function RecoverAccess() {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRecoverAccess = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar formato do PIN
    if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      toast.error("PIN deve conter exatamente 6 números");
      return;
    }

    try {
      setLoading(true);

      // Chamar função do banco para validar PIN
      const { data, error } = await supabase.rpc("login_with_pin", {
        pin_input: pin,
      });

      if (error) {
        console.error("Erro ao validar PIN:", error);
        toast.error("Erro ao validar PIN. Tente novamente.");
        return;
      }

      // Verificar se encontrou perfil
      if (!data || data.length === 0 || !data[0].success) {
        toast.error("PIN inválido. Verifique e tente novamente.");
        setPin("");
        return;
      }

      const profileData = data[0];

      // Salvar no localStorage
      localStorage.setItem("profile_id", profileData.profile_id);
      localStorage.setItem("userProfile", profileData.user_type);
      localStorage.setItem("display_name", profileData.display_name || "Anônima");

      toast.success("Acesso recuperado com sucesso!");

      // Redirecionar para o app
      setTimeout(() => {
        navigate("/app");
      }, 500);
    } catch (err) {
      console.error("Erro inesperado:", err);
      toast.error("Erro ao recuperar acesso");
    } finally {
      setLoading(false);
    }
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Permitir apenas números e máximo 6 dígitos
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setPin(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <KeyRound className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Recuperar Acesso</h1>
          <p className="text-sm text-muted-foreground">
            Digite seu PIN de 6 dígitos para continuar
          </p>
        </div>

        {/* Card Principal */}
        <Card className="p-6 shadow-soft">
          <form onSubmit={handleRecoverAccess} className="space-y-6">
            {/* Campo PIN */}
            <div className="space-y-2">
              <Label htmlFor="pin" className="text-sm font-medium">
                PIN de Acesso
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="pin"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="000000"
                  value={pin}
                  onChange={handlePinChange}
                  className="pl-10 text-center text-2xl tracking-widest font-mono"
                  maxLength={6}
                  autoFocus
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Digite os 6 números que você recebeu ao criar sua conta
              </p>
            </div>

            {/* Botões */}
            <div className="space-y-3">
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading || pin.length !== 6}
              >
                {loading ? "Validando..." : "Recuperar Acesso"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                size="lg"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </div>
          </form>
        </Card>

        {/* Informações de Ajuda */}
        <Card className="p-4 bg-muted/50 border-muted">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              Sobre o PIN
            </h3>
            <ul className="text-xs text-muted-foreground space-y-1 ml-6">
              <li>• O PIN foi gerado quando você criou sua conta</li>
              <li>• É um código de 6 números único e discreto</li>
              <li>• Permite recuperar seu histórico em qualquer dispositivo</li>
              <li>• Mantenha-o em local seguro</li>
            </ul>
          </div>
        </Card>

        {/* Aviso de Esquecimento */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Esqueceu seu PIN?{" "}
            <span className="text-destructive font-medium">
              Infelizmente não é possível recuperá-lo por segurança.
            </span>
            <br />
            Você precisará criar uma nova conta.
          </p>
        </div>
      </div>
    </div>
  );
}
