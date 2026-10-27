import { Typography } from "@/components/shared/Typography";
import { RefreshCcw } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { ChatClearDialog } from "./ChatClearDialog";

export const ChatHeader = ({ empty }: { empty?: boolean }) => {
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  return (
    <div className="flex justify-between items-center max-w-lg w-full inset-x-0 m-auto gap-2 px-4 py-5 fixed top-0 z-10 bg-linear-180 from-background to-transparent">
      <span className="w-[38.88px] h-[38.88px]"></span>
      <Typography
        variant="h1"
        weight="bold"
        size="lg"
        className="self-center text-center"
      >
        Zest
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

      <ChatClearDialog
        open={clearDialogOpen}
        onOpenChange={setClearDialogOpen}
      />
    </div>
  );
};
