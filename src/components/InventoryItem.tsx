import { InventoryItem as ItemType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";

interface InventoryItemProps {
  item: ItemType;
  onEdit: (item: ItemType) => void;
  onDelete: (id: string) => void;
}

const InventoryItem = ({ item, onEdit, onDelete }: InventoryItemProps) => {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b">
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
        <p className="text-sm text-gray-500">Category: {item.category}</p>
      </div>
      <div className="flex-1 hidden md:block">
        <p className="text-sm text-gray-900">${item.price.toFixed(2)}</p>
      </div>
      <div className="flex-1 hidden md:block">
        <p className="text-sm text-gray-900">{item.quantity} units</p>
      </div>
      <div className="flex-1 hidden md:block">
        <p className="text-sm text-gray-500">{new Date(item.lastUpdated).toLocaleDateString()}</p>
      </div>
      <div className="flex gap-2 ml-4">
        <Button variant="ghost" size="icon" onClick={() => onEdit(item)}>
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(item.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default InventoryItem;