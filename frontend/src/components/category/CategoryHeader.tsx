import { Typography } from "@/components/shared/Typography";
import type { Category } from "@/types/category.types";
import { Reply } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

type CategoryHeaderProps = {
  category: Category;
};
export const CategoryHeader = ({ category }: CategoryHeaderProps) => {
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

      <Typography variant="body" weight="bold" size="lg">
        {category?.name}
      </Typography>
      <span className="w-[38.88px] h-[38.88px]"></span>
    </div>
  );
};
