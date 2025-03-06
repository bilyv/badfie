
import { ProductSearch } from "./ProductSearch";
import { RefObject } from "react";

interface ProductHeaderProps {
  isSearching: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setIsSearching: (isSearching: boolean) => void;
  searchRef: RefObject<HTMLDivElement>;
}

export const ProductHeader = ({
  isSearching,
  searchQuery,
  setSearchQuery,
  setIsSearching,
  searchRef
}: ProductHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Products</h1>
        <p className="text-sm text-muted-foreground">Manage your product inventory</p>
      </div>
      <ProductSearch
        isSearching={isSearching}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setIsSearching={setIsSearching}
        searchRef={searchRef}
      />
    </div>
  );
};
