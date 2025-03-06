
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DisableItemDialogProps {
  itemToDisable: string | null;
  setItemToDisable: (value: string | null) => void;
  handleDisableItem: (itemId: string) => void;
}

export function DisableItemDialog({ 
  itemToDisable, 
  setItemToDisable, 
  handleDisableItem 
}: DisableItemDialogProps) {
  return (
    <AlertDialog open={!!itemToDisable} onOpenChange={() => setItemToDisable(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove the tab from your sidebar. You can add it back later through the settings.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDisableItem(itemToDisable!)}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
