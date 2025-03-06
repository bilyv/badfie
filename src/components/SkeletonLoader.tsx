
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonLoader = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay for 3 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-screen bg-background p-6">
        <div className="space-y-4">
          {/* Header skeleton */}
          <div className="flex justify-between items-center">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-36" />
            </div>
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>

          {/* Dashboard metrics skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>

          {/* Graph skeleton */}
          <Skeleton className="h-72 mt-6 rounded-lg" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
