import { RefreshCcw } from "lucide-react";
import { useState } from "react";
import { ShoppingClearCartDialog } from "../dialog/ShoppingClearCartDialog";
import { Typography } from "../shared/Typography";
import { Button } from "../ui/button";

export const ShoppingHeader = ({ empty }: { empty?: boolean }) => {
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  return (
    <div className="relative flex items-center justify-between w-full mb-4 gap-2 px-4">
      <span className="w-[38.88px] h-[38.88px]"></span>
      <Typography
        variant="h1"
        weight="bold"
        size="lg"
        className="self-center text-center"
      >
        Liste de courses
      </Typography>

      <div className="w-[38.88px]">
        {!empty && (
          <Button
            variant="destructive"
            size="icon-lg"
            onClick={() => setClearDialogOpen(true)}
            className=""
          >
            <RefreshCcw />
          </Button>
        )}
      </div>

      <ShoppingClearCartDialog
        open={clearDialogOpen}
        onOpenChange={setClearDialogOpen}
      />
    </div>
  );
};
