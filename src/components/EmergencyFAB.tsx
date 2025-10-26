import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Phone, ShieldAlert, Users, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface EmergencyFABProps {
  userProfile?: "user" | "supporter" | null;
}

export function EmergencyFAB({ userProfile }: EmergencyFABProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentProfile = userProfile ?? (localStorage.getItem("userProfile") as "user" | "supporter" | null);
  
  // Debug
  console.log('[EmergencyFAB] userProfile prop:', userProfile);
  console.log('[EmergencyFAB] currentProfile:', currentProfile);
  console.log('[EmergencyFAB] Mostrar SOS Rede?', currentProfile === "user");

  const handleCall180 = () => {
    const phoneNumber = "180";
    
    // Registrar chamado no banco
    registerEmergencyCall("180");
    
    // Tentar abrir o discador
    window.location.href = `tel:${phoneNumber}`;
    
    toast.success("📞 Discando 180", {
      description: "Central de Atendimento à Mulher",
    });
    
    setIsOpen(false);
  };

  const handleCall190 = () => {
    const phoneNumber = "190";
    
    // Registrar chamado no banco
    registerEmergencyCall("190");
    
    // Tentar abrir o discador
    window.location.href = `tel:${phoneNumber}`;
    
    toast.success("🚨 Discando 190", {
      description: "Polícia Militar - Emergência",
    });
    
    setIsOpen(false);
  };

  const handleSOSNetwork = async () => {
    try {
      const profileId = localStorage.getItem("profile_id");
      if (!profileId) {
        toast.error("Você precisa estar logada");
        return;
      }

      // Buscar contatos de confiança
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
        setIsOpen(false);
        return;
      }

      // Registrar alertas no banco
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
    
    setIsOpen(false);
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
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-20 right-4 h-10 w-10 rounded-full shadow-md bg-rose-200/80 hover:bg-rose-300/90 text-rose-700 z-50 backdrop-blur-sm border border-rose-300/50"
          aria-label="Emergência"
        >
          <ShieldAlert className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 mr-4 mb-2 bg-white/95 backdrop-blur-sm">
        <div className="px-2 py-1.5">
          <p className="text-xs font-semibold text-rose-600 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Acesso Rápido
          </p>
        </div>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleCall180} className="cursor-pointer hover:bg-purple-50">
          <Phone className="mr-2 h-4 w-4 text-purple-500" />
          <div className="flex-1">
            <p className="font-medium text-gray-700">Discar 180</p>
            <p className="text-xs text-gray-500">
              Central de Atendimento à Mulher
            </p>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleCall190} className="cursor-pointer hover:bg-rose-50">
          <Phone className="mr-2 h-4 w-4 text-rose-500" />
          <div className="flex-1">
            <p className="font-medium text-gray-700">Discar 190</p>
            <p className="text-xs text-gray-500">Polícia Militar</p>
          </div>
        </DropdownMenuItem>

        {/* SOS Rede - apenas para vítimas (users) - v2 */}
        {currentProfile === "user" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSOSNetwork} className="cursor-pointer hover:bg-blue-50">
              <Users className="mr-2 h-4 w-4 text-blue-500" />
              <div className="flex-1">
                <p className="font-medium text-gray-700">SOS Rede de Apoio</p>
                <p className="text-xs text-gray-500">
                  Alertar meus contatos
                </p>
              </div>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
