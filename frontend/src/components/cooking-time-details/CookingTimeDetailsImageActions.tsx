import { DeleteCookingTimeDialog } from "@/components/dialog/DeleteCookingTimeDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToggleCookingTimeVisibility } from "@/hooks/cooking-times/useToggleCookingTimeVisibility";
import { useAuth } from "@/hooks/useAuth";
import { useGetSavedCookingTimes } from "@/hooks/users/useGetSavedCookingTimes";
import { useSaveCookingTime } from "@/hooks/users/useSaveCookingTime";
import { useUnsaveCookingTime } from "@/hooks/users/useUnsaveCookingTime";
import type { CookingTime } from "@/types/cookingTime.types";
import {
  BookmarkIcon,
  Ellipsis,
  Eye,
  EyeOff,
  Pencil,
  Reply,
  Share,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { ShareCookingTimeDialog } from "../dialog/ShareCookingTimeDialog";

export const CookingTimeDetailsImageActions = ({
  cookingTime,
}: {
  cookingTime: CookingTime;
}) => {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  const { saveCookingTime, isPending: isSaving } = useSaveCookingTime();
  const { unsaveCookingTime, isPending: isUnsaving } = useUnsaveCookingTime();
  const {
    cookingTimes: savedCookingTimes,
    isLoading: isLoadingSavedCookingTimes,
  } = useGetSavedCookingTimes();
  const { toggleVisibility, isPending: isPendingVisibility } =
    useToggleCookingTimeVisibility();

  const { user, isLoading: isLoadingAuth } = useAuth();
  const { _id, slug, addedBy, visible } = cookingTime;

  const isSaved = savedCookingTimes.some((r) => r._id === _id);

  const isMyCookingTime = addedBy._id === user?._id;

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

  const handleSaveCookingTime = (
    e: React.MouseEvent,
    cookingTimeId: string,
    isSaved: boolean,
  ) => {
    e.preventDefault();
    if (isSaved) {
      unsaveCookingTime(cookingTimeId);
    } else {
      saveCookingTime(cookingTimeId);
    }
  };

  const handleToggleCookingTimeVisibility = (
    e: React.MouseEvent,
    cookingTimeId: string,
    visible: boolean,
  ) => {
    e.preventDefault();
    toggleVisibility(cookingTimeId, visible);
    toast.success(
      visible
        ? "Le temps de cuisson n'est plus visible par les autres"
        : "Le temps de cuisson est maintenant visible par les autres",
    );
  };

  const buttonClass =
    "backdrop-blur-sm bg-black/10 dark:bg-black/10 hover:bg-muted/10 active:bg-muted/10 aria-expanded:bg-muted/10";

  return (
    <div className="absolute p-4 top-0 z-10 flex justify-between w-full">
      <Button
        size="icon-lg"
        variant="outline"
        aria-label="Retour"
        className="backdrop-blur-xs bg-black/10 dark:bg-black/10 hover:bg-muted/10 active:bg-muted/10 aria-expanded:bg-muted/10"
        onClick={() => navigate(-1)}
      >
        <Reply color="white" />
      </Button>

      <div className="flex gap-2 items-center">
        {!visible && <EyeOff color="white" className="drop-shadow-sm" />}

        {user && (
          <Button
            size="icon-lg"
            variant="outline"
            aria-label="Save CookingTime"
            className={buttonClass}
            onClick={(e) => handleSaveCookingTime(e, _id, isSaved)}
            disabled={
              isLoadingAuth ||
              isSaving ||
              isUnsaving ||
              isLoadingSavedCookingTimes
            }
          >
            <BookmarkIcon
              fill={isSaved ? "currentColor" : "transparent"}
              className="text-white"
            />
          </Button>
        )}

        {(!user || !isMyCookingTime) && (
          <Button
            size="icon-lg"
            variant="outline"
            aria-label="Share CookingTime"
            className={buttonClass}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShareDialogOpen(true);
            }}
          >
            <Share className="text-white" />
          </Button>
        )}

        {isMyCookingTime && (
          <DropdownMenu
            open={openDropdown}
            onOpenChange={setOpenDropdown}
            modal={false}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon-lg"
                aria-label="More Options"
                className={buttonClass}
              >
                <Ellipsis fill="currentColor" className="text-white"/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-fit">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/cooking-time-edit/${slug}`);
                  }}
                >
                  <Pencil />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  disabled={isPendingVisibility}
                  onClick={(e) =>
                    handleToggleCookingTimeVisibility(e, _id, visible)
                  }
                >
                  {visible ? (
                    <>
                      <EyeOff />
                      Rendre privé
                    </>
                  ) : (
                    <>
                      <Eye />
                      Rendre public
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    setShareDialogOpen(true);
                  }}
                >
                  <Share />
                  Partager
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    setDeleteDialogOpen(true);
                  }}
                  variant="destructive"
                >
                  <Trash2 />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <DeleteCookingTimeDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        cookingTimeId={_id}
        navigate={() => navigate(-1)}
      />

      <ShareCookingTimeDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        cookingTime={cookingTime}
      />
    </div>
  );
};
