import { Ellipsis, LogOut, Pencil, Plus, Trash } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Typography } from "@/components/shared/Typography";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { ProfileHeaderSkeleton } from "./skeletons/ProfileHeaderSkeleton";
import { ProfileUpdateNameDialog } from "./ProfileUpdateNameDialog";
import { useState } from "react";
import { ProfileDeleteAccountDialog } from "./ProfileDeleteAccountDialog";

export const ProfileHeader = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Déconnexion réussie");
    navigate("/login");
  };

  if (loading) return <ProfileHeaderSkeleton />;

  return (
    <div className="flex items-center justify-between w-full p-4">
      <Button variant="outline" size="icon">
        <Link to="/recipe-add">
          <Plus />
        </Link>
      </Button>
      <Typography variant="body" weight="bold">
        {user?.name}
      </Typography>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" aria-label="More Options">
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-fit">
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => setUpdateDialogOpen(true)}>
              <Pencil />
              Modifier son nom
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => setDeleteDialogOpen(true)}
              variant="destructive"
            >
              <Trash />
              Supprimer son compte
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={handleLogout}>
              <LogOut />
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileUpdateNameDialog
        open={updateDialogOpen}
        onOpenChange={setUpdateDialogOpen}
      />
      <ProfileDeleteAccountDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </div>
  );
};
