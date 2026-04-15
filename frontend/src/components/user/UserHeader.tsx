import { Typography } from "@/components/shared/Typography";
import type { User } from "@/types/user.types";
import { Reply, Share } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShareUserDialog } from "../dialog/ShareUserDialog";
import { Button } from "../ui/button";

type UserHeaderProps = {
  user: User;
};
export const UserHeader = ({ user }: UserHeaderProps) => {
  const navigate = useNavigate();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  return (
    <div className="flex items-center justify-between w-full mb-4">
      <Button
        size="icon-lg"
        variant="outline"
        aria-label="Retour"
        onClick={() => navigate(-1)}
      >
        <Reply />
      </Button>

      <Typography variant="body" weight="bold">
        {user?.name}
      </Typography>
      <Button
        size="icon-lg"
        variant="outline"
        aria-label="Retour"
        onClick={() => setShareDialogOpen(true)}
      >
        <Share />
      </Button>

      <ShareUserDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        user={user!}
      />
    </div>
  );
};
