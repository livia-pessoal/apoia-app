import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Video, CheckCircle2, Clock } from "lucide-react";
import { Mission } from "@/hooks/useMissions";

interface MissionCardProps {
  mission: Mission;
  onStart: (mission: Mission) => void;
}

export const MissionCard = ({ mission, onStart }: MissionCardProps) => {
  const isVideo = mission.content_type === 'video';
  const icon = isVideo ? Video : BookOpen;
  const Icon = icon;

  return (
    <Card className={`hover:shadow-lg transition-all ${mission.completed ? 'border-success bg-success/5' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={isVideo ? "default" : "secondary"} className="text-xs">
                {isVideo ? 'Vídeo' : 'Texto'}
              </Badge>
              {mission.completed && (
                <Badge variant="outline" className="text-success border-success">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Completo
                </Badge>
              )}
            </div>
            <CardTitle className="text-base leading-tight">
              {mission.mission_number}. {mission.title}
            </CardTitle>
          </div>
          <div className={`p-2 rounded-lg ${isVideo ? 'bg-primary/10' : 'bg-secondary'}`}>
            <Icon className={`w-5 h-5 ${isVideo ? 'text-primary' : 'text-foreground'}`} />
          </div>
        </div>
        <CardDescription className="flex items-center gap-1 text-xs mt-2">
          <Clock className="w-3 h-3" />
          {mission.duration_minutes} min
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={() => onStart(mission)}
          className="w-full"
          variant={mission.completed ? "outline" : "default"}
        >
          {mission.completed ? 'Revisar' : isVideo ? 'Assistir' : 'Ler'}
        </Button>
      </CardContent>
    </Card>
  );
};
