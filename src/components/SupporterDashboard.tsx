import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Clock, Heart, CheckCircle, Users, TrendingUp, CheckCheck, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AnonymousChat } from "./AnonymousChat";

interface ChatRoom {
  id: string;
  victim_id: string;
  supporter_id: string | null;
  status: "waiting" | "active" | "closed";
  victim_display_name: string;
  created_at: string;
  updated_at: string;
  last_message_sender?: string | null;
  last_message_time?: string | null;
  has_unread?: boolean;
}

interface SupporterDashboardProps {
  profileId: string;
}

export function SupporterDashboard({ profileId }: SupporterDashboardProps) {
  const [waitingRooms, setWaitingRooms] = useState<ChatRoom[]>([]);
  const [activeRooms, setActiveRooms] = useState<ChatRoom[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalAccepted: 0,
    totalClosed: 0,
    avgResponseTime: 0,
    pendingResponses: 0,
  });

  useEffect(() => {
    loadRooms();
    loadStats();
    subscribeToRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);

      // Salas aguardando
      const { data: waiting, error: waitingError } = await supabase
        .from("chat_rooms")
        .select("*")
        .eq("status", "waiting")
        .order("created_at", { ascending: true });

      if (waitingError) throw waitingError;

      // Salas ativas desta apoiadora
      const { data: active, error: activeError } = await supabase
        .from("chat_rooms")
        .select("*")
        .eq("supporter_id", profileId)
        .eq("status", "active")
        .order("updated_at", { ascending: false });

      if (activeError) throw activeError;

      // Para cada sala ativa, verificar última mensagem
      if (active && active.length > 0) {
        const roomsWithStatus = await Promise.all(
          active.map(async (room) => {
            // Buscar última mensagem da sala
            const { data: lastMessage } = await supabase
              .from("chat_messages")
              .select("sender_id, created_at")
              .eq("room_id", room.id)
              .order("created_at", { ascending: false })
              .limit(1);

            if (lastMessage && lastMessage.length > 0) {
              const msg = lastMessage[0];
              // Se última mensagem foi da vítima (não da apoiadora), marcar como não lida
              const hasUnread = msg.sender_id === room.victim_id;
              
              return {
                ...room,
                last_message_sender: msg.sender_id,
                last_message_time: msg.created_at,
                has_unread: hasUnread,
              };
            }

            return room;
          })
        );

        setActiveRooms(roomsWithStatus);
      } else {
        setActiveRooms([]);
      }

      setWaitingRooms(waiting || []);
      
      // Carregar estatísticas após carregar salas
      loadStats();
    } catch (error) {
      console.error("Erro ao carregar salas:", error);
      toast.error("Erro ao carregar chamados");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Total de chamados aceitos por esta apoiadora
      const { count: accepted } = await supabase
        .from("chat_rooms")
        .select("*", { count: "exact", head: true })
        .eq("supporter_id", profileId);

      // Total de chamados encerrados
      const { count: closed } = await supabase
        .from("chat_rooms")
        .select("*", { count: "exact", head: true })
        .eq("supporter_id", profileId)
        .eq("status", "closed");

      // Salas com mensagens não respondidas (pendentes)
      const pendingCount = activeRooms.filter((room) => room.has_unread).length;

      setStats({
        totalAccepted: accepted || 0,
        totalClosed: closed || 0,
        avgResponseTime: 0, // Placeholder para cálculo futuro
        pendingResponses: pendingCount,
      });
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    }
  };

  const subscribeToRooms = () => {
    // Inscrever-se em mudanças nas salas
    const roomsSubscription = supabase
      .channel("supporter-rooms")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat_rooms",
        },
        (payload) => {
          console.log("📢 Mudança em sala:", payload);
          loadRooms(); // Recarregar lista
        }
      )
      .subscribe();

    // Inscrever-se em mudanças nas mensagens (para atualizar status)
    const messagesSubscription = supabase
      .channel("supporter-messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
        },
        (payload) => {
          console.log("📨 Nova mensagem:", payload);
          // Atualizar lista para refletir novo status de "aguardando resposta"
          loadRooms();
        }
      )
      .subscribe();

    return () => {
      roomsSubscription.unsubscribe();
      messagesSubscription.unsubscribe();
    };
  };

  const acceptRoom = async (roomId: string) => {
    try {
      const { error } = await supabase
        .from("chat_rooms")
        .update({
          supporter_id: profileId,
          status: "active",
        })
        .eq("id", roomId)
        .eq("status", "waiting"); // Só aceita se ainda estiver waiting

      if (error) throw error;

      // Enviar mensagem de sistema
      await supabase.from("chat_messages").insert([
        {
          room_id: roomId,
          sender_id: profileId,
          sender_type: "supporter",
          message: "Olá! Sou uma apoiadora voluntária. Estou aqui para te ouvir e ajudar. Pode conversar comigo.",
          is_system_message: true,
        },
      ]);

      toast.success("Chamado aceito! Iniciando conversa...");
      
      // Abrir chat imediatamente
      setSelectedRoomId(roomId);
      setChatOpen(true);
      
      // Recarregar listas
      loadRooms();
    } catch (error) {
      console.error("Erro ao aceitar chamado:", error);
      toast.error("Erro ao aceitar chamado. Pode ter sido aceito por outra apoiadora.");
      loadRooms(); // Atualizar lista
    }
  };

  const openChat = (roomId: string) => {
    setSelectedRoomId(roomId);
    setChatOpen(true);
  };

  const getTimeSince = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "agora mesmo";
    if (diffMins < 60) return `há ${diffMins} min`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `há ${diffHours}h`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `há ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Carregando chamados...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <Heart className="w-16 h-16 mx-auto text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Painel de Apoio</h2>
        <p className="text-muted-foreground">
          Mulheres que precisam de ajuda agora
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500/10 p-3 rounded-full">
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{waitingRooms.length}</p>
              <p className="text-xs text-muted-foreground">Aguardando</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-500/10 p-3 rounded-full">
              <MessageCircle className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeRooms.length}</p>
              <p className="text-xs text-muted-foreground">Ativos</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/10 p-3 rounded-full">
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalAccepted}</p>
              <p className="text-xs text-muted-foreground">Total Aceitos</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-500/10 p-3 rounded-full">
              <CheckCheck className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalClosed}</p>
              <p className="text-xs text-muted-foreground">Encerrados</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Alertas de Pendências */}
      {stats.pendingResponses > 0 && (
        <Card className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-blue-500" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                {stats.pendingResponses} conversa{stats.pendingResponses > 1 ? 's' : ''} aguardando sua resposta
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Há mensagens não respondidas em algumas conversas ativas
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Chamados Aguardando */}
      {waitingRooms.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-500" />
            <h3 className="font-semibold">
              Chamados Aguardando ({waitingRooms.length})
            </h3>
          </div>

          {waitingRooms.map((room) => (
            <Card
              key={room.id}
              className="p-4 border-l-4 border-l-orange-500 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <h4 className="font-semibold">
                        {room.victim_display_name}
                      </h4>
                      <Badge
                        variant="outline"
                        className="bg-orange-500/10 text-orange-500 border-orange-500/20"
                      >
                        URGENTE
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{getTimeSince(room.created_at)}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  Mulher em situação de vulnerabilidade solicita apoio emocional
                </p>

                <Button
                  variant="default"
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => acceptRoom(room.id)}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Aceitar Chamado
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Sem Chamados Aguardando */}
      {waitingRooms.length === 0 && (
        <Card className="p-8 text-center">
          <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
          <h3 className="font-semibold mb-2">Nenhum chamado aguardando</h3>
          <p className="text-sm text-muted-foreground">
            Novas solicitações aparecerão aqui automaticamente
          </p>
        </Card>
      )}

      {/* Conversas Ativas */}
      {activeRooms.length > 0 && (
        <div className="space-y-3 pt-6 border-t">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-green-500" />
            <h3 className="font-semibold">
              Conversas Ativas ({activeRooms.length})
            </h3>
          </div>

          {activeRooms.map((room) => (
            <Card
              key={room.id}
              className={`p-4 border-l-4 ${
                room.has_unread ? 'border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20' : 'border-l-green-500'
              } hover:shadow-md transition-shadow cursor-pointer`}
              onClick={() => openChat(room.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 ${
                      room.has_unread ? 'bg-blue-500' : 'bg-green-500'
                    } rounded-full animate-pulse`} />
                    <h4 className="font-semibold">
                      Chat com {room.victim_display_name}
                    </h4>
                    {room.has_unread && (
                      <Badge className="bg-blue-500 hover:bg-blue-600 ml-2">
                        Aguardando resposta
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {room.has_unread ? (
                      <>Nova mensagem • {room.last_message_time && format(new Date(room.last_message_time), "HH:mm", { locale: ptBR })}</>
                    ) : (
                      <>Última atualização: {format(new Date(room.updated_at), "HH:mm", { locale: ptBR })}</>
                    )}
                  </p>
                </div>
                <Button variant={room.has_unread ? "default" : "outline"} size="sm">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {room.has_unread ? "Responder" : "Continuar"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Chat - Reutilizar componente existente */}
      {selectedRoomId && (
        <AnonymousChat
          open={chatOpen}
          onClose={() => {
            setChatOpen(false);
            setSelectedRoomId(null);
            loadRooms(); // Atualizar listas ao fechar
          }}
          roomId={selectedRoomId}
        />
      )}
    </div>
  );
}
