import { useAuth } from "@/hooks/useAuth";
import { Reply } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Typography } from "../shared/Typography";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

export const ProfileUpdateHeader = () => {
  const { user, isLoading } = useAuth();

  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between w-full">
      <Button variant="outline" size="icon-lg" onClick={() => navigate(-1)}>
        <Reply />
      </Button>
      {isLoading ? (
        <Skeleton className="h-5 w-24" />
      ) : (
        <Typography variant="h1" weight="bold">
          {user?.name}
        </Typography>
      )}
      <div className="h-[38.88] w-[38.88]"></div>
    </div>
  );
};
