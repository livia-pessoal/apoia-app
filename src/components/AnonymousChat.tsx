import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Users, Clock, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ChatRoom {
  id: string;
  victim_id: string;
  supporter_id: string | null;
  status: "waiting" | "active" | "closed";
  victim_display_name: string;
  created_at: string;
  updated_at: string;
}

interface ChatMessage {
  id: string;
  room_id: string;
  sender_id: string;
  sender_type: "victim" | "supporter";
  message: string;
  is_read: boolean;
  is_system_message: boolean;
  created_at: string;
}

interface AnonymousChatProps {
  open: boolean;
  onClose: () => void;
  roomId?: string; // ID da sala (para apoiadoras abrirem salas existentes)
}

export function AnonymousChat({ open, onClose, roomId }: AnonymousChatProps) {
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const profileId = localStorage.getItem("profile_id");
  const userProfile = localStorage.getItem("userProfile") as "user" | "supporter";

  useEffect(() => {
    if (open) {
      if (roomId) {
        // Se roomId foi fornecido, carregar sala específica (apoiadora abrindo sala)
        loadSpecificRoom(roomId);
      } else {
        // Se não, verificar sala existente da vítima
        checkExistingRoom();
      }
    }

    return () => {
      // Cleanup subscriptions
    };
  }, [open, roomId]);

  useEffect(() => {
    if (currentRoom?.id) {
      loadMessages();
      const subscription = subscribeToMessages();
      
      return () => {
        if (subscription) {
          subscription();
        }
      };
    }
  }, [currentRoom?.id]); // Mudança: usar currentRoom?.id para garantir re-render correto

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const checkExistingRoom = async () => {
    try {
      setLoading(true);

      if (userProfile === "user") {
        // Vítima: verificar se já tem sala
        const { data, error } = await supabase
          .from("chat_rooms")
          .select("*")
          .eq("victim_id", profileId)
          .in("status", ["waiting", "active"])
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (data) {
          setCurrentRoom(data);
        }
      }
    } catch (error) {
      console.log("Nenhuma sala existente");
    } finally {
      setLoading(false);
    }
  };

  const loadSpecificRoom = async (specificRoomId: string) => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("chat_rooms")
        .select("*")
        .eq("id", specificRoomId)
        .single();

      if (error) throw error;

      if (data) {
        setCurrentRoom(data);
      }
    } catch (error) {
      console.error("Erro ao carregar sala:", error);
      toast.error("Erro ao carregar conversa");
    } finally {
      setLoading(false);
    }
  };

  const createRoom = async () => {
    try {
      setConnecting(true);

      const { data, error } = await supabase
        .from("chat_rooms")
        .insert([
          {
            victim_id: profileId,
            status: "waiting",
            victim_display_name: "Anônima",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setCurrentRoom(data);

      // Enviar mensagem automática
      await supabase.from("chat_messages").insert([
        {
          room_id: data.id,
          sender_id: profileId,
          sender_type: "victim",
          message:
            "Olá, preciso de apoio. Estou em uma situação difícil e gostaria de conversar com alguém.",
          is_system_message: true,
        },
      ]);

      toast.success("Conectando com apoiadora...");
    } catch (error) {
      console.error("Erro ao criar sala:", error);
      toast.error("Erro ao iniciar chat");
    } finally {
      setConnecting(false);
    }
  };

  const loadMessages = async () => {
    if (!currentRoom) return;

    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("room_id", currentRoom.id)
        .order("created_at", { ascending: true });

      if (error) throw error;

      setMessages(data || []);
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error);
    }
  };

  const subscribeToMessages = () => {
    if (!currentRoom?.id) return undefined;

    console.log(`📡 Inscrevendo em chat-room-${currentRoom.id}`);

    const subscription = supabase
      .channel(`chat-room-${currentRoom.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `room_id=eq.${currentRoom.id}`,
        },
        (payload) => {
          console.log('📨 Nova mensagem recebida:', payload.new);
          const newMsg = payload.new as ChatMessage;
          setMessages((prev) => {
            // Evitar duplicatas
            if (prev.some(m => m.id === newMsg.id)) {
              return prev;
            }
            return [...prev, newMsg];
          });
        }
      )
      .subscribe();

    // Retornar função de cleanup
    return () => {
      console.log(`🔌 Desinscrevendo de chat-room-${currentRoom.id}`);
      subscription.unsubscribe();
    };
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !currentRoom || !profileId) return;

    const messageText = newMessage.trim();
    setNewMessage(""); // Limpar input imediatamente para melhor UX

    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .insert([
          {
            room_id: currentRoom.id,
            sender_id: profileId,
            sender_type: userProfile === "user" ? "victim" : "supporter",
            message: messageText,
          },
        ])
        .select();

      if (error) throw error;

      // Adicionar mensagem ao estado local imediatamente
      if (data && data.length > 0) {
        const newMsg = data[0] as ChatMessage;
        setMessages((prev) => {
          // Evitar duplicata (caso subscription já tenha adicionado)
          if (prev.some(m => m.id === newMsg.id)) {
            return prev;
          }
          return [...prev, newMsg];
        });
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast.error("Erro ao enviar mensagem");
      // Restaurar mensagem no input em caso de erro
      setNewMessage(messageText);
    }
  };

  const closeChat = async () => {
    if (!currentRoom) return;

    try {
      const { error } = await supabase
        .from("chat_rooms")
        .update({ status: "closed", closed_at: new Date().toISOString() })
        .eq("id", currentRoom.id);

      if (error) throw error;

      toast.success("Chat encerrado");
      setCurrentRoom(null);
      setMessages([]);
      onClose();
    } catch (error) {
      console.error("Erro ao encerrar chat:", error);
      toast.error("Erro ao encerrar chat");
    }
  };

  const handleClose = () => {
    if (currentRoom && currentRoom.status === "active") {
      if (confirm("Deseja realmente sair do chat? Você pode voltar depois.")) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Chat Anônimo
            </div>
            {currentRoom && currentRoom.status === "active" && (
              <Badge variant="outline" className="text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                Online
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            {!currentRoom
              ? "Converse com uma apoiadora de forma anônima e segura"
              : currentRoom.status === "waiting"
                ? "Aguardando conexão com apoiadora..."
                : "Conversa ativa com apoiadora"}
          </DialogDescription>
        </DialogHeader>

        {/* Sem Sala */}
        {!currentRoom && !loading && (
          <div className="flex-1 flex items-center justify-center">
            <Card className="p-8 text-center max-w-md">
              <MessageCircle className="w-16 h-16 mx-auto text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Precisa Conversar?</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Conecte-se com uma apoiadora voluntária de forma completamente anônima. Suas conversas são
                confidenciais.
              </p>
              <Button onClick={createRoom} disabled={connecting} className="w-full" size="lg">
                {connecting ? "Conectando..." : "Iniciar Chat Anônimo"}
              </Button>
              <p className="text-xs text-muted-foreground mt-4">
                ⚠️ Este chat é para apoio emocional. Em caso de emergência, ligue <strong>180</strong>
              </p>
            </Card>
          </div>
        )}

        {/* Sala Aguardando */}
        {currentRoom && currentRoom.status === "waiting" && (
          <div className="flex-1 flex items-center justify-center">
            <Card className="p-8 text-center max-w-md">
              <div className="relative">
                <Users className="w-16 h-16 mx-auto text-primary mb-4 animate-pulse" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Aguardando Apoiadora</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Estamos procurando uma apoiadora disponível para conversar com você. Isso pode levar alguns
                minutos.
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Aguarde, você será conectada em breve...</span>
              </div>
              <Button variant="outline" onClick={closeChat} className="w-full mt-6">
                Cancelar
              </Button>
            </Card>
          </div>
        )}

        {/* Chat Ativo */}
        {currentRoom && currentRoom.status === "active" && (
          <>
            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto space-y-3 p-4 bg-muted/10 rounded-lg min-h-[400px] max-h-[500px]">
              {messages.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm">
                  Nenhuma mensagem ainda. Comece a conversa!
                </p>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.sender_id === profileId;
                  const isSystem = msg.is_system_message;

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMe ? "justify-end" : "justify-start"} ${
                        isSystem ? "justify-center" : ""
                      }`}
                    >
                      {isSystem ? (
                        <div className="bg-muted px-3 py-2 rounded-lg max-w-[80%]">
                          <p className="text-xs text-muted-foreground text-center">{msg.message}</p>
                        </div>
                      ) : (
                        <div
                          className={`max-w-[70%] ${
                            isMe ? "bg-primary text-primary-foreground" : "bg-background"
                          } px-4 py-2 rounded-lg shadow-sm`}
                        >
                          <p className="text-sm">{msg.message}</p>
                          <p className={`text-xs mt-1 ${isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                            {format(new Date(msg.created_at), "HH:mm", { locale: ptBR })}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input de Mensagem */}
            <form onSubmit={sendMessage} className="flex gap-2 pt-4 border-t">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                disabled={currentRoom.status !== "active"}
              />
              <Button type="submit" disabled={!newMessage.trim() || currentRoom.status !== "active"}>
                <Send className="w-4 h-4" />
              </Button>
            </form>

            {/* Botão Encerrar */}
            <div className="pt-2">
              <Button variant="outline" onClick={closeChat} size="sm" className="w-full">
                <X className="w-4 h-4 mr-2" />
                Encerrar Conversa
              </Button>
            </div>
          </>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
