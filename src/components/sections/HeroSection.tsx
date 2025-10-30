import { Phone, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import heroImage from "@/assets/hero-support.jpg";

export const HeroSection = () => {
  const userProfile = localStorage.getItem("userProfile") as "user" | "supporter" | null;

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
    <section className="relative min-h-[65vh] flex items-center justify-center overflow-hidden bg-gradient-hero">
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="relative z-10 text-center px-6 py-16 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 bg-gradient-primary bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-700 leading-tight">
          Bem-vinda ao Apoia
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl text-foreground/70 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 max-w-2xl mx-auto leading-relaxed">
          Uma rede de apoio gamificada para fortalecer mulheres e combater a violência
        </p>

        {/* Botões de Emergência Rápida */}
        <div className="mt-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <div className="inline-flex items-center gap-2 bg-rose-100/60 dark:bg-rose-900/20 px-4 py-1.5 rounded-full mb-5">
            <span className="inline-block w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold text-rose-700 dark:text-rose-400">Acesso Rápido</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handleCall180}
              size="lg"
              className="bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 text-purple-700 dark:text-purple-400 backdrop-blur-sm border-2 border-purple-300/50 dark:border-purple-700/50 min-w-[180px] h-14 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 font-semibold"
            >
              <Phone className="mr-2 h-5 w-5" />
              Discar 180
            </Button>
            <Button
              onClick={handleCall190}
              size="lg"
              className="bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 text-rose-700 dark:text-rose-400 backdrop-blur-sm border-2 border-rose-300/50 dark:border-rose-700/50 min-w-[180px] h-14 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 font-semibold"
            >
              <Phone className="mr-2 h-5 w-5" />
              Discar 190
            </Button>
            {/* SOS Rede - apenas para vítimas (users) */}
            {userProfile === "user" && (
              <Button
                onClick={handleSOSNetwork}
                size="lg"
                className="bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 text-blue-700 dark:text-blue-400 backdrop-blur-sm border-2 border-blue-300/50 dark:border-blue-700/50 min-w-[180px] h-14 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 font-semibold"
              >
                <Users className="mr-2 h-5 w-5" />
                SOS Rede
              </Button>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Clique para acesso imediato em situação de risco
          </p>
        </div>
      </div>
    </section>
  );
};
