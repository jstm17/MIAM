import { RefreshCcw } from "lucide-react";
import { useState } from "react";
import { Typography } from "../shared/Typography";
import { Button } from "../ui/button";
import { ShoppingClearCartDialog } from "./ShoppingClearCartDialog";

export const ShoppingHeader = ({ empty }: { empty?: boolean }) => {
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  return (
    <div className="relative flex items-center justify-between w-full mb-6">
      <span className="w-[34.55px] h-[34.55px]"></span>
      <Typography variant="h1" weight="semibold" className="self-center">
        Liste de courses
      </Typography>

      <div className="w-[34.55px]">
        {!empty && (
          <Button
            variant="destructive"
            size={"icon"}
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
