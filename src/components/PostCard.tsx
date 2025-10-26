import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Trash2, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { AnonymousPost } from "@/hooks/useAnonymousPosts";

interface PostCardProps {
  post: AnonymousPost;
  isUserPost?: boolean;
  userHasSupported: boolean;
  onToggleSupport: (postId: string) => void;
  onOpenComments: (post: AnonymousPost) => void;
  onDelete?: (postId: string) => void;
}

export function PostCard({
  post,
  isUserPost = false,
  userHasSupported,
  onToggleSupport,
  onOpenComments,
  onDelete,
}: PostCardProps) {
  const [showContent, setShowContent] = useState(!post.has_trigger_warning);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!onDelete) return;
    
    if (window.confirm("Tem certeza que deseja deletar este depoimento?")) {
      setIsDeleting(true);
      await onDelete(post.id);
      setIsDeleting(false);
    }
  };

  const timeAgo = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
    locale: ptBR,
  });

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      {/* Header do Post */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-xs text-purple-600 font-medium">
                {post.anonymous_name.split("#")[1]?.slice(0, 2) || "A"}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                {post.anonymous_name}
              </p>
              <p className="text-xs text-gray-500">{timeAgo}</p>
            </div>
          </div>
        </div>

        {/* Botão Deletar (só para posts próprios) */}
        {isUserPost && onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-gray-400 hover:text-red-500 h-8 w-8 p-0"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Aviso de Conteúdo Sensível */}
      {post.has_trigger_warning && !showContent && (
        <div className="mb-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-orange-800">
                Conteúdo Sensível
              </p>
              {post.trigger_warning_text && (
                <p className="text-xs text-orange-600 mt-1">
                  {post.trigger_warning_text}
                </p>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowContent(true)}
                className="mt-2 text-xs h-7"
              >
                <Eye className="w-3 h-3 mr-1" />
                Ver depoimento
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo do Post */}
      {showContent && (
        <>
          {post.has_trigger_warning && (
            <div className="flex items-center gap-1 mb-2">
              <AlertTriangle className="w-3 h-3 text-orange-400" />
              <span className="text-xs text-orange-600">Conteúdo sensível</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowContent(false)}
                className="ml-auto h-6 px-2 text-xs"
              >
                <EyeOff className="w-3 h-3" />
              </Button>
            </div>
          )}

          <p className="text-sm text-gray-700 whitespace-pre-wrap mb-4">
            {post.content}
          </p>
        </>
      )}

      {/* Footer: Contadores e Botões */}
      <div className="flex items-center gap-4 pt-3 border-t">
        {/* Botão de Apoio */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleSupport(post.id)}
          className={`flex items-center gap-2 text-xs h-8 ${
            userHasSupported
              ? "text-purple-600 hover:text-purple-700"
              : "text-gray-500 hover:text-purple-600"
          }`}
        >
          <Heart
            className={`w-4 h-4 ${userHasSupported ? "fill-purple-600" : ""}`}
          />
          <span>{post.support_count}</span>
          <span className="hidden sm:inline">
            {userHasSupported ? "Apoiando" : "Apoiar"}
          </span>
        </Button>

        {/* Botão de Comentários */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onOpenComments(post)}
          className="flex items-center gap-2 text-xs text-gray-500 hover:text-blue-600 h-8"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{post.comment_count}</span>
          <span className="hidden sm:inline">Comentários</span>
        </Button>
      </div>

      {/* Badge de "Meu Post" (se for) */}
      {isUserPost && (
        <div className="mt-2">
          <Badge variant="outline" className="text-xs text-purple-600 border-purple-300">
            Seu depoimento
          </Badge>
        </div>
      )}
    </Card>
  );
}
