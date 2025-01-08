import { Package } from "lucide-react";

interface AuthHeaderProps {
  title: string;
  description: string;
}

export const AuthHeader = ({ title, description }: AuthHeaderProps) => {
  return (
    <div className="flex flex-col items-center space-y-2 text-center">
      <Package className="h-12 w-12 text-primary" />
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};