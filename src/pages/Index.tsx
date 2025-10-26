import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Users, Shield, Bell, User, Phone, MapPin, MessageCircle, FileText, Heart, Sparkles, Trophy } from "lucide-react";
import { HeroSection } from "@/components/sections/HeroSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import { useOrganizations } from "@/hooks/useOrganizations";
import { useMissions, Mission } from "@/hooks/useMissions";
import { useNotifications } from "@/hooks/useNotifications";
import { supabase } from "@/lib/supabase";
import { MissionCard } from "@/components/MissionCard";
import { MissionReader } from "@/components/MissionReader";
import { ProgressStats } from "@/components/ProgressStats";
import { IncidentReport } from "@/components/IncidentReport";
import { PoliceMap } from "@/components/PoliceMap";
import { InteractiveMapSimple } from "@/components/InteractiveMapSimple";
import { AnonymousChat } from "@/components/AnonymousChat";
import { SupporterDashboard } from "@/components/SupporterDashboard";
import { SupportNetwork } from "@/components/SupportNetwork";
import { NotificationsTab } from "@/components/NotificationsTab";
import { ProfileTab } from "@/components/ProfileTab";
import AchievementsTab from "@/components/AchievementsTabMelhorado";
import { AnonymousPosts } from "@/components/AnonymousPosts";
import { EmergencyFAB } from "@/components/EmergencyFAB";
import { Logo } from "@/components/Logo";

