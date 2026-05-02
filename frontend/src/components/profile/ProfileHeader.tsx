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
import { Ellipsis, LogOut, Pencil, Plus, Share, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ProfileDeleteAccountDialog } from "../dialog/ProfileDeleteAccountDialog";
import { ProfileUpdateProfileDialog } from "../dialog/ProfileUpdateProfileDialog";
import { ShareUserDialog } from "../dialog/ShareUserDialog";
import { ProfileHeaderSkeleton } from "./skeletons/ProfileHeaderSkeleton";

export const ProfileHeader = () => {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  useEffect(() => {
    if (!openDropdown) return;

    const startScrollY = window.scrollY;
    const THRESHOLD = 25;

    const handleScroll = () => {
      const diff = Math.abs(window.scrollY - startScrollY);

      if (diff > THRESHOLD) {
        setOpenDropdown(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [openDropdown]);

  const handleLogout = () => {
    logout();
    toast.success("Déconnexion réussie");
    navigate("/login");
  };

  if (isLoading) return <ProfileHeaderSkeleton />;

  return (
    <div className="flex items-center justify-between w-full p-4 pb-2 gap-2 max-w-full overflow-hidden whitespace-nowrap text-ellipsis">
      <Button variant="outline" size="icon-lg">
        <Link to="/add">
          <Plus />
        </Link>
      </Button>
      <Typography variant="h1" weight="bold" className="text-center truncate">
        {user?.name}
      </Typography>

      <DropdownMenu
        open={openDropdown}
        onOpenChange={setOpenDropdown}
        modal={false}
      >
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon-lg" aria-label="More Options">
            <Ellipsis fill="currentColor" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-fit">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => navigate("/profile-edit")}>
              <Pencil />
              Modifier mon profil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => setShareDialogOpen(true)}>
              <Share />
              Partager mon profil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => setDeleteDialogOpen(true)}
              variant="destructive"
            >
              <Trash2 />
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

      <ShareUserDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        user={user!}
        current
      />
    </div>
  );
};
