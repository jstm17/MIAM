import { ClearAddFormDialog } from "@/components/dialog/ClearAddFormDialog";
import { Typography } from "@/components/shared/Typography";
import { Button } from "@/components/ui/button";
import type { AddTab } from "@/utils/formDraft";
import { RefreshCcw } from "lucide-react";
import { useState } from "react";

type RecipeAddHeaderProps = {
  title: string;
  tab: AddTab;
  canClear: boolean;
  onClear: () => void;
};

export const RecipeAddHeader = ({
  title,
  tab,
  canClear,
  onClear,
}: RecipeAddHeaderProps) => {
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  return (
    <div className="relative flex items-center justify-between w-full gap-2 px-4">
      <span className="w-[38.88px] h-[38.88px]" />
      <Typography
        variant="h1"
        weight="bold"
        size="lg"
        className="self-center text-center"
      >
        {title}
      </Typography>
      <div className="w-[38.88px]">
        {canClear && (
          <Button
            variant="destructive"
            size="icon-lg"
            onClick={() => setClearDialogOpen(true)}
            aria-label="Vider le formulaire"
          >
            <RefreshCcw />
          </Button>
        )}
      </div>
      <ClearAddFormDialog
        open={clearDialogOpen}
        onOpenChange={setClearDialogOpen}
        tab={tab}
        onConfirm={onClear}
      />
    </div>
  );
};
