import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Heart } from "lucide-react";

const ProfileSelect = () => {
  const navigate = useNavigate();

  const handleProfileSelect = (profile: "user" | "supporter") => {
    if (profile === "supporter") {
      // Apoiadora: vai para tela de LOGIN
      navigate("/supporter-login");
    } else {
      // Vítima: vai direto para registro (anônimo/simples)
      localStorage.setItem("selectedProfile", profile);
      navigate("/register");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Bem-vinda ao Apoia
          </h1>
          <p className="text-muted-foreground text-lg">
            Selecione seu perfil para continuar
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-8 hover:shadow-elevated transition-all duration-300 cursor-pointer group"
                onClick={() => handleProfileSelect("user")}>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">
                Preciso de Apoio
              </h2>
              <p className="text-muted-foreground mb-6">
                Acesse recursos de emergência, apoio e proteção em um ambiente seguro e discreto
              </p>
              <Button variant="hero" size="lg" className="w-full">
                Acessar
              </Button>
            </div>
          </Card>

          <Card className="p-8 hover:shadow-elevated transition-all duration-300 cursor-pointer group"
                onClick={() => handleProfileSelect("supporter")}>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Heart className="w-10 h-10 text-accent" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">
                Sou Apoiadora
              </h2>
              <p className="text-muted-foreground mb-6">
                Conecte-se com mulheres que precisam de ajuda e ofereça suporte em tempo real
              </p>
              <Button variant="secondary" size="lg" className="w-full">
                Acessar
              </Button>
            </div>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Button
            variant="ghost"
            onClick={() => {
              localStorage.removeItem("userProfile");
              navigate("/");
            }}
          >
            Voltar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSelect;