const Index = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<"user" | "supporter" | null>(null);
  const [displayName, setDisplayName] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("home");
  const { organizations, loading } = useOrganizations();
  
  // Sistema de Missões
  const { missions, completeMission, getMissionsByModule, getStats } = useMissions();
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [missionReaderOpen, setMissionReaderOpen] = useState(false);
  
  // Recursos de Emergência
  const [incidentReportOpen, setIncidentReportOpen] = useState(false);
  const [policeMapOpen, setPoliceMapOpen] = useState(false);
  const [interactiveMapOpen, setInteractiveMapOpen] = useState(false);
  const [anonymousChatOpen, setAnonymousChatOpen] = useState(false);
  const [hasActiveChat, setHasActiveChat] = useState(false);
  const [activeChatStatus, setActiveChatStatus] = useState<'waiting' | 'active' | null>(null);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  
  const stats = getStats();
  
  // Sistema de Notificações
  const profileId = localStorage.getItem("profile_id");
  const notificationsHook = useNotifications(profileId);
  const { unreadCount } = notificationsHook;

  useEffect(() => {
    const profile = localStorage.getItem("userProfile") as "user" | "supporter" | null;
    const name = localStorage.getItem("display_name") || "";
    
    if (!profile) {
      navigate("/");
    } else {
      setUserProfile(profile);
      setDisplayName(name);
      
      // Verificar se há chat ativo (apenas para vítimas)
      if (profile === "user") {
        checkActiveChat();
        
        // Atualizar periodicamente (a cada 30 segundos)
        const interval = setInterval(() => {
          if (!anonymousChatOpen) { // Só atualiza se chat não estiver aberto
            checkActiveChat();
          }
        }, 30000);

        return () => clearInterval(interval);
      }
    }
  }, [navigate, anonymousChatOpen]);

  // Função para verificar chat ativo
  const checkActiveChat = async () => {
    try {
      const profileId = localStorage.getItem("profile_id");
      if (!profileId) return;

      const { data, error } = await supabase
        .from("chat_rooms")
        .select("id, status, supporter_id")
        .eq("victim_id", profileId)
        .in("status", ["waiting", "active"])
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const room = data[0];
        setHasActiveChat(true);
        setActiveChatStatus(room.status as 'waiting' | 'active');

        // Se chat está ativo, verificar se há mensagens não lidas da apoiadora
        if (room.status === 'active' && room.supporter_id) {
          const { data: lastMessage } = await supabase
            .from("chat_messages")
            .select("sender_id")
            .eq("room_id", room.id)
            .order("created_at", { ascending: false })
            .limit(1);

          if (lastMessage && lastMessage.length > 0) {
            // Se última mensagem foi da apoiadora, mostrar como aguardando resposta
            const isFromSupporter = lastMessage[0].sender_id === room.supporter_id;
            setHasUnreadMessages(isFromSupporter);
          } else {
            setHasUnreadMessages(false);
          }
        } else {
          setHasUnreadMessages(false);
        }
      } else {
        setHasActiveChat(false);
        setActiveChatStatus(null);
        setHasUnreadMessages(false);
      }
    } catch (error) {
      console.error("Erro ao verificar chat ativo:", error);
    }
  };

  const handleEmergency = async () => {
    try {
      const profileId = localStorage.getItem('profile_id');
      
      // Criar registro no banco de dados
      const { data, error } = await supabase
        .from('emergency_calls')
        .insert([
          {
            user_id: profileId,
            status: 'active',
            message: 'Chamado de emergência - 180'
          }
        ])
        .select();

      if (error) {
        console.error('Erro ao criar chamado:', error);
        toast.error("Erro ao registrar chamado");
      } else {
        console.log('✅ Chamado criado:', data);
        toast.success("Chamado registrado! Ligando para 180...", {
          duration: 5000,
        });
      }
    } catch (err) {
      console.error('Erro:', err);
      toast.error("Erro ao criar chamado");
    }
  };

  const handleCallOrganization = async (orgName: string, phone: string) => {
    try {
      const profileId = localStorage.getItem('profile_id');
      
      // Criar registro no banco
      const { data, error } = await supabase
        .from('emergency_calls')
        .insert([
          {
            user_id: profileId,
            status: 'active',
            message: `Chamado para ${orgName} (${phone})`
          }
        ])
        .select();

      if (error) {
        console.error('Erro ao criar chamado:', error);
        toast.error("Erro ao registrar chamado");
      } else {
        console.log('✅ Chamado criado:', data);
        toast.success(`Chamado registrado! Ligando para ${phone}...`);
      }
    } catch (err) {
      console.error('Erro:', err);
      toast.error("Erro ao criar chamado");
    }
  };

  const handleStartMission = (mission: Mission) => {
    setSelectedMission(mission);
    setMissionReaderOpen(true);
  };

  const handleCompleteMission = (missionId: string) => {
    completeMission(missionId);
    toast.success("✅ Missão concluída! Continue seu aprendizado 💜");
  };

  const handleQuickExit = () => {
    navigate("/");
    localStorage.removeItem("userProfile");
    localStorage.removeItem("display_name");
    localStorage.removeItem("profile_id");
  };

  if (!userProfile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-3">
              {/* Logo APOIA - bem pequena e discreta */}
              <Logo size="xs" />
              <div>
                <h1 className="text-lg font-semibold text-foreground">
                  {displayName ? `Olá, ${displayName}! 💜` : userProfile === "user" ? "Meu Espaço" : "Apoio Ativo"}
                </h1>
                {displayName && (
                  <p className="text-xs text-muted-foreground">
                    {userProfile === "user" ? "Meu Espaço" : "Apoio Ativo"}
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleQuickExit}
              className="text-xs"
            >
              Saída Rápida
            </Button>
          </div>
          <TabsList className="w-full h-14 bg-transparent justify-around rounded-none">
            <TabsTrigger value="home" className="flex-1 data-[state=active]:bg-primary/10">
              <Home className="w-5 h-5" />
            </TabsTrigger>
            <TabsTrigger value="network" className="flex-1 data-[state=active]:bg-primary/10">
              <Users className="w-5 h-5" />
            </TabsTrigger>
            <TabsTrigger value="emergency" className="flex-1 data-[state=active]:bg-primary/10">
              <Shield className="w-5 h-5" />
            </TabsTrigger>
            <TabsTrigger value="missions" className="flex-1 data-[state=active]:bg-primary/10">
              <Sparkles className="w-5 h-5" />
            </TabsTrigger>
            <TabsTrigger value="community" className="flex-1 data-[state=active]:bg-primary/10">
              <MessageCircle className="w-5 h-5" />
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex-1 data-[state=active]:bg-primary/10">
              <Trophy className="w-5 h-5" />
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex-1 data-[state=active]:bg-primary/10 relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex-1 data-[state=active]:bg-primary/10">
              <User className="w-5 h-5" />
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="home" className="animate-fade-in">
          <HeroSection />
          <StatsSection />
          <FeaturesSection 
            onFortalecimentoClick={() => setActiveTab("missions")}
            onProtecaoClick={() => setActiveTab("emergency")}
            onRedeApioClick={() => setActiveTab("network")}
          />
        </TabsContent>

        {/* Tab Fortalecimento - Missões Educativas */}
        <TabsContent value="missions" className="px-6 py-8 animate-fade-in">
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Fortalecimento e Conhecimento</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Missões Educativas
              </h2>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                Aprenda sobre seus direitos, reconheça sinais de violência e fortaleça sua autonomia
              </p>
            </div>

            {/* Estatísticas de Progresso */}
            <ProgressStats 
              total={stats.total}
              completed={stats.completed}
              remaining={stats.remaining}
              percentage={stats.percentage}
            />

            {/* Módulos de Missões */}
            <Accordion type="single" collapsible className="space-y-4">
              {/* Módulo 1 */}
              <AccordionItem value="module-1" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Shield className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Módulo 1: Reconhecendo os Sinais da Violência</h3>
                      <p className="text-xs text-muted-foreground">
                        {getMissionsByModule(1).filter(m => m.completed).length} de {getMissionsByModule(1).length} completas
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    {getMissionsByModule(1).map((mission) => (
                      <MissionCard
                        key={mission.id}
                        mission={mission}
                        onStart={handleStartMission}
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Módulo 2 */}
              <AccordionItem value="module-2" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <div className="bg-accent/10 p-2 rounded-lg">
                      <Heart className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Módulo 2: Reagindo e Buscando Ajuda</h3>
                      <p className="text-xs text-muted-foreground">
                        {getMissionsByModule(2).filter(m => m.completed).length} de {getMissionsByModule(2).length} completas
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    {getMissionsByModule(2).map((mission) => (
                      <MissionCard
                        key={mission.id}
                        mission={mission}
                        onStart={handleStartMission}
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Módulo 3 */}
              <AccordionItem value="module-3" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <div className="bg-success/10 p-2 rounded-lg">
                      <Sparkles className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Módulo 3: Autoconhecimento e Fortalecimento</h3>
                      <p className="text-xs text-muted-foreground">
                        {getMissionsByModule(3).filter(m => m.completed).length} de {getMissionsByModule(3).length} completas
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    {getMissionsByModule(3).map((mission) => (
                      <MissionCard
                        key={mission.id}
                        mission={mission}
                        onStart={handleStartMission}
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Módulo 4 */}
              <AccordionItem value="module-4" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    <div className="bg-destructive/10 p-2 rounded-lg">
                      <FileText className="w-5 h-5 text-destructive" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Módulo 4: Conhecendo seus Direitos</h3>
                      <p className="text-xs text-muted-foreground">
                        {getMissionsByModule(4).filter(m => m.completed).length} de {getMissionsByModule(4).length} completas
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    {getMissionsByModule(4).map((mission) => (
                      <MissionCard
                        key={mission.id}
                        mission={mission}
                        onStart={handleStartMission}
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Modal de Leitura de Missão */}
          <MissionReader
            mission={selectedMission}
            open={missionReaderOpen}
            onClose={() => setMissionReaderOpen(false)}
            onComplete={handleCompleteMission}
          />
        </TabsContent>

        <TabsContent value="network" className="px-6 py-8 animate-fade-in">
          <SupportNetwork userProfile={userProfile || "user"} />
        </TabsContent>

        <TabsContent value="emergency" className="px-6 py-8 animate-fade-in">
          {userProfile === "user" ? (
            <div className="space-y-6">
              <div className="text-center space-y-4 mb-8">
                <Shield className="w-16 h-16 mx-auto text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Recursos de Emergência</h2>
              </div>

              <Button
                variant="emergency"
                size="lg"
                className="w-full h-20 text-xl"
                onClick={handleEmergency}
              >
                <Phone className="w-6 h-6 mr-2" />
                Ligar 180 - Central da Mulher
              </Button>

              {/* Organizações do Banco de Dados */}
              {!loading && organizations.length > 0 && (
                <Card className="p-4 bg-primary/5 border-primary/20">
                  <h3 className="font-semibold mb-3 text-primary">📞 Contatos de Emergência</h3>
                  <div className="space-y-2">
                    {organizations.map((org) => (
                      <div key={org.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div>
                          <p className="font-medium text-sm">{org.name}</p>
                          <p className="text-xs text-muted-foreground">{org.type === 'ong' ? 'ONG' : 'Polícia'}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCallOrganization(org.name, org.phone)}
                        >
                          <Phone className="w-3 h-3 mr-1" />
                          {org.phone}
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Card Destacado: Continuar Conversa */}
              {hasActiveChat && (
                <Card 
                  className={`p-6 hover:shadow-lg transition-all cursor-pointer border-2 ${
                    hasUnreadMessages 
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/50 animate-pulse-slow' 
                      : 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30'
                  }`}
                  onClick={() => {
                    setAnonymousChatOpen(true);
                    setHasActiveChat(false); // Limpar após abrir
                    setHasUnreadMessages(false);
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`${
                      hasUnreadMessages ? 'bg-blue-500/30' : 'bg-blue-500/20'
                    } p-3 rounded-full`}>
                      <MessageCircle className="w-6 h-6 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        💬 Continuar Conversa
                        {hasUnreadMessages && (
                          <Badge className="bg-blue-500 hover:bg-blue-600">
                            Aguardando resposta
                          </Badge>
                        )}
                        {!hasUnreadMessages && activeChatStatus === 'active' && (
                          <Badge className="bg-green-500">Ativa</Badge>
                        )}
                        {activeChatStatus === 'waiting' && (
                          <Badge className="bg-orange-500">Aguardando conexão</Badge>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {hasUnreadMessages 
                          ? 'A apoiadora enviou uma nova mensagem'
                          : activeChatStatus === 'active' 
                            ? 'Você tem uma conversa ativa com uma apoiadora'
                            : 'Uma apoiadora está procurando sua conversa'}
                      </p>
                    </div>
                    <div className={`w-3 h-3 ${
                      hasUnreadMessages ? 'bg-blue-500' : 'bg-green-500'
                    } rounded-full animate-pulse`} />
                  </div>
                </Card>
              )}

              <div className="grid grid-cols-1 gap-4">
                <Card 
                  className="p-4 hover:shadow-soft transition-all cursor-pointer bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20"
                  onClick={() => setInteractiveMapOpen(true)}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <h3 className="font-semibold">🗺️ Mapa Interativo</h3>
                      <p className="text-sm text-muted-foreground">Veja delegacias no mapa com sua localização</p>
                    </div>
                  </div>
                </Card>

                <Card 
                  className="p-4 hover:shadow-soft transition-all cursor-pointer"
                  onClick={() => setPoliceMapOpen(true)}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <h3 className="font-semibold">Lista de Delegacias</h3>
                      <p className="text-sm text-muted-foreground">Ver lista completa com contatos</p>
                    </div>
                  </div>
                </Card>

                <Card 
                  className="p-4 hover:shadow-soft transition-all cursor-pointer"
                  onClick={() => setAnonymousChatOpen(true)}
                >
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    <div>
                      <h3 className="font-semibold">Chat Anônimo</h3>
                      <p className="text-sm text-muted-foreground">Converse com uma apoiadora</p>
                    </div>
                  </div>
                </Card>

                <Card 
                  className="p-4 hover:shadow-soft transition-all cursor-pointer"
                  onClick={() => setIncidentReportOpen(true)}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <div>
                      <h3 className="font-semibold">Registro de Ocorrências</h3>
                      <p className="text-sm text-muted-foreground">Documente de forma segura</p>
                    </div>
                  </div>
                </Card>
              </div>
              
              {/* Modais de Recursos de Emergência */}
              <IncidentReport open={incidentReportOpen} onClose={() => setIncidentReportOpen(false)} />
              <PoliceMap open={policeMapOpen} onClose={() => setPoliceMapOpen(false)} />
              <InteractiveMapSimple open={interactiveMapOpen} onClose={() => setInteractiveMapOpen(false)} />
              <AnonymousChat 
                open={anonymousChatOpen} 
                onClose={() => {
                  setAnonymousChatOpen(false);
                  if (userProfile === "user") {
                    // Atualizar status ao fechar chat
                    setTimeout(() => checkActiveChat(), 500);
                  }
                }} 
              />
            </div>
          ) : (
            <SupporterDashboard profileId={localStorage.getItem("profile_id") || ""} />
          )}
        </TabsContent>

        <TabsContent value="notifications" className="animate-fade-in">
          <NotificationsTab userId={profileId} notificationsHook={notificationsHook} />
        </TabsContent>

        <TabsContent value="community" className="animate-fade-in">
          <AnonymousPosts />
        </TabsContent>

        <TabsContent value="achievements" className="animate-fade-in">
          <AchievementsTab userId={profileId} />
        </TabsContent>

        <TabsContent value="profile" className="animate-fade-in">
          <ProfileTab />
        </TabsContent>
      </Tabs>

      {/* Rodapé discreto com logo */}
      <div className="fixed bottom-2 left-2 z-40">
        <Logo size="xs" className="opacity-30 hover:opacity-50 transition-opacity" />
      </div>

      {/* Botão Flutuante de Emergência (visível em todas as abas) */}
      <EmergencyFAB />
    </div>
  );
};

export default Index;
