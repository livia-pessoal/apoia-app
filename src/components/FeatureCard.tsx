import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonText: string;
  buttonVariant?: "default" | "hero" | "emergency" | "success";
  onButtonClick?: () => void;
}

export const FeatureCard = ({
  icon: Icon,
  title,
  description,
  buttonText,
  buttonVariant = "default",
  onButtonClick,
}: FeatureCardProps) => {
  return (
    <Card className="bg-gradient-card border-primary/20 shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          variant={buttonVariant} 
          className="w-full" 
          onClick={onButtonClick}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};
