import { Typography } from "@/components/shared/Typography";
import type { User } from "@/types/user.types";
import { Reply } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

type UserHeaderProps = {
  user: User;
};
export const UserHeader = ({ user }: UserHeaderProps) => {
  const navigate = useNavigate();

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
      <span className="w-[38.88px] h-[38.88px]"></span>
    </div>
  );
};
