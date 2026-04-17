import { Typography } from "@/components/shared/Typography";
import { Reply } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export const CategoriesHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between w-full mb-4 gap-2">
      <Button
        size="icon-lg"
        variant="outline"
        aria-label="Retour"
        onClick={() => navigate("/search")}
      >
        <Reply />
      </Button>

      <Typography variant="body" weight="bold" size="lg">
        Toutes les catégories
      </Typography>
      <span className="w-[38.88px] h-[38.88px]"></span>
    </div>
  );
};
