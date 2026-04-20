import { Typography } from "@/components/shared/Typography";
import type { Category } from "@/types/category.types";
import { Reply, Share } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShareCategoryDialog } from "../dialog/ShareCategoryDialog";
import { Button } from "../ui/button";

type CategoryHeaderProps = {
  category: Category;
};
export const CategoryHeader = ({ category }: CategoryHeaderProps) => {
  const navigate = useNavigate();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  return (
    <div className="flex items-center justify-between w-full px-4 gap-2 max-w-full overflow-hidden whitespace-nowrap text-ellipsis">
      <Button
        size="icon-lg"
        variant="outline"
        aria-label="Retour"
        onClick={() => navigate(-1)}
      >
        <Reply />
      </Button>

      <Typography
        variant="body"
        weight="bold"
        size="lg"
        className="text-center truncate"
      >
        {category?.name}
      </Typography>
      <Button
        size="icon-lg"
        variant="outline"
        aria-label="Retour"
        onClick={() => setShareDialogOpen(true)}
      >
        <Share />
      </Button>

      <ShareCategoryDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        category={category}
      />
    </div>
  );
};
