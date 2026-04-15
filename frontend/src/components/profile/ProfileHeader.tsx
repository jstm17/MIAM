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
import { useAuth } from "@/hooks/useAuth";
import { Ellipsis, LogOut, Pencil, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ProfileDeleteAccountDialog } from "../dialog/ProfileDeleteAccountDialog";
import { ProfileUpdateProfileDialog } from "../dialog/ProfileUpdateProfileDialog";
import { ProfileHeaderSkeleton } from "./skeletons/ProfileHeaderSkeleton";

export const ProfileHeader = () => {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Déconnexion réussie");
    navigate("/login");
  };

  if (isLoading) return <ProfileHeaderSkeleton />;

  return (
    <div className="flex items-center justify-between w-full p-4">
      <Button variant="outline" size="icon-lg">
        <Link to="/recipe-add">
          <Plus />
        </Link>
      </Button>
      <Typography variant="h1" weight="bold">
        {user?.name}
      </Typography>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon-lg" aria-label="More Options">
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-fit">
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => setUpdateDialogOpen(true)}>
              <Pencil />
              Modifier mon profil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => setDeleteDialogOpen(true)}
              variant="destructive"
            >
              <Trash />
              Supprimer mon compte
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

      <ProfileUpdateProfileDialog
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
