import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Clock, Navigation, Search, Map } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface PoliceStation {
  id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  state: string;
  phone: string | null;
  phone_emergency: string | null;
  opening_hours: string | null;
  works_24h: boolean;
  services: string[] | null;
  latitude: number | null;
  longitude: number | null;
}

interface PoliceMapProps {
  open: boolean;
  onClose: () => void;
}

const typeLabels: Record<string, { label: string; color: string }> = {
  // Tipos NOVOS (MAIÚSCULO) - Migration 013
  'DEAM': { label: "DEAM", color: "bg-primary" },
  'CDCM': { label: "CDCM", color: "bg-purple-500" },
  'Centro de Referência': { label: "Centro de Referência", color: "bg-green-500" },
  'Casa da Mulher Brasileira': { label: "Casa da Mulher Brasileira", color: "bg-blue-600" },
  'Centro de Atendimento Integrado': { label: "Atendimento Integrado", color: "bg-blue-500" },
  'Delegacia': { label: "Delegacia", color: "bg-blue-400" },
  'Casa Abrigo': { label: "Casa Abrigo", color: "bg-purple-400" },
  'CRAS': { label: "CRAS", color: "bg-green-400" },
  'ONG': { label: "ONG", color: "bg-orange-500" },
  // Tipos ANTIGOS (minúsculo) - manter por compatibilidade
  deam: { label: "DEAM", color: "bg-primary" },
  delegacia: { label: "Delegacia", color: "bg-blue-500" },
  cras: { label: "CRAS", color: "bg-green-500" },
  casa_abrigo: { label: "Casa Abrigo", color: "bg-purple-500" },
};

const serviceLabels: Record<string, string> = {
  // Serviços em português (novos)
  "Atendimento psicossocial": "Atendimento Psicossocial",
  "Orientação jurídica": "Orientação Jurídica",
  "Oficinas": "Oficinas e Grupos",
  "Grupos de apoio": "Grupos de Apoio",
  "Cursos profissionalizantes": "Cursos Profissionalizantes",
  "Registro de B.O.": "Boletim de Ocorrência",
  "Medidas protetivas": "Medida Protetiva",
  "Investigação": "Investigação",
  "Atendimento 24h": "Atendimento 24h",
  "Atendimento especializado": "Atendimento Especializado",
  "Atendimento integrado": "Atendimento Integrado",
  "Delegacia": "Delegacia",
  "Defensoria": "Defensoria Pública",
  "Juizado": "Juizado Especializado",
  "Psicologia": "Atendimento Psicológico",
  "Abrigo provisório": "Abrigo Provisório",
  "Encaminhamento": "Encaminhamento",
  "Cursos": "Cursos",
  "Assistência social": "Assistência Social",
  "Oficinas terapêuticas": "Oficinas Terapêuticas",
  "Atendimento social": "Atendimento Social",
  "Orientação psicológica": "Orientação Psicológica",
  "Encaminhamento jurídico": "Encaminhamento Jurídico",
  "Grupos terapêuticos": "Grupos Terapêuticos",
  "Grupos de reflexão": "Grupos de Reflexão",
  "Articulação com rede": "Articulação em Rede",
  // Serviços antigos (snake_case) - manter por compatibilidade
  atendimento_mulher: "Atendimento Especializado",
  boletim_ocorrencia: "Boletim de Ocorrência",
  medida_protetiva: "Medida Protetiva",
  orientacao_juridica: "Orientação Jurídica",
  psicologia: "Atendimento Psicológico",
  assistencia_social: "Assistência Social",
  encaminhamento: "Encaminhamento",
  atendimento_psicossocial: "Atendimento Psicossocial",
  acolhimento: "Acolhimento",
  protecao: "Proteção",
};

