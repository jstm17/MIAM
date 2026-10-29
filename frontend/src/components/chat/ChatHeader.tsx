import { Typography } from "@/components/shared/Typography";
import { RefreshCcw, Reply, SparklesIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { ChatClearDialog } from "./ChatClearDialog";

export const ChatHeader = ({ empty }: { empty?: boolean }) => {
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center max-w-lg w-full inset-x-0 m-auto gap-2 px-4 py-5 fixed top-0 z-10 bg-linear-180 from-background to-transparent">
      <Button
        size="icon-lg"
        variant="outline"
        aria-label="Retour"
        className="hover:bg-muted/10 active:bg-muted/10 aria-expanded:bg-muted/10"
        onClick={() => navigate(-1)}
      >
        <Reply />
      </Button>
      <Typography
        variant="h1"
        weight="bold"
        size="lg"
        className="self-center text-center"
      >
        <SparklesIcon className="inline-block mr-2 -mt-1" size={20} />
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
