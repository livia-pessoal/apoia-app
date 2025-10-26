import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Trash2, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { AnonymousPost, PostComment } from "@/hooks/useAnonymousPosts";

interface PostCommentsDialogProps {
  open: boolean;
  onClose: () => void;
  post: AnonymousPost | null;
  onLoadComments: (postId: string) => Promise<PostComment[]>;
  onCreateComment: (postId: string, content: string) => Promise<boolean>;
  onDeleteComment: (commentId: string, postId: string) => Promise<boolean>;
}

export function PostCommentsDialog({
  open,
  onClose,
  post,
  onLoadComments,
  onCreateComment,
  onDeleteComment,
}: PostCommentsDialogProps) {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carregar comentários quando o modal abrir
  useEffect(() => {
    if (open && post) {
      loadComments();
    }
  }, [open, post]);

  const loadComments = async () => {
    if (!post) return;

    setIsLoading(true);
    const loadedComments = await onLoadComments(post.id);
    setComments(loadedComments);
    setIsLoading(false);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!post || !newComment.trim()) return;

    setIsSubmitting(true);
    const success = await onCreateComment(post.id, newComment);

    if (success) {
      setNewComment("");
      await loadComments(); // Recarregar comentários
    }

    setIsSubmitting(false);
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!post) return;

    if (window.confirm("Tem certeza que deseja deletar este comentário?")) {
      const success = await onDeleteComment(commentId, post.id);
      if (success) {
        await loadComments(); // Recarregar comentários
      }
    }
  };

  const profileId = localStorage.getItem("profile_id");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            Comentários ({post?.comment_count || 0})
          </DialogTitle>
        </DialogHeader>

        {/* Post Original (Preview) */}
        {post && (
          <div className="p-3 bg-gray-50 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-xs text-purple-600 font-medium">
                  {post.anonymous_name.split("#")[1]?.slice(0, 2) || "A"}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {post.anonymous_name}
              </span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-3">{post.content}</p>
          </div>
        )}

        {/* Lista de Comentários */}
        <ScrollArea className="flex-1 pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">
                Ainda não há comentários
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Seja a primeira a comentar
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {comments.map((comment) => {
                const isUserComment = comment.user_id === profileId;
                const timeAgo = formatDistanceToNow(
                  new Date(comment.created_at),
                  {
                    addSuffix: true,
                    locale: ptBR,
                  }
                );

                return (
                  <div
                    key={comment.id}
                    className="p-3 bg-white rounded-lg border hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-xs text-blue-600 font-medium">
                            {comment.anonymous_name.split("#")[1]?.slice(0, 2) ||
                              "A"}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            {comment.anonymous_name}
                          </p>
                          <p className="text-xs text-gray-500">{timeAgo}</p>
                        </div>
                      </div>

                      {/* Botão Deletar (só para comentários próprios) */}
                      {isUserComment && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-gray-400 hover:text-red-500 h-7 w-7 p-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>

                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {comment.content}
                    </p>

                    {isUserComment && (
                      <p className="text-xs text-purple-600 mt-2">
                        Seu comentário
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {/* Formulário de Novo Comentário */}
        <form onSubmit={handleSubmitComment} className="border-t pt-4">
          <div className="flex gap-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escreva uma mensagem de apoio..."
              className="flex-1 min-h-[60px] resize-none"
              disabled={isSubmitting}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isSubmitting || !newComment.trim()}
              className="flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            💜 Seu comentário será anônimo
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