export function PoliceMap({ open, onClose }: PoliceMapProps) {
  const [stations, setStations] = useState<PoliceStation[]>([]);
  const [filteredStations, setFilteredStations] = useState<PoliceStation[]>([]);
  const [selectedStation, setSelectedStation] = useState<PoliceStation | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchCity, setSearchCity] = useState("São Paulo");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (open) {
      loadStations();
      getUserLocation();
    }
  }, [open]);

  useEffect(() => {
    filterStations();
  }, [stations, searchCity]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log("Erro ao obter localização:", error);
        }
      );
    }
  };

  const loadStations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("police_stations")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (error) throw error;

      setStations(data || []);
    } catch (error) {
      console.error("Erro ao carregar delegacias:", error);
      toast.error("Erro ao carregar delegacias");
    } finally {
      setLoading(false);
    }
  };

  const filterStations = () => {
    if (!searchCity.trim()) {
      setFilteredStations(stations);
      return;
    }

    const filtered = stations.filter((station) =>
      station.city.toLowerCase().includes(searchCity.toLowerCase())
    );
    setFilteredStations(filtered);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Raio da Terra em km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getStationDistance = (station: PoliceStation): string | null => {
    if (!userLocation || !station.latitude || !station.longitude) return null;

    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      station.latitude,
      station.longitude
    );

    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
  };

  const openInMaps = (station: PoliceStation) => {
    if (station.latitude && station.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`;
      window.open(url, "_blank");
    } else {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${station.name} ${station.address} ${station.city}`
      )}`;
      window.open(url, "_blank");
    }
  };

  const handleCall = (station: PoliceStation) => {
    const phone = station.phone_emergency || station.phone;
    if (phone) {
      toast.success(`Ligando para ${station.name}...`);
      // Em produção, usar: window.location.href = `tel:${phone}`;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Delegacias e Serviços Próximos
          </DialogTitle>
          <DialogDescription>Encontre delegacias especializadas e serviços de apoio</DialogDescription>
        </DialogHeader>

        {/* Sem Detalhes de Estação Selecionada */}
        {!selectedStation ? (
          <div className="space-y-4">
            {/* Busca por Cidade */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  placeholder="Buscar por cidade..."
                  className="pl-10"
                />
              </div>
            </div>

            {/* Legenda de Tipos */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(typeLabels).map(([key, { label, color }]) => (
                <div key={key} className="flex items-center gap-1 text-xs">
                  <div className={`w-3 h-3 rounded-full ${color}`} />
                  <span>{label}</span>
                </div>
              ))}
            </div>

            {/* Lista de Delegacias */}
            {loading ? (
              <p className="text-center text-muted-foreground py-8">Carregando...</p>
            ) : filteredStations.length === 0 ? (
              <Card className="p-8 text-center">
                <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhuma delegacia encontrada</p>
                <p className="text-sm text-muted-foreground mt-2">Tente buscar por outra cidade</p>
              </Card>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {filteredStations.map((station) => {
                  const distance = getStationDistance(station);
                  const typeInfo = typeLabels[station.type] || { label: station.type, color: "bg-gray-500" };

                  return (
                    <Card
                      key={station.id}
                      className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedStation(station)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-3 h-3 rounded-full ${typeInfo.color}`} />
                            <h3 className="font-semibold text-sm">{station.name}</h3>
                            {station.works_24h && (
                              <Badge variant="outline" className="text-xs">
                                24h
                              </Badge>
                            )}
                          </div>

                          <div className="text-xs text-muted-foreground space-y-1">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{station.address}</span>
                            </div>

                            {station.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                <span>{station.phone}</span>
                              </div>
                            )}

                            {station.opening_hours && !station.works_24h && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{station.opening_hours}</span>
                              </div>
                            )}
                          </div>

                          {distance && (
                            <div className="mt-2 flex items-center gap-1 text-xs text-primary">
                              <Navigation className="w-3 h-3" />
                              <span>{distance} de distância</span>
                            </div>
                          )}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openInMaps(station);
                          }}
                        >
                          <Map className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Detalhes da Estação Selecionada */
          <div className="space-y-4">
            {(() => {
              const typeInfo = typeLabels[selectedStation.type] || { label: selectedStation.type, color: "bg-gray-500" };
              return (
                <div className="flex items-start gap-3">
                  <div className={`w-4 h-4 rounded-full mt-1 ${typeInfo.color}`} />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{selectedStation.name}</h3>
                    <p className="text-sm text-muted-foreground">{typeInfo.label}</p>
                  </div>
                </div>
              );
            })()}

            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium mb-1">
                  <MapPin className="w-4 h-4 text-primary" />
                  Endereço
                </div>
                <p className="text-sm ml-6">
                  {selectedStation.address}
                  <br />
                  {selectedStation.city} - {selectedStation.state}
                </p>
              </div>

              {selectedStation.phone && (
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium mb-1">
                    <Phone className="w-4 h-4 text-primary" />
                    Telefone
                  </div>
                  <p className="text-sm ml-6">{selectedStation.phone}</p>
                </div>
              )}

              {selectedStation.phone_emergency && (
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium mb-1">
                    <Phone className="w-4 h-4 text-destructive" />
                    Emergência
                  </div>
                  <p className="text-sm ml-6">{selectedStation.phone_emergency}</p>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 text-sm font-medium mb-1">
                  <Clock className="w-4 h-4 text-primary" />
                  Horário de Funcionamento
                </div>
                <p className="text-sm ml-6">
                  {selectedStation.works_24h ? "24 horas" : selectedStation.opening_hours || "Consultar"}
                </p>
              </div>

              {selectedStation.services && selectedStation.services.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Serviços Oferecidos</p>
                  <div className="flex flex-wrap gap-2 ml-6">
                    {selectedStation.services.map((service) => (
                      <Badge key={service} variant="secondary" className="text-xs">
                        {serviceLabels[service] || service}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setSelectedStation(null)} className="flex-1">
                Voltar
              </Button>
              {selectedStation.phone && (
                <Button onClick={() => handleCall(selectedStation)} className="flex-1">
                  <Phone className="w-4 h-4 mr-2" />
                  Ligar
                </Button>
              )}
              <Button onClick={() => openInMaps(selectedStation)} className="flex-1">
                <Map className="w-4 h-4 mr-2" />
                Ir no Mapa
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
