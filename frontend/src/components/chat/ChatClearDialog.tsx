import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useClearChat } from "@/hooks/chat/useClearChat";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

type ChatClearDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
export function ChatClearDialog({ open, onOpenChange }: ChatClearDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Supprimer la conversation</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette conversation ? <br />{" "}
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm onOpenChange={onOpenChange} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="pb-[calc(16px+env(safe-area-inset-bottom))]">
        <DrawerHeader className="text-left">
          <DrawerTitle>Supprimer la conversation</DrawerTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer cette conversation ? <br /> Cette
            action est irréversible.
          </DialogDescription>
        </DrawerHeader>
        <ProfileForm className="px-4" onOpenChange={onOpenChange} />
      </DrawerContent>
    </Drawer>
  );
}

type ProfileFormProps = {
  className?: string;
  onOpenChange: (open: boolean) => void;
};

function ProfileForm({ className, onOpenChange }: ProfileFormProps) {
  const { clearChat, isPending } = useClearChat();

  const onSubmit = async () => {
    try {
      await clearChat();
      toast.success("Conversation supprimée avec succès");
      onOpenChange(false);
    } catch {
      toast.error("Impossible de supprimer la conversation");
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onSubmit();
      }}
      className={cn("grid items-start gap-6", className)}
    >
      <Button
        type="submit"
        disabled={isPending}
        size="lg"
        variant="destructive"
      >
        {isPending ? <Spinner /> : "Supprimer"}
      </Button>
    </form>
  );
}
