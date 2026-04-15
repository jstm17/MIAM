import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useAuth } from "@/hooks/useAuth";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import type { Recipe } from "@/types/recipe.types";
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
      >
        <DrawerHeader className="text-left">
          <DrawerTitle>Partager la recette</DrawerTitle>
        </DrawerHeader>
        <ShareForm
          className="px-4"
          onOpenChange={onOpenChange}
          recipe={recipe}
        />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline" size="lg">
              Annuler
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

const fallbackCopyTextToClipboard = (text: string) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    const successful = document.execCommand("copy");
    if (successful) toast.success("Lien copié (fallback)");
    else toast.error("Impossible de copier");
  } catch (err) {
    toast.error("Erreur critique de copie");
  }
  document.body.removeChild(textArea);
};

type ShareFormProps = {
  className?: string;
  onOpenChange: (open: boolean) => void;
  recipe: Recipe;
  navigate?: () => void;
};

function ShareForm({
  className,
  onOpenChange,
  recipe,
  navigate,
}: ShareFormProps) {
  const { refetchUser } = useAuth();

  const url = `${window.location.origin}/recipe/${recipe.slug}`;

  const handleCopy = async () => {
    if (!navigator?.clipboard) {
      fallbackCopyTextToClipboard(url);
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      toast.success("Lien copié");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la copie");
    }
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(url)}`);
  };

  return (
    <div className={cn("grid grid-cols-3 gap-4 items-start gap-6", className)}>
      <button
        className="h-fit flex flex-col items-center justify-center gap-2"
        onClick={handleCopy}
      >
        <div className="bg-muted-foreground/10 active:bg-muted-foreground/5 hover:bg-muted-foreground/5  h-16 w-16 flex items-center justify-center rounded-full">
          <Link color="black" size={32} />
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
        Whatsapp
      </button>
      <button className="h-fit flex flex-col items-center justify-center gap-2">
        <div className="bg-muted-foreground/10 active:bg-muted-foreground/5 hover:bg-muted-foreground/5 h-16! w-16 flex items-center justify-center rounded-full">
          <FileText color="black" size={32} />
        </div>
        Exporter en PDF
      </button>
    </div>
  );
}
