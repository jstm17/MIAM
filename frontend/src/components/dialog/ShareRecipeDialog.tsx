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
import type { Recipe } from "@/types/recipe.types";
import { exportPdf } from "@/utils/exportPdf";
import { FileText, Link } from "lucide-react";
import { toast } from "sonner";
import whatsappLogo from "../../assets/whatsapp-logo.png";

type ShareRecipeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipe: Recipe;
};
export function ShareRecipeDialog({
  open,
  onOpenChange,
  recipe,
}: ShareRecipeDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="sm:max-w-106.25"
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle>Partager la recette</DialogTitle>
          </DialogHeader>
          <ShareForm onOpenChange={onOpenChange} recipe={recipe} />
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
          <DrawerTitle>Partager la recette</DrawerTitle>
        </DrawerHeader>
        <ShareForm
          className="px-4"
          onOpenChange={onOpenChange}
          recipe={recipe}
        />
      </DrawerContent>
    </Drawer>
  );
}

type ShareFormProps = {
  className?: string;
  onOpenChange: (open: boolean) => void;
  recipe: Recipe;
};

function ShareForm({ className, onOpenChange, recipe }: ShareFormProps) {
  const url = `${window.location.origin}/recipe/${recipe.slug}`;

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
    <div className={cn("grid grid-cols-3 items-start gap-4", className)}>
      <button
        className="h-fit flex flex-col items-center justify-center gap-2"
        onClick={handleCopy}
      >
        <div className="bg-muted-foreground/10 active:bg-muted-foreground/5 hover:bg-muted-foreground/5  h-16 w-16 flex items-center justify-center rounded-full">
          <Link
            className="text-black dark:text-white"
            size={32}
            strokeWidth={1.5}
          />
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
      <button
        className="h-fit flex flex-col items-center justify-center gap-2"
        onClick={() => exportPdf(recipe)}
      >
        <div className="bg-muted-foreground/10 active:bg-muted-foreground/5 hover:bg-muted-foreground/5 h-16! w-16 flex items-center justify-center rounded-full">
          <FileText
            className="text-black dark:text-white"
            size={32}
            strokeWidth={1.5}
          />
        </div>
        Exporter en PDF
      </button>
    </div>
  );
}
