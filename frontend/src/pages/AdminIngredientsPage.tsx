import { IngredientsTable } from "@/components/admin/IngredientsTable";
import { DeleteIngredientDialog } from "@/components/dialog/DeleteIngredientDialog";
import { EmptyCard } from "@/components/shared/EmptyCard";
import { GroupInput } from "@/components/shared/GroupInput";
import { Layout } from "@/components/shared/Layout";
import { Loading } from "@/components/shared/Loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Empty } from "@/components/ui/empty";
import { useDeleteIngredient } from "@/hooks/ingredients/useDeleteIngredient";
import { useDeleteIngredients } from "@/hooks/ingredients/useDeleteIngredients";
import { useGetAllIngredients } from "@/hooks/ingredients/useGetAllIngredients";
import { useResetIngredientsUrl } from "@/hooks/ingredients/useResetIngredientsUrl";
import { useResetIngredientUrl } from "@/hooks/ingredients/useResetIngredientUrl";
import { useUpdateIngredientUrl } from "@/hooks/ingredients/useUpdateIngredientUrl";
import { ImageOff, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export const AdminIngredientsPage = () => {
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    ids: string[];
  }>({ open: false, ids: [] });
  const [searchTerm, setSearchTerm] = useState("");
  const [onlyMissingImage, setOnlyMissingImage] = useState(false);

  const { ingredients, totalIngredients, isLoading } = useGetAllIngredients();
  const { deleteIngredient } = useDeleteIngredient();
  const { resetUrl } = useResetIngredientUrl();
  const { deleteIngredients } = useDeleteIngredients();
  const { resetUrlMany } = useResetIngredientsUrl();
  const { updateUrl } = useUpdateIngredientUrl();

  const missingImagesCount = useMemo(() => {
    return ingredients.filter((i) => !i.url || i.url.trim() === "").length;
  }, [ingredients]);

  const filteredIngredients = useMemo(() => {
    const cleanSearch = searchTerm
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/œ/g, "oe")
      .replace(/æ/g, "ae")
      .trim();

    return ingredients.filter((item) => {
      if (onlyMissingImage && item.url && item.url.trim() !== "") {
        return false;
      }

      if (cleanSearch) {
        const cleanName = item.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/œ/g, "oe")
          .replace(/æ/g, "ae")
          .trim();
        return cleanName.includes(cleanSearch);
      }

      return true;
    });
  }, [ingredients, searchTerm, onlyMissingImage]);

  const handleDeleteMany = async (ids: string[]) => {
    deleteIngredients(ids)
      .then((data) => toast.success(data.message))
      .catch((error) => toast.error(error.message));
  };

  const handleResetUrlMany = async (ids: string[]) => {
    resetUrlMany(ids)
      .then((data) => toast.success(data.message))
      .catch((error) => toast.error(error.message));
  };

  const handleDeleteIngredient = async (id: string) => {
    deleteIngredient(id)
      .then((data) => {
        toast.success(data.message);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleResetUrl = async (id: string) => {
    resetUrl(id)
      .then((data) => {
        toast.success(data.message || "Image refétchée avec succès");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleUpdateUrl = async (id: string, url: string) => {
    updateUrl({ id, url })
      .then(() => {
        toast.success("URL mise à jour avec succès");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const confirmDelete = () => {
    if (deleteDialog.ids.length === 1) {
      handleDeleteIngredient(deleteDialog.ids[0]);
    } else {
      handleDeleteMany(deleteDialog.ids);
    }
  };
  if (isLoading) return <Loading />;

  if (!ingredients)
    return <Empty title="Impossible de récupérer les ingrédients" />;

  if (ingredients.length === 0) {
    return (
      <Layout title={`${totalIngredients} ingrédients`}>
        <EmptyCard title="Aucun ingrédient disponible" />
      </Layout>
    );
  }

  const isFiltered = Boolean(searchTerm || onlyMissingImage);

  return (
    <Layout
      title={
        isFiltered
          ? `${filteredIngredients.length} / ${totalIngredients} ingrédients`
          : `${totalIngredients} ingrédients`
      }
    >
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <GroupInput
            type="text"
            value={searchTerm}
            placeholder="Rechercher un ingrédient par son nom..."
            inputGroupAddon={
              <Search className="size-4 shrink-0 text-muted-foreground" />
            }
            groupAddonAlign="inline-start"
            inputGroupAddonClassName="pl-2.5!"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-1"
              aria-label="Effacer la recherche"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <Button
          type="button"
          variant={onlyMissingImage ? "default" : "outline"}
          onClick={() => setOnlyMissingImage((prev) => !prev)}
          className="gap-2 shrink-0 h-9"
        >
          <ImageOff className="size-4" />
          {missingImagesCount > 0 && (
            <Badge
              variant={onlyMissingImage ? "secondary" : "destructive"}
              className="px-1.5 py-0 text-[11px] h-4"
            >
              {missingImagesCount}
            </Badge>
          )}
        </Button>
      </div>

      {filteredIngredients.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl border bg-card text-muted-foreground gap-3 mb-4">
          <p className="text-sm">
            Aucun ingrédient ne correspond aux critères.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchTerm("");
              setOnlyMissingImage(false);
            }}
          >
            Réinitialiser les filtres
          </Button>
        </div>
      ) : (
        <IngredientsTable
          ingredients={filteredIngredients}
          onDelete={(id) => setDeleteDialog({ open: true, ids: [id] })}
          onResetUrl={handleResetUrl}
          onDeleteMany={(ids) => setDeleteDialog({ open: true, ids })}
          onResetUrlMany={handleResetUrlMany}
          onUpdateUrl={handleUpdateUrl}
        />
      )}

      <DeleteIngredientDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
        onDelete={confirmDelete}
        count={deleteDialog.ids.length}
      />
    </Layout>
  );
};
