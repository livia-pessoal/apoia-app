import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, Lock } from "lucide-react";

interface CreatePostDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (
    content: string,
    hasTriggerWarning: boolean,
    triggerWarningText: string | null
  ) => Promise<boolean>;
}

export function CreatePostDialog({
  open,
  onClose,
  onCreate,
}: CreatePostDialogProps) {
  const [content, setContent] = useState("");
  const [hasTriggerWarning, setHasTriggerWarning] = useState(false);
  const [triggerWarningText, setTriggerWarningText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      return;
    }

    setIsSubmitting(true);
    const success = await onCreate(
      content,
      hasTriggerWarning,
      hasTriggerWarning ? triggerWarningText : null
    );

    if (success) {
      // Limpar formulário
      setContent("");
      setHasTriggerWarning(false);
      setTriggerWarningText("");
      onClose();
    }

    setIsSubmitting(false);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setContent("");
      setHasTriggerWarning(false);
      setTriggerWarningText("");
      onClose();
    }
  };

  const charCount = content.length;
  const maxChars = 2000;
  const isOverLimit = charCount > maxChars;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Compartilhar seu Depoimento</DialogTitle>
          <DialogDescription>
            Seu depoimento será publicado de forma anônima. Você não está sozinha.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Textarea do Depoimento */}
          <div>
            <Label htmlFor="content" className="text-sm font-medium">
              Seu depoimento *
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Conte sua história, compartilhe seus sentimentos ou peça apoio..."
              className="mt-1 min-h-[150px] resize-none"
              disabled={isSubmitting}
            />
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-gray-500">
                {charCount} / {maxChars} caracteres
              </p>
              {isOverLimit && (
                <p className="text-xs text-red-500">
                  Limite de caracteres excedido
                </p>
              )}
            </div>
          </div>

          {/* Switch: Conteúdo Sensível */}
          <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="trigger-warning" className="text-sm font-medium">
                  Este depoimento contém conteúdo sensível
                </Label>
                <Switch
                  id="trigger-warning"
                  checked={hasTriggerWarning}
                  onCheckedChange={setHasTriggerWarning}
                  disabled={isSubmitting}
                />
              </div>
              <p className="text-xs text-gray-600">
                Marque se seu depoimento menciona violência, trauma ou situações
                difíceis
              </p>

              {/* Input: Descrição do Aviso */}
              {hasTriggerWarning && (
                <div className="mt-2">
                  <Input
                    placeholder="Ex: violência física, trauma psicológico..."
                    value={triggerWarningText}
                    onChange={(e) => setTriggerWarningText(e.target.value)}
                    className="text-sm"
                    disabled={isSubmitting}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Info: Anonimato */}
          <div className="flex items-start gap-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <Lock className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-purple-900">
                Seu depoimento será totalmente anônimo
              </p>
              <p className="text-xs text-purple-700 mt-1">
                Ninguém saberá quem você é. Um nome aleatório será gerado para você.
              </p>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !content.trim() || isOverLimit}
              className="flex-1"
            >
              {isSubmitting ? "Publicando..." : "Publicar Anonimamente"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
