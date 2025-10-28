import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Phone, Navigation, Locate } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface PoliceStation {
  id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  latitude: number;
  longitude: number;
  hours: string | null;
}

interface InteractiveMapSimpleProps {
  open: boolean;
  onClose: () => void;
}

export function InteractiveMapSimple({ open, onClose }: InteractiveMapSimpleProps) {
  const [stations, setStations] = useState<PoliceStation[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [radius, setRadius] = useState<number>(5000); // 5km
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState<string>("");

  useEffect(() => {
    if (open) {
      loadStations();
      getUserLocation();
    }
  }, [open]);

  const loadStations = async () => {
    try {
      const { data, error } = await supabase
        .from("police_stations")
        .select("*")
        .order("name");

      if (error) throw error;
      setStations(data || []);
    } catch (error) {
      console.error("Erro ao carregar delegacias:", error);
      toast.error("Erro ao carregar delegacias");
    }
  };

  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setLocationError("");
          setLoading(false);
          toast.success("Localização obtida!", {
            description: "Mostrando delegacias próximas a você",
          });
        },
        (error) => {
          console.error("Erro ao obter localização:", error);
          setLocationError("Não foi possível obter sua localização");
          setUserLocation({ lat: -23.5505, lng: -46.6333 }); // São Paulo
          setLoading(false);
          toast.error("Localização não disponível", {
            description: "Mostrando delegacias em São Paulo",
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      setLocationError("Geolocalização não suportada");
      setUserLocation({ lat: -23.5505, lng: -46.6333 });
    }
  };

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
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

  const getStationsInRadius = (): (PoliceStation & { distance: number })[] => {
    if (!userLocation) return stations.map(s => ({ ...s, distance: 0 }));

    return stations
      .map((station) => ({
        ...station,
        distance: calculateDistance(
          userLocation.lat,
          userLocation.lng,
          station.latitude,
          station.longitude
        ),
      }))
      .filter((station) => station.distance <= radius / 1000)
      .sort((a, b) => a.distance - b.distance);
  };

  const handleCall = (phone: string, name: string) => {
    window.location.href = `tel:${phone}`;
    toast.success(`Ligando para ${name}`);
  };

  const handleDirections = (lat: number, lng: number, name: string) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank");
    toast.success(`Abrindo direções para ${name}`);
  };

  const filteredStations = getStationsInRadius();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Rede de Apoio Próxima
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Controles */}
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={getUserLocation}
                disabled={loading}
              >
                <Locate className="w-4 h-4 mr-2" />
                {loading ? "Localizando..." : "Minha Localização"}
              </Button>
              {userLocation && (
                <Badge variant="outline" className="bg-green-500/10 text-green-700">
                  📍 Localizado
                </Badge>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant={radius === 5000 ? "default" : "outline"}
                size="sm"
                onClick={() => setRadius(5000)}
              >
                5km
              </Button>
              <Button
                variant={radius === 10000 ? "default" : "outline"}
                size="sm"
                onClick={() => setRadius(10000)}
              >
                10km
              </Button>
              <Button
                variant={radius === 20000 ? "default" : "outline"}
                size="sm"
                onClick={() => setRadius(20000)}
              >
                20km
              </Button>
            </div>
          </div>

          {locationError && (
            <Card className="p-3 bg-yellow-500/10 border-yellow-500/20">
              <p className="text-sm text-yellow-700">{locationError}</p>
            </Card>
          )}

          {/* Informação de localização */}
          {userLocation && (
            <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <div className="text-center space-y-2">
                <MapPin className="w-12 h-12 mx-auto text-primary" />
                <h3 className="font-semibold text-sm">📍 Sua Localização Detectada</h3>
                <p className="text-xs text-muted-foreground">
                  Mostrando locais de apoio próximos a você
                </p>
              </div>
            </Card>
          )}
          
          {!userLocation && !loading && (
            <Card className="p-4 bg-yellow-500/10 border-yellow-500/20">
              <div className="text-center space-y-2">
                <MapPin className="w-12 h-12 mx-auto text-yellow-600" />
                <h3 className="font-semibold text-sm">📍 Localização Padrão (São Paulo)</h3>
                <p className="text-xs text-muted-foreground">
                  Para ver locais próximos, permita acesso à sua localização
                </p>
              </div>
            </Card>
          )}

          {/* Lista de locais de apoio */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">
              Locais de apoio no raio de {radius / 1000}km ({filteredStations.length})
            </h3>

            {filteredStations.length === 0 ? (
              <Card className="p-6 text-center">
                <MapPin className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Nenhum local de apoio encontrado neste raio
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Tente aumentar o raio de busca
                </p>
              </Card>
            ) : (
              filteredStations.map((station) => (
                <Card
                  key={station.id}
                  className="p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-4 h-4 text-primary" />
                        <h4 className="font-semibold">{station.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {station.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {station.address}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {station.city} - {station.state}
                      </p>
                      {userLocation && (
                        <p className="text-sm font-semibold text-primary mt-2">
                          📍 {station.distance.toFixed(1)} km de distância
                        </p>
                      )}
                      {station.hours && (
                        <p className="text-xs text-muted-foreground mt-1">
                          ⏰ {station.hours}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleCall(station.phone, station.name)}
                      >
                        <Phone className="w-3 h-3 mr-1" />
                        Ligar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleDirections(
                            station.latitude,
                            station.longitude,
                            station.name
                          )
                        }
                      >
                        <Navigation className="w-3 h-3 mr-1" />
                        Rota
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
