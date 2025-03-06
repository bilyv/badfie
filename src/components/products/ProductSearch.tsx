
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { RefObject } from "react";

interface ProductSearchProps {
  isSearching: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setIsSearching: (isSearching: boolean) => void;
  searchRef: RefObject<HTMLDivElement>;
}

export const ProductSearch = ({
  isSearching,
  searchQuery,
  setSearchQuery,
  setIsSearching,
  searchRef
}: ProductSearchProps) => {
  return (
    <div ref={searchRef} className="flex items-center gap-2">
      {isSearching ? (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            className="pl-10 w-full md:w-[300px]"
            placeholder="Search inventory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setIsSearching(false);
                setSearchQuery('');
              }
            }}
            autoFocus
          />
        </div>
      ) : (
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSearching(true)}
        >
          <Search className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
