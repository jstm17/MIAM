import { Typography } from "@/components/shared/Typography";
import { Reply } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export const CategoriesHeaderCookingTime = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between w-full px-4 gap-2 max-w-full overflow-hidden whitespace-nowrap text-ellipsis">
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
        Toutes les catégories
      </Typography>
      <span className="w-[38.88px] h-[38.88px]"></span>
    </div>
  );
};
