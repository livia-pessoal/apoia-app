import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

// ================================================================
// INTERFACES
// ================================================================

export interface AnonymousPost {
  id: string;
  user_id: string;
  content: string;
  anonymous_name: string;
  has_trigger_warning: boolean;
  trigger_warning_text: string | null;
  support_count: number;
  comment_count: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  anonymous_name: string;
  created_at: string;
}

export interface PostSupport {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

// ================================================================
// HOOK: useAnonymousPosts
// ================================================================

export function useAnonymousPosts() {
  const [posts, setPosts] = useState<AnonymousPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ================================================================
  // FUNÇÃO: Gerar Nome Anônimo
  // ================================================================
  const generateAnonymousName = (): string => {
    const number = Math.floor(Math.random() * 9999) + 1;
    return `Anônima #${number.toString().padStart(4, "0")}`;
  };

  // ================================================================
  // FUNÇÃO: Carregar Posts do Feed
  // ================================================================
  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("anonymous_posts")
        .select("*")
        .eq("is_visible", true)
        .order("created_at", { ascending: false })
        .limit(50); // Limitar a 50 posts mais recentes

      if (fetchError) throw fetchError;

      setPosts(data || []);
    } catch (err) {
      console.error("Erro ao carregar posts:", err);
      setError("Erro ao carregar depoimentos");
      toast.error("Erro ao carregar depoimentos");
    } finally {
      setLoading(false);
    }
  };

  // ================================================================
  // FUNÇÃO: Criar Novo Post
  // ================================================================
  const createPost = async (
    content: string,
    hasTriggerWarning: boolean = false,
    triggerWarningText: string | null = null
  ): Promise<boolean> => {
    try {
      const profileId = localStorage.getItem("profile_id");
      if (!profileId) {
        toast.error("Você precisa estar logada para criar um depoimento");
        return false;
      }

      if (!content.trim()) {
        toast.error("O depoimento não pode estar vazio");
        return false;
      }

      setLoading(true);

      const { error: insertError } = await supabase
        .from("anonymous_posts")
        .insert([
          {
            user_id: profileId,
            content: content.trim(),
            anonymous_name: generateAnonymousName(),
            has_trigger_warning: hasTriggerWarning,
            trigger_warning_text: hasTriggerWarning ? triggerWarningText : null,
          },
        ]);

      if (insertError) throw insertError;

      toast.success("Depoimento publicado com sucesso");
      await loadPosts(); // Recarregar feed
      return true;
    } catch (err) {
      console.error("Erro ao criar post:", err);
      toast.error("Erro ao publicar depoimento");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ================================================================
  // FUNÇÃO: Deletar Post
  // ================================================================
  const deletePost = async (postId: string): Promise<boolean> => {
    try {
      const profileId = localStorage.getItem("profile_id");
      if (!profileId) {
        toast.error("Erro de autenticação");
        return false;
      }

      // Verificar se o post pertence ao usuário
      const { data: post, error: fetchError } = await supabase
        .from("anonymous_posts")
        .select("user_id")
        .eq("id", postId)
        .single();

      if (fetchError) throw fetchError;

      if (post.user_id !== profileId) {
        toast.error("Você só pode deletar seus próprios depoimentos");
        return false;
      }

      const { error: deleteError } = await supabase
        .from("anonymous_posts")
        .delete()
        .eq("id", postId);

      if (deleteError) throw deleteError;

      toast.success("Depoimento deletado");
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      return true;
    } catch (err) {
      console.error("Erro ao deletar post:", err);
      toast.error("Erro ao deletar depoimento");
      return false;
    }
  };

  // ================================================================
  // FUNÇÃO: Carregar Comentários de um Post
  // ================================================================
  const loadComments = async (postId: string): Promise<PostComment[]> => {
    try {
      const { data, error: fetchError } = await supabase
        .from("post_comments")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (fetchError) throw fetchError;

      return data || [];
    } catch (err) {
      console.error("Erro ao carregar comentários:", err);
      toast.error("Erro ao carregar comentários");
      return [];
    }
  };

  // ================================================================
  // FUNÇÃO: Criar Comentário
  // ================================================================
  const createComment = async (
    postId: string,
    content: string
  ): Promise<boolean> => {
    try {
      const profileId = localStorage.getItem("profile_id");
      if (!profileId) {
        toast.error("Você precisa estar logada para comentar");
        return false;
      }

      if (!content.trim()) {
        toast.error("O comentário não pode estar vazio");
        return false;
      }

      const { error: insertError } = await supabase
        .from("post_comments")
        .insert([
          {
            post_id: postId,
            user_id: profileId,
            content: content.trim(),
            anonymous_name: generateAnonymousName(),
          },
        ]);

      if (insertError) throw insertError;

      toast.success("Comentário adicionado");

      // Atualizar contador no post local
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, comment_count: post.comment_count + 1 }
            : post
        )
      );

      return true;
    } catch (err) {
      console.error("Erro ao criar comentário:", err);
      toast.error("Erro ao adicionar comentário");
      return false;
    }
  };

  // ================================================================
  // FUNÇÃO: Deletar Comentário
  // ================================================================
  const deleteComment = async (
    commentId: string,
    postId: string
  ): Promise<boolean> => {
    try {
      const profileId = localStorage.getItem("profile_id");
      if (!profileId) {
        toast.error("Erro de autenticação");
        return false;
      }

      // Verificar se o comentário pertence ao usuário
      const { data: comment, error: fetchError } = await supabase
        .from("post_comments")
        .select("user_id")
        .eq("id", commentId)
        .single();

      if (fetchError) throw fetchError;

      if (comment.user_id !== profileId) {
        toast.error("Você só pode deletar seus próprios comentários");
        return false;
      }

      const { error: deleteError } = await supabase
        .from("post_comments")
        .delete()
        .eq("id", commentId);

      if (deleteError) throw deleteError;

      toast.success("Comentário deletado");

      // Atualizar contador no post local
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, comment_count: Math.max(0, post.comment_count - 1) }
            : post
        )
      );

      return true;
    } catch (err) {
      console.error("Erro ao deletar comentário:", err);
      toast.error("Erro ao deletar comentário");
      return false;
    }
  };

  // ================================================================
  // FUNÇÃO: Verificar se Usuário Apoiou o Post
  // ================================================================
  const checkIfUserSupported = async (postId: string): Promise<boolean> => {
    try {
      const profileId = localStorage.getItem("profile_id");
      if (!profileId) return false;

      const { data, error: fetchError } = await supabase
        .from("post_support")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", profileId)
        .maybeSingle();

      if (fetchError) throw fetchError;

      return !!data;
    } catch (err) {
      console.error("Erro ao verificar apoio:", err);
      return false;
    }
  };

  // ================================================================
  // FUNÇÃO: Adicionar/Remover Apoio (Toggle)
  // ================================================================
  const toggleSupport = async (postId: string): Promise<boolean> => {
    try {
      const profileId = localStorage.getItem("profile_id");
      if (!profileId) {
        toast.error("Você precisa estar logada para enviar apoio");
        return false;
      }

      // Verificar se já apoiou
      const alreadySupported = await checkIfUserSupported(postId);

      if (alreadySupported) {
        // Remover apoio
        const { error: deleteError } = await supabase
          .from("post_support")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", profileId);

        if (deleteError) throw deleteError;

        // Atualizar contador local
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId
              ? { ...post, support_count: Math.max(0, post.support_count - 1) }
              : post
          )
        );

        return false; // Retorna false = apoio removido
      } else {
        // Adicionar apoio
        const { error: insertError } = await supabase
          .from("post_support")
          .insert([
            {
              post_id: postId,
              user_id: profileId,
            },
          ]);

        if (insertError) throw insertError;

        toast.success("💜 Apoio enviado", {
          description: "A pessoa receberá seu apoio",
        });

        // Atualizar contador local
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId
              ? { ...post, support_count: post.support_count + 1 }
              : post
          )
        );

        return true; // Retorna true = apoio adicionado
      }
    } catch (err) {
      console.error("Erro ao alternar apoio:", err);
      toast.error("Erro ao enviar apoio");
      return false;
    }
  };

  // ================================================================
  // FUNÇÃO: Carregar Posts do Usuário (Meus Depoimentos)
  // ================================================================
  const loadMyPosts = async (): Promise<AnonymousPost[]> => {
    try {
      const profileId = localStorage.getItem("profile_id");
      if (!profileId) return [];

      const { data, error: fetchError } = await supabase
        .from("anonymous_posts")
        .select("*")
        .eq("user_id", profileId)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      return data || [];
    } catch (err) {
      console.error("Erro ao carregar meus posts:", err);
      toast.error("Erro ao carregar seus depoimentos");
      return [];
    }
  };

  // ================================================================
  // REALTIME: Subscribe a Novos Posts
  // ================================================================
  useEffect(() => {
    // Carregar posts inicialmente
    loadPosts();

    // Subscribe a novos posts
    const channel = supabase
      .channel("anonymous_posts_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "anonymous_posts",
        },
        (payload) => {
          const newPost = payload.new as AnonymousPost;
          if (newPost.is_visible) {
            setPosts((prev) => [newPost, ...prev]);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "anonymous_posts",
        },
        (payload) => {
          const deletedPost = payload.old as AnonymousPost;
          setPosts((prev) => prev.filter((p) => p.id !== deletedPost.id));
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "anonymous_posts",
        },
        (payload) => {
          const updatedPost = payload.new as AnonymousPost;
          setPosts((prev) =>
            prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
          );
        }
      )
      .subscribe();

    // Cleanup
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ================================================================
  // RETORNO DO HOOK
  // ================================================================
  return {
    // Estado
    posts,
    loading,
    error,

    // Funções Posts
    loadPosts,
    createPost,
    deletePost,
    loadMyPosts,

    // Funções Comentários
    loadComments,
    createComment,
    deleteComment,

    // Funções Apoio
    toggleSupport,
    checkIfUserSupported,
  };
}
