import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/category.types";
import { Link } from "lucide-react";
import { toast } from "sonner";
import whatsappLogo from "../../assets/whatsapp-logo.png";

type ShareCategoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category;
  current?: boolean;
};
export function ShareCategoryDialog({
  open,
  onOpenChange,
  category,
}: ShareCategoryDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="sm:max-w-106.25"
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle>Partager la catégorie</DialogTitle>
          </DialogHeader>
          <ShareForm onOpenChange={onOpenChange} category={category} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        className="pb-[calc(16px+env(safe-area-inset-bottom))]"
      >
        <DrawerHeader className="text-left">
          <DrawerTitle>Partager la catégorie</DrawerTitle>
        </DrawerHeader>
        <ShareForm
          className="px-4"
          onOpenChange={onOpenChange}
          category={category}
        />
      </DrawerContent>
    </Drawer>
  );
}

type ShareFormProps = {
  className?: string;
  onOpenChange: (open: boolean) => void;
  category: Category;
};

function ShareForm({ className, onOpenChange, category }: ShareFormProps) {
  const url = `${window.location.origin}/category/${category.slug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Lien copié");
    } catch {
      toast.error("Erreur lors de la copie");
    }
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(url)}`);
    onOpenChange(false);
  };
  return (
    <div className={cn("flex justify-evenly items-start gap-4", className)}>
      <button
        className="h-fit flex flex-col items-center justify-center gap-2"
        onClick={handleCopy}
      >
        <div className="bg-muted-foreground/10 active:bg-muted-foreground/5 hover:bg-muted-foreground/5  h-16 w-16 flex items-center justify-center rounded-full">
          <Link className="text-black dark:text-white" size={32} />
        </div>
        Copier le lien
      </button>

      <button
        className="h-fit flex flex-col items-center justify-center gap-2"
        onClick={handleWhatsApp}
      >
        <div className="bg-[#1CD741] active:opacity-80 hover:opacity-80  h-16 w-16 flex items-center justify-center rounded-full">
          <img
            src={whatsappLogo}
            className="h-9 w-9 object-cover"
            alt="WhatsApp"
          />
        </div>
        WhatsApp
      </button>
    </div>
  );
}
