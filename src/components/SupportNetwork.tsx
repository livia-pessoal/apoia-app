import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  UserPlus, 
  Users, 
  Phone, 
  Mail, 
  Edit, 
  Trash2, 
  AlertCircle,
  Heart,
  Shield,
  Bell,
  TrendingUp,
  Activity,
  CheckCircle,
  Clock
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useOrganizations } from "@/hooks/useOrganizations";

interface TrustedContact {
  id: string;
  user_id: string;
  name: string;
  relationship: string | null;
  phone: string | null;
  email: string | null;
  notes: string | null;
  can_receive_alerts: boolean;
  priority_level: number;
  created_at: string;
}

interface SupportNetworkProps {
  userProfile: "user" | "supporter";
}

export function SupportNetwork({ userProfile }: SupportNetworkProps) {
  const [contacts, setContacts] = useState<TrustedContact[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<TrustedContact | null>(null);
  const { organizations } = useOrganizations();
  const profileId = localStorage.getItem("profile_id");
  
  // Stats para apoiadoras
  const [networkStats, setNetworkStats] = useState({
    callsToday: 0,
    activeNow: 0,
    totalClosed: 0,
    totalSupporters: 0,
    avgResponseTime: 0,
  });

  // Form state
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [priorityLevel, setPriorityLevel] = useState("1");

  useEffect(() => {
    if (userProfile === "user") {
      loadContacts();
    } else if (userProfile === "supporter") {
      loadNetworkStats();
    }
  }, [userProfile]);

  const loadNetworkStats = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Chamados criados hoje
      const { count: callsToday } = await supabase
        .from("chat_rooms")
        .select("*", { count: "exact", head: true })
        .gte("created_at", today.toISOString());

      // Chamados ativos agora
      const { count: activeNow } = await supabase
        .from("chat_rooms")
        .select("*", { count: "exact", head: true })
        .in("status", ["waiting", "active"]);

      // Total encerrados
      const { count: totalClosed } = await supabase
        .from("chat_rooms")
        .select("*", { count: "exact", head: true })
        .eq("status", "closed");

      // Total de apoiadoras
      const { count: totalSupporters } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("user_type", "supporter");

      setNetworkStats({
        callsToday: callsToday || 0,
        activeNow: activeNow || 0,
        totalClosed: totalClosed || 0,
        totalSupporters: totalSupporters || 0,
        avgResponseTime: 0, // Placeholder
      });
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    }
  };

  const loadContacts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("trusted_contacts")
        .select("*")
        .eq("user_id", profileId)
        .order("priority_level", { ascending: false })
        .order("name");

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error("Erro ao carregar contatos:", error);
      toast.error("Erro ao carregar contatos");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setRelationship("");
    setPhone("");
    setEmail("");
    setNotes("");
    setPriorityLevel("1");
    setEditingContact(null);
  };

  const handleOpenDialog = (contact?: TrustedContact) => {
    if (contact) {
      setEditingContact(contact);
      setName(contact.name);
      setRelationship(contact.relationship || "");
      setPhone(contact.phone || "");
      setEmail(contact.email || "");
      setNotes(contact.notes || "");
      setPriorityLevel(contact.priority_level.toString());
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }

    try {
      setLoading(true);

      if (editingContact) {
        // Atualizar contato existente
        const { error } = await supabase
          .from("trusted_contacts")
          .update({
            name: name.trim(),
            relationship: relationship.trim() || null,
            phone: phone.trim() || null,
            email: email.trim() || null,
            notes: notes.trim() || null,
            priority_level: parseInt(priorityLevel),
          })
          .eq("id", editingContact.id);

        if (error) throw error;
        toast.success("Contato atualizado!");
      } else {
        // Criar novo contato
        const { error } = await supabase.from("trusted_contacts").insert([
          {
            user_id: profileId,
            name: name.trim(),
            relationship: relationship.trim() || null,
            phone: phone.trim() || null,
            email: email.trim() || null,
            notes: notes.trim() || null,
            priority_level: parseInt(priorityLevel),
            can_receive_alerts: true,
          },
        ]);

        if (error) throw error;
        toast.success("Contato adicionado à sua rede!");
      }

      setDialogOpen(false);
      resetForm();
      loadContacts();
    } catch (error) {
      console.error("Erro ao salvar contato:", error);
      toast.error("Erro ao salvar contato");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este contato?")) return;

    try {
      const { error } = await supabase.from("trusted_contacts").delete().eq("id", id);

      if (error) throw error;

      toast.success("Contato removido");
      loadContacts();
    } catch (error) {
      console.error("Erro ao deletar:", error);
      toast.error("Erro ao remover contato");
    }
  };

  const handleSendAlert = async (contact?: TrustedContact) => {
    if (!contact && contacts.length === 0) {
      toast.error("Adicione contatos primeiro");
      return;
    }

    try {
      const alertMessage = "ALERTA DE EMERGÊNCIA: Preciso de ajuda! Por favor, entre em contato comigo o mais rápido possível.";
      
      // Se tem contato específico, envia só para ele
      const contactsToAlert = contact ? [contact] : contacts.filter(c => c.can_receive_alerts);

      if (contactsToAlert.length === 0) {
        toast.error("Nenhum contato disponível para receber alertas");
        return;
      }

      // Registrar alertas no banco
      const alerts = contactsToAlert.map(c => ({
        user_id: profileId,
        contact_id: c.id,
        contact_name: c.name,
        contact_phone: c.phone,
        alert_type: "sos",
        message: alertMessage,
        status: "sent",
      }));

      const { error } = await supabase.from("emergency_alerts").insert(alerts);

      if (error) throw error;

      toast.success(
        contact 
          ? `Alerta enviado para ${contact.name}!` 
          : `Alerta enviado para ${contactsToAlert.length} contato(s)!`,
        {
          description: "Em uma situação real, seus contatos seriam notificados por SMS/WhatsApp",
          duration: 5000,
        }
      );

      // Em produção, aqui iria a integração com API de SMS/WhatsApp
      console.log("Alertas enviados:", alerts);
    } catch (error) {
      console.error("Erro ao enviar alerta:", error);
      toast.error("Erro ao enviar alerta");
    }
  };

  const getPriorityColor = (level: number): string => {
    if (level >= 4) return "bg-red-500";
    if (level >= 3) return "bg-orange-500";
    if (level >= 2) return "bg-yellow-500";
    return "bg-blue-500";
  };

  const getPriorityLabel = (level: number): string => {
    if (level >= 4) return "Crítico";
    if (level >= 3) return "Alto";
    if (level >= 2) return "Médio";
    return "Normal";
  };

  // View para Apoiadoras
  if (userProfile === "supporter") {
    const total = networkStats.callsToday + networkStats.totalClosed;
    const activePercent = total > 0 ? (networkStats.activeNow / total) * 100 : 0;
    const closedPercent = total > 0 ? (networkStats.totalClosed / total) * 100 : 0;

    return (
      <div className="space-y-6">
        <div className="text-center space-y-4 mb-8">
          <Heart className="w-16 h-16 mx-auto text-primary" />
          <h2 className="text-2xl font-bold">Rede Ativa</h2>
          <p className="text-muted-foreground">Estatísticas e apoiadoras conectadas</p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/10 p-3 rounded-full">
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{networkStats.callsToday}</p>
                <p className="text-xs text-muted-foreground">Chamados Hoje</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-500/10 p-3 rounded-full">
                <Activity className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{networkStats.activeNow}</p>
                <p className="text-xs text-muted-foreground">Ativos Agora</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-500/10 p-3 rounded-full">
                <CheckCircle className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{networkStats.totalClosed}</p>
                <p className="text-xs text-muted-foreground">Encerrados</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500/10 p-3 rounded-full">
                <Users className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{networkStats.totalSupporters}</p>
                <p className="text-xs text-muted-foreground">Apoiadoras</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Gráfico de Barras Discreto */}
        <Card className="p-6">
          <h3 className="font-semibold mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Distribuição de Chamados
          </h3>
          <div className="space-y-4">
            {/* Barra - Ativos */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Ativos</span>
                <span className="font-semibold text-green-600">{networkStats.activeNow}</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(activePercent, 100)}%` }}
                />
              </div>
            </div>

            {/* Barra - Encerrados */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Encerrados</span>
                <span className="font-semibold text-purple-600">{networkStats.totalClosed}</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(closedPercent, 100)}%` }}
                />
              </div>
            </div>

            {/* Barra - Hoje */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Chamados Hoje</span>
                <span className="font-semibold text-blue-600">{networkStats.callsToday}</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${networkStats.callsToday > 0 ? '100' : '0'}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Gráfico de Pizza Discreto */}
        <Card className="p-6">
          <h3 className="font-semibold mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Status da Rede
          </h3>
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Gráfico Circular Discreto */}
            <div className="relative w-40 h-40">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                {/* Fundo */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                />
                {/* Ativos (verde) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="12"
                  strokeDasharray={`${activePercent * 2.51} 251`}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
                {/* Encerrados (roxo) - começa após ativos */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="12"
                  strokeDasharray={`${closedPercent * 2.51} 251`}
                  strokeDashoffset={`-${activePercent * 2.51}`}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold">{total}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </div>

            {/* Legenda */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Ativos</p>
                  <p className="text-xs text-muted-foreground">{networkStats.activeNow} chamados em andamento</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-purple-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Encerrados</p>
                  <p className="text-xs text-muted-foreground">{networkStats.totalClosed} chamados finalizados</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded bg-gray-300" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Aguardando</p>
                  <p className="text-xs text-muted-foreground">Nenhum chamado esperando</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* ONGs Parceiras */}
        {organizations.length > 0 && (
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">ONGs Parceiras ({organizations.length})</h3>
            </div>
            <div className="grid gap-3">
              {organizations.map((org) => (
                <div key={org.id} className="flex justify-between items-center p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <p className="font-medium">{org.name}</p>
                  {org.phone && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={`tel:${org.phone}`}>
                        <Phone className="w-4 h-4 mr-2" />
                        Ligar
                      </a>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    );
  }

  // View para Vítimas (User)
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4 mb-8">
        <Users className="w-16 h-16 mx-auto text-primary" />
        <h2 className="text-2xl font-bold">Minha Rede de Apoio</h2>
        <p className="text-muted-foreground">Pessoas de confiança que podem te ajudar</p>
      </div>

      {/* Botão SOS */}
      {contacts.length > 0 && (
        <Button
          variant="emergency"
          size="lg"
          className="w-full h-16 text-lg"
          onClick={() => handleSendAlert()}
        >
          <Bell className="w-5 h-5 mr-2" />
          Enviar SOS para Minha Rede
        </Button>
      )}

      {/* Lista de Contatos */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Contatos de Confiança ({contacts.length})</h3>
          <Button onClick={() => handleOpenDialog()} size="sm">
            <UserPlus className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
        </div>

        {loading && <p className="text-center text-muted-foreground py-4">Carregando...</p>}

        {!loading && contacts.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground mb-2">Nenhum contato ainda</p>
            <p className="text-sm text-muted-foreground mb-4">
              Adicione pessoas de confiança para receber alertas de emergência
            </p>
            <Button onClick={() => handleOpenDialog()}>
              <UserPlus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Contato
            </Button>
          </div>
        )}

        {!loading && contacts.length > 0 && (
          <div className="space-y-3">
            {contacts.map((contact) => (
              <Card key={contact.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{contact.name}</h4>
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(contact.priority_level)}`} />
                      <span className="text-xs text-muted-foreground">
                        {getPriorityLabel(contact.priority_level)}
                      </span>
                    </div>

                    {contact.relationship && (
                      <p className="text-sm text-muted-foreground mb-1">{contact.relationship}</p>
                    )}

                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {contact.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span>{contact.phone}</span>
                        </div>
                      )}
                      {contact.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <span>{contact.email}</span>
                        </div>
                      )}
                    </div>

                    {contact.notes && (
                      <p className="text-xs text-muted-foreground mt-2 italic">{contact.notes}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendAlert(contact)}
                    >
                      <AlertCircle className="w-3 h-3 mr-1" />
                      SOS
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDialog(contact)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(contact.id)}
                    >
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {/* Dialog de Adicionar/Editar Contato */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingContact ? "Editar Contato" : "Adicionar Contato de Confiança"}
            </DialogTitle>
            <DialogDescription>
              Adicione pessoas que podem te ajudar em situações de emergência
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Maria Silva"
                required
              />
            </div>

            <div>
              <Label htmlFor="relationship">Relação</Label>
              <Input
                id="relationship"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                placeholder="Ex: Amiga, Irmã, Terapeuta"
              />
            </div>

            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemplo.com"
              />
            </div>

            <div>
              <Label htmlFor="priority">Prioridade</Label>
              <Select value={priorityLevel} onValueChange={setPriorityLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Normal</SelectItem>
                  <SelectItem value="2">Médio</SelectItem>
                  <SelectItem value="3">Alto</SelectItem>
                  <SelectItem value="4">Crítico</SelectItem>
                  <SelectItem value="5">Máximo</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Contatos com maior prioridade são alertados primeiro
              </p>
            </div>

            <div>
              <Label htmlFor="notes">Notas (opcional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Informações adicionais..."
                rows={2}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Salvando..." : editingContact ? "Atualizar" : "Adicionar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
