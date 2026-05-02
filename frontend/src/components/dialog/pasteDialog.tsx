import { TextAreaInput } from "../shared/TextAreaInput";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

type PasteDialogProps = {
  title: string;
  description: string;
  placeholder?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pasteText: string;
  setPasteText: (text: string) => void;
  onSubmit: () => void;
};

export const PasteDialog = ({
  open,
  onOpenChange,
  pasteText,
  setPasteText,
  onSubmit,
  title,
  description,
  placeholder,
}: PasteDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-[calc(100%-2rem)]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <TextAreaInput
          value={pasteText}
          onChange={(e) => setPasteText(e.target.value)}
          placeholder={placeholder}
          className="max-h-[50dvh]"
        />
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary" size="lg">
              Annuler
            </Button>
          </DialogClose>
          <Button type="button" onClick={onSubmit} size="lg">
            Ajouter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
