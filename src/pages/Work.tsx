import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Business {
  id: string;
  name: string;
}

const Work = () => {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const { data: workerData, error: workerError } = await supabase
          .from('workers')
          .select('business_id')
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

        if (workerError) throw workerError;

        if (workerData && workerData.length > 0) {
          const businessIds = workerData.map(w => w.business_id);
          
          const { data: businessData, error: businessError } = await supabase
            .from('businesses')
            .select('id, name')
            .in('id', businessIds);

          if (businessError) throw businessError;
          setBusinesses(businessData || []);
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  const handleBusinessSelect = (businessId: string) => {
    // For now, just navigate to the dashboard
    // You can expand this later to set the selected business in context/state
    navigate("/");
    toast({
      description: "Successfully logged in to workspace",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Package className="h-12 w-12 text-primary" />
          <h1 className="text-2xl font-bold">Welcome to Work</h1>
          <p className="text-muted-foreground">
            Select a business workspace to continue
          </p>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            {businesses.length === 0 ? (
              <p className="text-center text-muted-foreground">
                You don't have access to any business workspaces yet.
                Contact your business administrator for access.
              </p>
            ) : (
              businesses.map((business) => (
                <Button
                  key={business.id}
                  onClick={() => handleBusinessSelect(business.id)}
                  className="w-full justify-start text-left"
                  variant="outline"
                >
                  <Package className="mr-2 h-4 w-4" />
                  {business.name}
                </Button>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Work;