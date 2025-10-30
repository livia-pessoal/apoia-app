import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogDescription,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  User,
  Edit,
  Save,
  X,
  Award,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Settings,
  LogOut,
  Shield,
  Bell,
  Eye,
  EyeOff,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

interface ProfileStats {
  total_missions: number;
  completed_missions: number;
  completion_rate: number;
  total_points: number;
  current_level: number;
  days_since_join: number;
  total_contacts: number;
  total_alerts: number;
  total_notifications: number;
  unread_notifications: number;
}

interface ProfileData {
  id: string;
  display_name: string;
  user_type: "user" | "supporter";  // Campo real na tabela
  bio?: string;
  email?: string;
  phone?: string;
  city?: string;
  state?: string;
  avatar_color?: string;
  privacy_mode?: string;
  notification_preferences?: { enabled?: boolean };
  level?: number;
  created_at?: string;
}

export const ProfileTab = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [avatarColor, setAvatarColor] = useState("purple");
  const [privacyMode, setPrivacyMode] = useState("normal");
  const [stealthDialogOpen, setStealthDialogOpen] = useState(false);

  useEffect(() => {
    loadProfile();
    loadStats();
  }, []);

  const loadProfile = async () => {
    const profileId = localStorage.getItem("profile_id");
    if (!profileId) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", profileId)
        .single();

      if (error) throw error;

      setProfile(data);
      setDisplayName(data.display_name || "Usuário");
      setBio(data.bio || "");
      setEmail(data.email || "");
      setPhone(data.phone || "");
      setCity(data.city || "");
      setState(data.state || "");
      setAvatarColor(data.avatar_color || "purple");
      setPrivacyMode(data.privacy_mode || "normal");
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      toast.error("Erro ao carregar perfil");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    const profileId = localStorage.getItem("profile_id");
    if (!profileId) return;

    try {
      const { data, error } = await supabase.rpc("get_profile_stats", {
        p_user_id: profileId,
      });

      if (error) throw error;
      if (data && data.length > 0) {
        setStats(data[0]);
      }
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    }
  };

  const handleSave = async () => {
    const profileId = localStorage.getItem("profile_id");
    if (!profileId) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName,
          bio: bio,
          email: email,
          phone: phone,
          city: city,
          state: state,
          avatar_color: avatarColor,
          privacy_mode: privacyMode,
        })
        .eq("id", profileId);

      if (error) throw error;

      // Atualizar localStorage
      localStorage.setItem("display_name", displayName);

      toast.success("Perfil atualizado com sucesso!");
      setIsEditing(false);
      loadProfile();
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Erro ao atualizar perfil");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logout realizado com sucesso!");
    navigate("/");
  };

  const getAvatarGradient = (color: string) => {
    const gradients: Record<string, string> = {
      purple: "from-purple-500 to-pink-500",
      blue: "from-blue-500 to-cyan-500",
      green: "from-green-500 to-emerald-500",
      orange: "from-orange-500 to-red-500",
      pink: "from-pink-500 to-rose-500",
    };
    return gradients[color] || gradients.purple;
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name || name.trim() === "") return "??";
    return name
      .trim()
      .split(" ")
      .filter((n) => n.length > 0)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "??";
  };

  if (loading) {
    return (
      <div className="px-6 py-8 animate-fade-in">
        <div className="text-center py-12">
          <User className="w-12 h-12 mx-auto text-muted-foreground animate-pulse mb-4" />
          <p className="text-muted-foreground">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="px-6 py-8 animate-fade-in">
        <Card className="p-12 text-center">
          <User className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="font-semibold text-lg mb-2">Perfil não encontrado</h3>
          <Button onClick={() => navigate("/")}>Voltar ao Login</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 animate-fade-in space-y-6">
      {/* Header - Avatar e Informações Básicas */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div
            className={`w-24 h-24 rounded-full bg-gradient-to-br ${getAvatarGradient(
              avatarColor
            )} flex items-center justify-center shadow-lg`}
          >
            <span className="text-3xl font-bold text-white">
              {getInitials(profile.display_name)}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
              <h2 className="text-2xl font-bold">{profile.display_name}</h2>
              <Badge variant={profile.user_type === "supporter" ? "default" : "secondary"}>
                {profile.user_type === "supporter" ? "Apoiadora" : "Apoiada"}
              </Badge>
            </div>
            {profile.bio && (
              <p className="text-muted-foreground mb-2">{profile.bio}</p>
            )}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground justify-center md:justify-start">
              {profile.city && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {profile.city}, {profile.state}
                </span>
              )}
              {stats && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {stats.days_since_join} dias no APOIA
                </span>
              )}
            </div>
          </div>

          {/* Ações */}
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Edit className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Editar Perfil</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  {/* Nome */}
                  <div>
                    <Label htmlFor="name">Nome de Exibição</Label>
                    <Input
                      id="name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Como deseja ser chamada?"
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <Label htmlFor="bio">Sobre você</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Conte um pouco sobre você..."
                      rows={3}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email">Email (opcional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                    />
                  </div>

                  {/* Telefone */}
                  <div>
                    <Label htmlFor="phone">Telefone (opcional)</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  {/* Localização */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="São Paulo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">Estado</Label>
                      <Input
                        id="state"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="SP"
                        maxLength={2}
                      />
                    </div>
                  </div>

                  {/* Cor do Avatar */}
                  <div>
                    <Label>Cor do Avatar</Label>
                    <div className="flex gap-2 mt-2">
                      {["purple", "blue", "green", "orange", "pink"].map((color) => (
                        <button
                          key={color}
                          onClick={() => setAvatarColor(color)}
                          className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarGradient(
                            color
                          )} border-2 ${
                            avatarColor === color
                              ? "border-primary scale-110"
                              : "border-transparent"
                          } transition-all`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Privacidade */}
                  <div>
                    <Label>Modo de Privacidade</Label>
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant={privacyMode === "normal" ? "default" : "outline"}
                        onClick={() => setPrivacyMode("normal")}
                        className="flex-1"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Normal
                      </Button>
                      <Button
                        variant={privacyMode === "stealth" ? "default" : "outline"}
                        onClick={() => setPrivacyMode("stealth")}
                        className="flex-1"
                      >
                        <EyeOff className="w-4 h-4 mr-2" />
                        Discreto
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {privacyMode === "stealth"
                        ? "Suas informações ficam mais protegidas"
                        : "Visibilidade normal do perfil"}
                    </p>
                  </div>

                  {/* Botões */}
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSave} className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Alterações
                    </Button>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                    </DialogTrigger>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" size="icon" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Estatísticas */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium">Missões</span>
            </div>
            <p className="text-2xl font-bold">{stats.completed_missions}</p>
            <p className="text-xs text-muted-foreground">
              de {stats.total_missions} completadas
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">Progresso</span>
            </div>
            <p className="text-2xl font-bold">{stats.completion_rate}%</p>
            <p className="text-xs text-muted-foreground">taxa de conclusão</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium">Pontos</span>
            </div>
            <p className="text-2xl font-bold">{stats.total_points}</p>
            <p className="text-xs text-muted-foreground">
              nível {stats.current_level}
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Rede</span>
            </div>
            <p className="text-2xl font-bold">{stats.total_contacts}</p>
            <p className="text-xs text-muted-foreground">contatos de apoio</p>
          </Card>
        </div>
      )}

      {/* Informações de Contato */}
      {(profile.email || profile.phone) && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Informações de Contato
          </h3>
          <div className="space-y-3">
            {profile.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{profile.email}</span>
              </div>
            )}
            {profile.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{profile.phone}</span>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Configurações Funcionais */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Configurações
        </h3>
        <div className="space-y-4">
          {/* Notificações Toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Bell className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Notificações</p>
                <p className="text-xs text-muted-foreground">
                  Receber alertas de mensagens e eventos
                </p>
              </div>
            </div>
            <Switch
              checked={profile.notification_preferences?.enabled !== false}
              onCheckedChange={async (checked) => {
                try {
                  await supabase
                    .from("profiles")
                    .update({
                      notification_preferences: { enabled: checked }
                    })
                    .eq("id", profile.id);
                  
                  toast.success(checked ? "Notificações ativadas" : "Notificações desativadas");
                  loadProfile();
                } catch (error) {
                  toast.error("Erro ao atualizar configuração");
                }
              }}
            />
          </div>

          {/* Modo Discreto - Botão com confirmação */}
          <div className="p-3 rounded-lg border border-primary/20 bg-primary/5">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Modo Discreto</p>
                <p className="text-xs text-muted-foreground">
                  {privacyMode === "stealth" 
                    ? "🔒 Ativado - App disfarçado"
                    : "Disfarçar app para proteção"}
                </p>
              </div>
            </div>
            <Button
              variant={privacyMode === "stealth" ? "destructive" : "default"}
              size="sm"
              className="w-full"
              onClick={() => setStealthDialogOpen(true)}
            >
              {privacyMode === "stealth" ? "Desativar Modo Discreto" : "Ativar Modo Discreto"}
            </Button>
          </div>

          {/* AlertDialog de Confirmação */}
          <AlertDialog open={stealthDialogOpen} onOpenChange={setStealthDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {privacyMode === "stealth" 
                    ? "Desativar Modo Discreto?" 
                    : "Ativar Modo Discreto?"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {privacyMode === "stealth" 
                    ? "O app voltará ao visual normal do Apoia. Você pode reativar quando quiser."
                    : "O app será disfarçado como um aplicativo de receitas culinárias. Para voltar ao normal, clique 2x no texto 'v1.2' no canto superior ou volte aqui."}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    const newMode = privacyMode === "stealth" ? "normal" : "stealth";
                    try {
                      await supabase
                        .from("profiles")
                        .update({ privacy_mode: newMode })
                        .eq("id", profile.id);
                      
                      setPrivacyMode(newMode);
                      
                      // Disparar evento customizado
                      window.dispatchEvent(new CustomEvent("stealthModeChanged", { 
                        detail: { enabled: newMode === "stealth" } 
                      }));
                      
                      toast.success(
                        newMode === "stealth" 
                          ? "🔒 Modo discreto ativado!" 
                          : "✨ Modo normal ativado"
                      );
                    } catch (error) {
                      toast.error("Erro ao atualizar privacidade");
                    }
                  }}
                >
                  {privacyMode === "stealth" ? "Sim, desativar" : "Sim, ativar"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Card>

      {/* Botão Logout Grande */}
      <Button
        variant="outline"
        className="w-full"
        size="lg"
        onClick={handleLogout}
      >
        <LogOut className="w-5 h-5 mr-2" />
        Sair da Conta
      </Button>
    </div>
  );
};
