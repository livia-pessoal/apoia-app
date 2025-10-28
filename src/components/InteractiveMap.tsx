import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import { Icon, LatLngExpression } from "leaflet";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin, Phone, Navigation, ExternalLink, Locate } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import "leaflet/dist/leaflet.css";

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

interface InteractiveMapProps {
  open: boolean;
  onClose: () => void;
}

// Ícone personalizado para a localização do usuário
const userIcon = new Icon({
  iconUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjM0I4MkY2IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjgiLz48L3N2Zz4=",
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15],
});

// Ícone para delegacias
const stationIcon = new Icon({
  iconUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjREMyNjI2IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiPjxwYXRoIGQ9Ik0yMSAxMFYxOUgzVjEwTDEyIDNMMjEgMTBaTTEyIDEyQzEwLjkgMTIgMTAgMTIuOSAxMCAxNEMxMCAxNS4xIDEwLjkgMTYgMTIgMTZDMTMuMSAxNiAxNCAxNS4xIDE0IDE0QzE0IDEyLjkgMTMuMSAxMiAxMiAxMloiLz48L3N2Zz4=",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

// Componente para recentrar o mapa
function RecenterMap({ center }: { center: LatLngExpression }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}

export function InteractiveMap({ open, onClose }: InteractiveMapProps) {
  const [stations, setStations] = useState<PoliceStation[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [selectedStation, setSelectedStation] = useState<PoliceStation | null>(null);
  const [radius, setRadius] = useState<number>(5000); // 5km padrão
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState<string>("");

  // Centro padrão (São Paulo)
  const defaultCenter: [number, number] = [-23.5505, -46.6333];

  useEffect(() => {
    if (open) {
      getUserLocation();
      loadStations();
    }
  }, [open]);

  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setLocationError("");
          setLoading(false);
          toast.success("Localização obtida!", {
            description: "Mostrando delegacias próximas a você",
          });
        },
        (error) => {
          console.error("Erro ao obter localização:", error);
          setLocationError("Não foi possível obter sua localização");
          setUserLocation(defaultCenter);
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
      setUserLocation(defaultCenter);
    }
  };

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

  const getStationsInRadius = (): PoliceStation[] => {
    if (!userLocation) return stations;

    return stations
      .map((station) => ({
        ...station,
        distance: calculateDistance(
          userLocation[0],
          userLocation[1],
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
  const mapCenter = userLocation || defaultCenter;

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

          {/* Mapa */}
          <div className="rounded-lg overflow-hidden border-2 border-border h-[400px]">
            <MapContainer
              center={mapCenter}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <RecenterMap center={mapCenter} />

              {/* Marcador da localização do usuário */}
              {userLocation && (
                <>
                  <Marker position={userLocation} icon={userIcon}>
                    <Popup>
                      <div className="text-center">
                        <p className="font-semibold">📍 Você está aqui</p>
                      </div>
                    </Popup>
                  </Marker>
                  <Circle
                    center={userLocation}
                    radius={radius}
                    pathOptions={{
                      fillColor: "blue",
                      fillOpacity: 0.1,
                      color: "blue",
                      weight: 2,
                    }}
                  />
                </>
              )}

              {/* Marcadores das delegacias */}
              {filteredStations.map((station) => (
                <Marker
                  key={station.id}
                  position={[station.latitude, station.longitude]}
                  icon={stationIcon}
                  eventHandlers={{
                    click: () => setSelectedStation(station),
                  }}
                >
                  <Popup>
                    <div className="min-w-[200px]">
                      <h3 className="font-semibold mb-1">{station.name}</h3>
                      <Badge variant="outline" className="text-xs mb-2">
                        {station.type}
                      </Badge>
                      <p className="text-xs text-muted-foreground mb-2 mt-2">
                        {station.address}
                      </p>
                      {userLocation && (
                        <p className="text-xs font-semibold text-primary mb-2">
                          📍 {calculateDistance(
                            userLocation[0],
                            userLocation[1],
                            station.latitude,
                            station.longitude
                          ).toFixed(1)}{" "}
                          km
                        </p>
                      )}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
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
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Lista de locais de apoio */}
          <div className="space-y-3 max-h-[200px] overflow-y-auto">
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
                  className="p-3 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedStation(station)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm">{station.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {station.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {station.address}
                      </p>
                      {userLocation && (
                        <p className="text-xs font-semibold text-primary mt-1">
                          📍{" "}
                          {calculateDistance(
                            userLocation[0],
                            userLocation[1],
                            station.latitude,
                            station.longitude
                          ).toFixed(1)}{" "}
                          km de distância
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCall(station.phone, station.name);
                        }}
                      >
                        <Phone className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDirections(
                            station.latitude,
                            station.longitude,
                            station.name
                          );
                        }}
                      >
                        <ExternalLink className="w-3 h-3" />
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
