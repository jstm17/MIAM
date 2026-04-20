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
import type { CookingTime } from "@/types/cookingTime.types";
import { exportPdfCookingTime } from "@/utils/exportPdfCookingTime";
import { FileText, Link } from "lucide-react";
import { toast } from "sonner";
import whatsappLogo from "../../assets/whatsapp-logo.png";

type ShareCookingTimeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cookingTime: CookingTime;
};
export function ShareCookingTimeDialog({
  open,
  onOpenChange,
  cookingTime,
}: ShareCookingTimeDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="sm:max-w-106.25"
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle>Partager le temps de cuisson</DialogTitle>
          </DialogHeader>
          <ShareForm onOpenChange={onOpenChange} cookingTime={cookingTime} />
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
          <DrawerTitle>Partager le temps de cuisson</DrawerTitle>
        </DrawerHeader>
        <ShareForm
          className="px-4"
          onOpenChange={onOpenChange}
          cookingTime={cookingTime}
        />
      </DrawerContent>
    </Drawer>
  );
}

type ShareFormProps = {
  className?: string;
  onOpenChange: (open: boolean) => void;
  cookingTime: CookingTime;
};

function ShareForm({ className, onOpenChange, cookingTime }: ShareFormProps) {
  const url = `${window.location.origin}/cooking-time/${cookingTime.slug}`;

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
      <button
        className="h-fit flex flex-col items-center justify-center gap-2"
        onClick={() => exportPdfCookingTime(cookingTime)}
      >
        <div className="bg-muted-foreground/10 active:bg-muted-foreground/5 hover:bg-muted-foreground/5 h-16! w-16 flex items-center justify-center rounded-full">
          <FileText className="text-black dark:text-white" size={32} />
        </div>
        Exporter en PDF
      </button>
    </div>
  );
}
