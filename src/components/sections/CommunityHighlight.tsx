import { MessageCircle, Heart, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface CommunityHighlightProps {
  onCommunityClick: () => void;
}

export const CommunityHighlight = ({ onCommunityClick }: CommunityHighlightProps) => {
  const [postsCount, setPostsCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPostsCount();
  }, []);

  const loadPostsCount = async () => {
    try {
      const { count, error } = await supabase
        .from("anonymous_posts")
        .select("*", { count: "exact", head: true });

      if (error) throw error;
      setPostsCount(count || 0);
    } catch (err) {
      console.error("Erro ao carregar contagem:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-6 py-8 -mt-8 relative z-20">
      <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 dark:from-purple-950/30 dark:via-pink-950/20 dark:to-purple-950/30 border-2 border-purple-200/50 dark:border-purple-800/50 shadow-xl hover:shadow-2xl transition-all duration-300">
        {/* Decoração de fundo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-300/20 to-purple-300/20 rounded-full blur-3xl" />
        
        <div className="relative p-8 md:p-10">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            {/* Ícone/Ilustração à esquerda */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg animate-pulse-slow">
                  <MessageCircle className="w-10 h-10 md:w-12 md:h-12 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center animate-bounce">
                  <Heart className="w-3 h-3 text-white fill-white" />
                </div>
              </div>
            </div>

            {/* Conteúdo principal */}
            <div className="flex-1 text-center md:text-left space-y-3">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                  Funcionalidade Exclusiva
                </span>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                💬 Você não está sozinha
              </h2>
              
              <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-2xl">
                Leia histórias reais de mulheres que superaram desafios semelhantes ao seu. 
                Compartilhe sua experiência de forma <span className="font-semibold text-purple-600 dark:text-purple-400">100% anônima</span> e 
                inspire outras mulheres.
              </p>

              {!loading && postsCount > 0 && (
                <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-purple-300 border-2 border-white dark:border-gray-900" />
                    <div className="w-8 h-8 rounded-full bg-pink-300 border-2 border-white dark:border-gray-900" />
                    <div className="w-8 h-8 rounded-full bg-purple-400 border-2 border-white dark:border-gray-900" />
                  </div>
                  <span className="font-medium">
                    {postsCount} {postsCount === 1 ? "história compartilhada" : "histórias compartilhadas"}
                  </span>
                </div>
              )}
            </div>

            {/* Botão de ação à direita */}
            <div className="flex-shrink-0 w-full md:w-auto">
              <Button
                onClick={onCommunityClick}
                size="lg"
                className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group h-14 px-8 text-base font-semibold"
              >
                <span>Ver Depoimentos</span>
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                Único app com essa funcionalidade
              </p>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
};
