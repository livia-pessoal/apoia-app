import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { FileText, Plus, Calendar, MapPin, AlertTriangle, Eye, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface IncidentReport {
  id: string;
  title: string;
  description: string;
  incident_date: string;
  incident_location: string;
  incident_type: string;
  severity: string;
  has_witnesses: boolean;
  witnesses_details: string | null;
  has_evidence: boolean;
  evidence_description: string | null;
  police_contacted: boolean;
  police_report_number: string | null;
  status: string;
  created_at: string;
}

interface IncidentReportProps {
  open: boolean;
  onClose: () => void;
}

const incidentTypeLabels: Record<string, string> = {
  fisica: "Violência Física",
  psicologica: "Violência Psicológica",
  sexual: "Violência Sexual",
  patrimonial: "Violência Patrimonial",
  moral: "Violência Moral",
  outro: "Outro",
};

const severityLabels: Record<string, { label: string; color: string }> = {
  baixa: { label: "Baixa", color: "bg-green-500" },
  media: { label: "Média", color: "bg-yellow-500" },
  alta: { label: "Alta", color: "bg-orange-500" },
  critica: { label: "Crítica", color: "bg-red-500" },
};

export function IncidentReport({ open, onClose }: IncidentReportProps) {
  const [view, setView] = useState<"list" | "create" | "detail">("list");
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<IncidentReport | null>(null);
  const [loading, setLoading] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [incidentLocation, setIncidentLocation] = useState("");
  const [incidentType, setIncidentType] = useState("");
  const [severity, setSeverity] = useState("media");
  const [hasWitnesses, setHasWitnesses] = useState(false);
  const [witnessesDetails, setWitnessesDetails] = useState("");
  const [hasEvidence, setHasEvidence] = useState(false);
  const [evidenceDescription, setEvidenceDescription] = useState("");
  const [policeContacted, setPoliceContacted] = useState(false);
  const [policeReportNumber, setPoliceReportNumber] = useState("");

  useEffect(() => {
    if (open && view === "list") {
      loadReports();
    }
  }, [open, view]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const profileId = localStorage.getItem("profile_id");

      const { data, error } = await supabase
        .from("incident_reports")
        .select("*")
        .eq("user_id", profileId)
        .order("incident_date", { ascending: false });

      if (error) throw error;

      setReports(data || []);
    } catch (error) {
      console.error("Erro ao carregar registros:", error);
      toast.error("Erro ao carregar registros");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setIncidentDate("");
    setIncidentLocation("");
    setIncidentType("");
    setSeverity("media");
    setHasWitnesses(false);
    setWitnessesDetails("");
    setHasEvidence(false);
    setEvidenceDescription("");
    setPoliceContacted(false);
    setPoliceReportNumber("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !incidentDate || !incidentType) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      setLoading(true);
      const profileId = localStorage.getItem("profile_id");

      const { error } = await supabase.from("incident_reports").insert([
        {
          user_id: profileId,
          title,
          description,
          incident_date: incidentDate,
          incident_location: incidentLocation,
          incident_type: incidentType,
          severity,
          has_witnesses: hasWitnesses,
          witnesses_details: hasWitnesses ? witnessesDetails : null,
          has_evidence: hasEvidence,
          evidence_description: hasEvidence ? evidenceDescription : null,
          police_contacted: policeContacted,
          police_report_number: policeContacted ? policeReportNumber : null,
          status: "registrado",
        },
      ]);

      if (error) throw error;

      toast.success("Registro criado com sucesso");
      resetForm();
      setView("list");
      loadReports();
    } catch (error) {
      console.error("Erro ao criar registro:", error);
      toast.error("Erro ao criar registro");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este registro?")) return;

    try {
      const { error } = await supabase.from("incident_reports").delete().eq("id", id);

      if (error) throw error;

      toast.success("Registro deletado");
      loadReports();
      if (selectedReport?.id === id) {
        setView("list");
        setSelectedReport(null);
      }
    } catch (error) {
      console.error("Erro ao deletar:", error);
      toast.error("Erro ao deletar registro");
    }
  };

  const handleClose = () => {
    resetForm();
    setView("list");
    setSelectedReport(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Registro de Ocorrências
          </DialogTitle>
          <DialogDescription>
            {view === "list" && "Documente eventos de forma segura e confidencial"}
            {view === "create" && "Preencha as informações sobre o incidente"}
            {view === "detail" && "Detalhes do registro"}
          </DialogDescription>
        </DialogHeader>

        {/* Lista de Registros */}
        {view === "list" && (
          <div className="space-y-4">
            <Button onClick={() => setView("create")} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Novo Registro
            </Button>

            {loading ? (
              <p className="text-center text-muted-foreground py-8">Carregando...</p>
            ) : reports.length === 0 ? (
              <Card className="p-8 text-center">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhum registro ainda</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Crie seu primeiro registro para documentar incidentes
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {reports.map((report) => (
                  <Card
                    key={report.id}
                    className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedReport(report);
                      setView("detail");
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{report.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(report.incident_date), "dd/MM/yyyy", { locale: ptBR })}
                          {report.incident_location && (
                            <>
                              <MapPin className="w-3 h-3 ml-2" />
                              {report.incident_location}
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {incidentTypeLabels[report.incident_type]}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <div className={`w-2 h-2 rounded-full ${severityLabels[report.severity].color}`} />
                            <span className="text-xs">{severityLabels[report.severity].label}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedReport(report);
                          setView("detail");
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Formulário de Criação */}
        {view === "create" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Título do Registro *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Incidente dia 15/10"
                required
              />
            </div>

            <div>
              <Label htmlFor="incident_type">Tipo de Violência *</Label>
              <Select value={incidentType} onValueChange={setIncidentType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(incidentTypeLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="severity">Gravidade *</Label>
              <Select value={severity} onValueChange={setSeverity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(severityLabels).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="incident_date">Data do Incidente *</Label>
              <Input
                id="incident_date"
                type="datetime-local"
                value={incidentDate}
                onChange={(e) => setIncidentDate(e.target.value)}
                max={new Date().toISOString().slice(0, 16)}
                required
              />
            </div>

            <div>
              <Label htmlFor="incident_location">Local (opcional)</Label>
              <Input
                id="incident_location"
                value={incidentLocation}
                onChange={(e) => setIncidentLocation(e.target.value)}
                placeholder="Ex: Residência, Trabalho..."
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição do Ocorrido *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva o que aconteceu..."
                rows={4}
                required
              />
            </div>

            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="has_witnesses">Havia testemunhas?</Label>
                <Switch checked={hasWitnesses} onCheckedChange={setHasWitnesses} id="has_witnesses" />
              </div>

              {hasWitnesses && (
                <Textarea
                  value={witnessesDetails}
                  onChange={(e) => setWitnessesDetails(e.target.value)}
                  placeholder="Descreva as testemunhas..."
                  rows={2}
                />
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="has_evidence">Possui evidências?</Label>
                <Switch checked={hasEvidence} onCheckedChange={setHasEvidence} id="has_evidence" />
              </div>

              {hasEvidence && (
                <Textarea
                  value={evidenceDescription}
                  onChange={(e) => setEvidenceDescription(e.target.value)}
                  placeholder="Descreva as evidências (fotos, mensagens, etc)..."
                  rows={2}
                />
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="police_contacted">Polícia foi contactada?</Label>
                <Switch checked={policeContacted} onCheckedChange={setPoliceContacted} id="police_contacted" />
              </div>

              {policeContacted && (
                <Input
                  value={policeReportNumber}
                  onChange={(e) => setPoliceReportNumber(e.target.value)}
                  placeholder="Número do Boletim de Ocorrência (se houver)"
                />
              )}
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setView("list")} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Salvando..." : "Salvar Registro"}
              </Button>
            </div>
          </form>
        )}

        {/* Detalhes do Registro */}
        {view === "detail" && selectedReport && (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold">{selectedReport.title}</h3>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(selectedReport.id)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <Label className="text-muted-foreground">Tipo de Violência</Label>
                <p className="font-medium">{incidentTypeLabels[selectedReport.incident_type]}</p>
              </div>

              <div>
                <Label className="text-muted-foreground">Gravidade</Label>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${severityLabels[selectedReport.severity].color}`} />
                  <span className="font-medium">{severityLabels[selectedReport.severity].label}</span>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Data do Incidente</Label>
                <p className="font-medium">
                  {format(new Date(selectedReport.incident_date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>

              {selectedReport.incident_location && (
                <div>
                  <Label className="text-muted-foreground">Local</Label>
                  <p className="font-medium">{selectedReport.incident_location}</p>
                </div>
              )}

              <div>
                <Label className="text-muted-foreground">Descrição</Label>
                <p className="text-sm whitespace-pre-wrap">{selectedReport.description}</p>
              </div>

              {selectedReport.has_witnesses && selectedReport.witnesses_details && (
                <div>
                  <Label className="text-muted-foreground">Testemunhas</Label>
                  <p className="text-sm">{selectedReport.witnesses_details}</p>
                </div>
              )}

              {selectedReport.has_evidence && selectedReport.evidence_description && (
                <div>
                  <Label className="text-muted-foreground">Evidências</Label>
                  <p className="text-sm">{selectedReport.evidence_description}</p>
                </div>
              )}

              {selectedReport.police_contacted && (
                <div>
                  <Label className="text-muted-foreground">Boletim de Ocorrência</Label>
                  <p className="text-sm">
                    {selectedReport.police_report_number || "Registrado, sem número informado"}
                  </p>
                </div>
              )}

              <div className="pt-3 border-t">
                <Label className="text-muted-foreground text-xs">Registrado em</Label>
                <p className="text-xs">
                  {format(new Date(selectedReport.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </div>
            </div>

            <Button variant="outline" onClick={() => setView("list")} className="w-full">
              Voltar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
