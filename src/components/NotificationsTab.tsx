import { useNotifications, Notification } from "@/hooks/useNotifications";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Sparkles,
  MessageCircle,
  Users,
  AlertTriangle,
  Award,
  Info,
  ExternalLink,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface NotificationsTabProps {
  userId: string | null;
  notificationsHook?: ReturnType<typeof useNotifications>;
}

export const NotificationsTab = ({ userId, notificationsHook }: NotificationsTabProps) => {
  // Usar hook compartilhado se fornecido, senão criar novo
  const hookData = notificationsHook || useNotifications(userId);
  
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = hookData;

  const getNotificationIcon = (type: Notification["type"]) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case "mission":
        return <Sparkles className={`${iconClass} text-purple-500`} />;
      case "chat":
        return <MessageCircle className={`${iconClass} text-blue-500`} />;
      case "network":
        return <Users className={`${iconClass} text-green-500`} />;
      case "alert":
        return <AlertTriangle className={`${iconClass} text-red-500`} />;
      case "achievement":
        return <Award className={`${iconClass} text-yellow-500`} />;
      case "info":
      default:
        return <Info className={`${iconClass} text-gray-500`} />;
    }
  };

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "mission":
        return "bg-purple-500/10 border-purple-500/20";
      case "chat":
        return "bg-blue-500/10 border-blue-500/20";
      case "network":
        return "bg-green-500/10 border-green-500/20";
      case "alert":
        return "bg-red-500/10 border-red-500/20";
      case "achievement":
        return "bg-yellow-500/10 border-yellow-500/20";
      case "info":
      default:
        return "bg-gray-500/10 border-gray-500/20";
    }
  };

  const getTypeLabel = (type: Notification["type"]) => {
    const labels = {
      mission: "Missão",
      chat: "Chat",
      network: "Rede",
      alert: "Alerta",
      achievement: "Conquista",
      info: "Info",
    };
    return labels[type];
  };

  if (loading) {
    return (
      <div className="px-6 py-8 animate-fade-in">
        <div className="text-center py-12">
          <Bell className="w-12 h-12 mx-auto text-muted-foreground animate-pulse mb-4" />
          <p className="text-muted-foreground">Carregando notificações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Bell className="w-6 h-6" />
            Notificações
          </h2>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              Você tem {unreadCount} {unreadCount === 1 ? "notificação não lida" : "notificações não lidas"}
            </p>
          )}
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            className="flex items-center gap-2"
          >
            <CheckCheck className="w-4 h-4" />
            Marcar todas como lidas
          </Button>
        )}
      </div>

      {/* Lista de Notificações */}
      {notifications.length === 0 ? (
        <Card className="p-12 text-center">
          <Bell className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="font-semibold text-lg mb-2">Nenhuma notificação</h3>
          <p className="text-sm text-muted-foreground">
            Você será notificada sobre missões, mensagens e atualizações importantes
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 transition-all hover:shadow-md ${
                !notification.is_read
                  ? `${getNotificationColor(notification.type)} border-l-4`
                  : "opacity-60"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Ícone */}
                <div className="mt-1">{getNotificationIcon(notification.type)}</div>

                {/* Conteúdo */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">
                      {notification.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {getTypeLabel(notification.type)}
                      </Badge>
                      {!notification.is_read && (
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">
                    {notification.message}
                  </p>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.created_at), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </p>

                    <div className="flex items-center gap-2">
                      {/* Ação Customizada */}
                      {notification.action_url && notification.action_label && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                          onClick={() => {
                            // Aqui você pode implementar navegação ou ação
                            console.log("Action:", notification.action_url);
                          }}
                        >
                          {notification.action_label}
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                      )}

                      {/* Marcar como lida */}
                      {!notification.is_read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}

                      {/* Deletar */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                        className="text-xs text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
