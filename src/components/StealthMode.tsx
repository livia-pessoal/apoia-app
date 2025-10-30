import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChefHat, Search, Clock, Utensils } from "lucide-react";

interface StealthModeProps {
  onExit: () => void;
}

export const StealthMode = ({ onExit }: StealthModeProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const recipes = [
    {
      id: 1,
      title: "Bolo de Chocolate",
      time: "45 min",
      difficulty: "Fácil",
      description: "Delicioso bolo de chocolate com cobertura cremosa",
    },
    {
      id: 2,
      title: "Arroz de Forno",
      time: "1h 15min",
      difficulty: "Médio",
      description: "Arroz gratinado com queijo e frango desfiado",
    },
    {
      id: 3,
      title: "Salada Caesar",
      time: "20 min",
      difficulty: "Fácil",
      description: "Salada clássica com molho caesar caseiro",
    },
    {
      id: 4,
      title: "Lasanha à Bolonhesa",
      time: "1h 30min",
      difficulty: "Médio",
      description: "Lasanha tradicional com molho bolonhesa",
    },
    {
      id: 5,
      title: "Brigadeiro Gourmet",
      time: "30 min",
      difficulty: "Fácil",
      description: "Brigadeiro cremoso com chocolate nobre",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ChefHat className="w-8 h-8 text-orange-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Minhas Receitas
              </h1>
            </div>
            {/* Botão secreto para sair - triplo toque */}
            <button
              onClick={onExit}
              className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1"
              onDoubleClick={(e) => {
                e.preventDefault();
                onExit();
              }}
            >
              v1.2
            </button>
          </div>

          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Buscar receitas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-50 dark:bg-gray-800"
            />
          </div>
        </div>
      </div>

      {/* Lista de Receitas */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Utensils className="w-5 h-5 text-orange-600" />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Receitas Populares
          </h2>
        </div>

        {recipes
          .filter(
            (recipe) =>
              searchTerm === "" ||
              recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((recipe) => (
            <Card
              key={recipe.id}
              className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {recipe.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {recipe.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{recipe.time}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full">
                      {recipe.difficulty}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-orange-600 hover:text-orange-700"
                >
                  Ver receita
                </Button>
              </div>
            </Card>
          ))}
      </div>

      {/* Dica para sair do modo secreto */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 opacity-20 hover:opacity-100 transition-opacity">
        <p className="text-xs text-gray-500 text-center">
          Agite o celular ou toque 2x no "v1.2" para voltar
        </p>
      </div>
    </div>
  );
};
