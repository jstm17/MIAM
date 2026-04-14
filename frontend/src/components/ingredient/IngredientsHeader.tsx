import { Typography } from "@/components/shared/Typography";
import { Reply } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../ui/button";

export const IngredientsHeader = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between w-full mb-4">
      <Button
        size="icon-lg"
        variant="outline"
        aria-label="Retour"
        onClick={() => navigate(`/search?${searchParams}`)}
      >
        <Reply />
      </Button>

      <Typography variant="body" weight="bold" size="lg">
        Recherche par ingrédients
      </Typography>
      <span className="w-[38.88px] h-[38.88px]"></span>
    </div>
  );
};
