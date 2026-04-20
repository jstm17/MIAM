import { Typography } from "@/components/shared/Typography";
import { Reply } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export const UsersHeaderCookingTime = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center px-4 justify-between w-full gap-2 max-w-full overflow-hidden whitespace-nowrap text-ellipsis">
      <Button
        size="icon-lg"
        variant="outline"
        aria-label="Retour"
        onClick={() => navigate("/search?tab=cooking-time")}
      >
        <Reply />
      </Button>

      <Typography
        variant="body"
        weight="bold"
        size="lg"
        className="text-center truncate"
      >
        Tous les chefs
      </Typography>
      <span className="w-[38.88px] h-[38.88px]"></span>
    </div>
  );
};
