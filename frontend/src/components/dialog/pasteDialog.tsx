import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
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
                <Textarea
                    value={pasteText}
                    onChange={(e) => setPasteText(e.target.value)}
                    placeholder={placeholder}
                    className="min-h-[200px]"
                />
                <DialogFooter className="sm:justify-end">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Annuler
                        </Button>
                    </DialogClose>
                    <Button type="button" onClick={onSubmit}>
                        Ajouter
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};