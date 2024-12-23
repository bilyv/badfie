import { useState } from "react";
import { InventoryItem as ItemType } from "@/lib/types";
import InventoryItem from "./InventoryItem";
import SearchBar from "./SearchBar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Sample data
const initialItems: ItemType[] = [
  {
    id: "1",
    name: "Office Chair",
    quantity: 25,
    category: "Furniture",
    price: 199.99,
    lastUpdated: "2024-01-15",
  },
  {
    id: "2",
    name: "Laptop Stand",
    quantity: 50,
    category: "Accessories",
    price: 49.99,
    lastUpdated: "2024-01-14",
  },
  {
    id: "3",
    name: "Wireless Mouse",
    quantity: 100,
    category: "Electronics",
    price: 29.99,
    lastUpdated: "2024-01-13",
  },
];

const InventoryList = () => {
  const [items, setItems] = useState<ItemType[]>(initialItems);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleEdit = (item: ItemType) => {
    toast({
      title: "Edit item",
      description: `Editing ${item.name}`,
    });
  };

  const handleDelete = (id: string) => {
    toast({
      title: "Delete item",
      description: "Are you sure you want to delete this item?",
    });
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <SearchBar onSearch={handleSearch} />
        <Button className="w-full md:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>
      
      <div className="hidden md:flex border-b p-4 text-sm font-medium text-gray-500">
        <div className="flex-1">Name</div>
        <div className="flex-1">Price</div>
        <div className="flex-1">Quantity</div>
        <div className="flex-1">Last Updated</div>
        <div className="w-24">Actions</div>
      </div>

      <div className="divide-y">
        {filteredItems.map((item) => (
          <InventoryItem
            key={item.id}
            item={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default InventoryList;