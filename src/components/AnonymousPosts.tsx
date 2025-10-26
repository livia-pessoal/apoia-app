import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, MessageSquare, Loader2, RefreshCw } from "lucide-react";
import { useAnonymousPosts } from "@/hooks/useAnonymousPosts";
import { PostCard } from "@/components/PostCard";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { PostCommentsDialog } from "@/components/PostCommentsDialog";
import type { AnonymousPost } from "@/hooks/useAnonymousPosts";

export function AnonymousPosts() {
  const {
    posts,
    loading,
    loadPosts,
    createPost,
    deletePost,
    loadMyPosts,
    loadComments,
    createComment,
    deleteComment,
    toggleSupport,
    checkIfUserSupported,
  } = useAnonymousPosts();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [commentsDialogOpen, setCommentsDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<AnonymousPost | null>(null);
  const [myPosts, setMyPosts] = useState<AnonymousPost[]>([]);
  const [supportedPosts, setSupportedPosts] = useState<Set<string>>(new Set());
  const [loadingMyPosts, setLoadingMyPosts] = useState(false);

  const profileId = localStorage.getItem("profile_id");

  // Verificar quais posts o usuário apoiou
  useEffect(() => {
    const checkSupports = async () => {
      const supported = new Set<string>();
      
      for (const post of posts) {
        const hasSupported = await checkIfUserSupported(post.id);
        if (hasSupported) {
          supported.add(post.id);
        }
      }
      
      setSupportedPosts(supported);
    };

    if (posts.length > 0) {
      checkSupports();
    }
  }, [posts]);

  // Carregar meus posts quando mudar de aba
  const handleLoadMyPosts = async () => {
    setLoadingMyPosts(true);
    const myPostsData = await loadMyPosts();
    setMyPosts(myPostsData);
    setLoadingMyPosts(false);
  };

  const handleToggleSupport = async (postId: string) => {
    const wasSupported = supportedPosts.has(postId);
    await toggleSupport(postId);

    // Atualizar estado local
    setSupportedPosts((prev) => {
      const newSet = new Set(prev);
      if (wasSupported) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleOpenComments = (post: AnonymousPost) => {
    setSelectedPost(post);
    setCommentsDialogOpen(true);
  };

  const handleCloseComments = () => {
    setCommentsDialogOpen(false);
    setSelectedPost(null);
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Comunidade</h2>
          <p className="text-sm text-gray-600">
            Compartilhe sua história e apoie outras mulheres
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Novo Depoimento
        </Button>
      </div>

      {/* Tabs: Feed / Meus Depoimentos */}
      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="feed" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Feed
          </TabsTrigger>
          <TabsTrigger
            value="my-posts"
            onClick={handleLoadMyPosts}
            className="flex items-center gap-2"
          >
            Meus Depoimentos
          </TabsTrigger>
        </TabsList>

        {/* TAB: Feed Geral */}
        <TabsContent value="feed" className="space-y-4">
          {/* Botão Recarregar */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={loadPosts}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
          </div>

          {/* Loading */}
          {loading && posts.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : posts.length === 0 ? (
            /* Estado Vazio */
            <Card className="p-12 text-center">
              <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Nenhum depoimento ainda
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Seja a primeira a compartilhar sua história
              </p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Depoimento
              </Button>
            </Card>
          ) : (
            /* Lista de Posts */
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  isUserPost={post.user_id === profileId}
                  userHasSupported={supportedPosts.has(post.id)}
                  onToggleSupport={handleToggleSupport}
                  onOpenComments={handleOpenComments}
                  onDelete={deletePost}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* TAB: Meus Depoimentos */}
        <TabsContent value="my-posts" className="space-y-4">
          {loadingMyPosts ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : myPosts.length === 0 ? (
            <Card className="p-12 text-center">
              <MessageSquare className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Você ainda não criou nenhum depoimento
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Compartilhe sua história de forma anônima
              </p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Depoimento
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {myPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  isUserPost={true}
                  userHasSupported={supportedPosts.has(post.id)}
                  onToggleSupport={handleToggleSupport}
                  onOpenComments={handleOpenComments}
                  onDelete={deletePost}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modais */}
      <CreatePostDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onCreate={createPost}
      />

      <PostCommentsDialog
        open={commentsDialogOpen}
        onClose={handleCloseComments}
        post={selectedPost}
        onLoadComments={loadComments}
        onCreateComment={createComment}
        onDeleteComment={deleteComment}
      />
    </div>
  );
}
