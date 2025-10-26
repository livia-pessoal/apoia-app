import { Phone, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import heroImage from "@/assets/hero-support.jpg";

export const HeroSection = () => {
  const handleCall180 = () => {
    const phoneNumber = "180";
    registerEmergencyCall("180");
    window.location.href = `tel:${phoneNumber}`;
    toast.success("📞 Discando 180", {
      description: "Central de Atendimento à Mulher",
    });
  };

  const handleCall190 = () => {
    const phoneNumber = "190";
    registerEmergencyCall("190");
    window.location.href = `tel:${phoneNumber}`;
    toast.success("🚨 Discando 190", {
      description: "Polícia Militar - Emergência",
    });
  };

  const handleSOSNetwork = async () => {
    try {
      const profileId = localStorage.getItem("profile_id");
      if (!profileId) {
        toast.error("Você precisa estar logada");
        return;
      }

      const { data: contacts, error } = await supabase
        .from("trusted_contacts")
        .select("*")
        .eq("user_id", profileId)
        .eq("can_receive_alerts", true);

      if (error) throw error;

      if (!contacts || contacts.length === 0) {
        toast.error("Você ainda não tem contatos cadastrados", {
          description: "Configure sua rede de apoio primeiro",
        });
        return;
      }

      const alerts = contacts.map((contact) => ({
        user_id: profileId,
        contact_id: contact.id,
        alert_type: "sos",
        message: "ALERTA SOS! Preciso de ajuda urgente!",
      }));

      const { error: alertError } = await supabase
        .from("emergency_alerts")
        .insert(alerts);

      if (alertError) throw alertError;

      toast.success(`💜 SOS enviado para ${contacts.length} contato(s)`, {
        description: "Sua rede de apoio foi alertada",
      });
    } catch (err) {
      console.error("Erro ao enviar SOS:", err);
      toast.error("Erro ao enviar SOS");
    }
  };

  const registerEmergencyCall = async (phoneNumber: string) => {
    try {
      const profileId = localStorage.getItem("profile_id");
      if (!profileId) return;

      await supabase.from("emergency_calls").insert([
        {
          user_id: profileId,
          phone_number: phoneNumber,
        },
      ]);
    } catch (err) {
      console.error("Erro ao registrar chamado:", err);
    }
  };

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-hero">
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="relative z-10 text-center px-6 py-12 max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-700">
          Bem-vinda ao Apoia
        </h1>
        <p className="text-xl md:text-2xl text-foreground/80 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
          Uma rede de apoio gamificada para fortalecer mulheres e combater a violência
        </p>

        {/* Botões de Emergência Rápida */}
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <p className="text-sm text-rose-600 font-medium mb-3 flex items-center justify-center gap-2">
            <span className="inline-block w-1.5 h-1.5 bg-rose-400 rounded-full"></span>
            Acesso Rápido
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button
              onClick={handleCall180}
              size="lg"
              className="bg-purple-200/70 hover:bg-purple-300/80 text-purple-700 backdrop-blur-sm border border-purple-300/50 min-w-[160px] h-12 shadow-sm"
            >
              <Phone className="mr-2 h-4 w-4" />
              Discar 180
            </Button>
            <Button
              onClick={handleCall190}
              size="lg"
              className="bg-rose-200/70 hover:bg-rose-300/80 text-rose-700 backdrop-blur-sm border border-rose-300/50 min-w-[160px] h-12 shadow-sm"
            >
              <Phone className="mr-2 h-4 w-4" />
              Discar 190
            </Button>
            <Button
              onClick={handleSOSNetwork}
              size="lg"
              className="bg-blue-200/70 hover:bg-blue-300/80 text-blue-700 backdrop-blur-sm border border-blue-300/50 min-w-[160px] h-12 shadow-sm"
            >
              <Users className="mr-2 h-4 w-4" />
              SOS Rede
            </Button>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Clique para acesso imediato em situação de risco
          </p>
        </div>
      </div>
    </section>
  );
};
