import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, BookOpen, Video, X } from "lucide-react";
import { Mission } from "@/hooks/useMissions";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MissionReaderProps {
  mission: Mission | null;
  open: boolean;
  onClose: () => void;
  onComplete: (missionId: string) => void;
}

export const MissionReader = ({ mission, open, onClose, onComplete }: MissionReaderProps) => {
  if (!mission) return null;

  const isVideo = mission.content_type === 'video';

  // Extrair ID do YouTube
  const getYouTubeEmbedUrl = (url: string) => {
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    if (videoIdMatch) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
    }
    return url;
  };

  const handleComplete = () => {
    onComplete(mission.id);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={isVideo ? "default" : "secondary"}>
                  {isVideo ? (
                    <>
                      <Video className="w-3 h-3 mr-1" />
                      Vídeo
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-3 h-3 mr-1" />
                      Texto
                    </>
                  )}
                </Badge>
                <Badge variant="outline">
                  <Clock className="w-3 h-3 mr-1" />
                  {mission.duration_minutes} min
                </Badge>
                {mission.completed && (
                  <Badge variant="outline" className="text-success border-success">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Completo
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-xl leading-tight pr-8">
                {mission.title}
              </DialogTitle>
              <DialogDescription className="text-sm mt-1">
                {mission.module_title} · Missão {mission.mission_number}
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="shrink-0"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-200px)] px-6">
          {isVideo ? (
            <div className="space-y-4">
              {mission.video_platform === 'youtube' ? (
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    src={getYouTubeEmbedUrl(mission.video_url || '')}
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={mission.title}
                  />
                </div>
              ) : (
                <div className="bg-muted p-8 rounded-lg text-center">
                  <Video className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Clique no botão abaixo para assistir ao vídeo
                  </p>
                  <Button
                    onClick={() => window.open(mission.video_url, '_blank')}
                    variant="default"
                  >
                    Assistir Vídeo
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="prose prose-sm max-w-none">
              <p className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {mission.content}
              </p>
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="p-6 pt-4 border-t">
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Fechar
            </Button>
            {!mission.completed && (
              <Button
                onClick={handleComplete}
                className="flex-1"
                variant="default"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Marcar como Completo
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
