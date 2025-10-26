import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, CheckCircle2, BookOpen } from "lucide-react";

interface ProgressStatsProps {
  total: number;
  completed: number;
  remaining: number;
  percentage: number;
}

export const ProgressStats = ({ total, completed, remaining, percentage }: ProgressStatsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Target className="w-4 h-4" />
            Total
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{total}</p>
          <p className="text-xs text-muted-foreground">missões</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Completas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-success">{completed}</p>
          <p className="text-xs text-muted-foreground">concluídas</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Restantes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{remaining}</p>
          <p className="text-xs text-muted-foreground">faltam</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Progresso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-primary">{percentage}%</p>
          <Progress value={percentage} className="mt-2" />
        </CardContent>
      </Card>
    </div>
  );
};
