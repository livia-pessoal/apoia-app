import { Home, Users, AlertCircle, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const tabs = [
    { id: "home", icon: Home, label: "Início" },
    { id: "network", icon: Users, label: "Rede" },
    { id: "emergency", icon: AlertCircle, label: "Emergência" },
    { id: "notifications", icon: Bell, label: "Notificações" },
    { id: "profile", icon: User, label: "Perfil" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-elevated z-50">
      <div className="flex justify-around items-center h-16 px-2 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isEmergency = tab.id === "emergency";
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-300",
                isActive && "bg-primary/10"
              )}
            >
              <Icon 
                className={cn(
                  "w-5 h-5 transition-all duration-300",
                  isActive && "text-primary scale-110",
                  !isActive && "text-muted-foreground"
                )} 
              />
              <span 
                className={cn(
                  "text-xs transition-all duration-300",
                  isActive && "text-primary font-medium",
                  !isActive && "text-muted-foreground"
                )}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
