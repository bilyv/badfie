import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link2, ShoppingBag, Store, Box, Palette } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Connect = () => {
  const integrations = [
    {
      name: "Shopify",
      description: "Connect your Shopify store to sync products and orders",
      icon: ShoppingBag,
    },
    {
      name: "WooCommerce",
      description: "Integrate with WooCommerce to manage your inventory",
      icon: Store,
    },
    {
      name: "Amazon",
      description: "Connect to Amazon Marketplace for seamless selling",
      icon: Box,
    },
    {
      name: "Etsy",
      description: "Sync your Etsy shop with our inventory system",
      icon: Palette,
    },
  ];

  const handleConnect = (platform: string) => {
    toast({
      title: "Connection Initiated",
      description: `Connecting to ${platform}...`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
          Connect Shops
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Integrate with your favorite e-commerce platforms
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {integrations.map((integration) => (
          <Card key={integration.name} className="p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="text-2xl mb-2">
                  <integration.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold">{integration.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {integration.description}
                </p>
              </div>
              <Button 
                variant="outline" 
                className="shrink-0"
                onClick={() => handleConnect(integration.name)}
              >
                <Link2 className="h-4 w-4 mr-2" />
                Connect
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Connect;