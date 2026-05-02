import { CategoriesSectionForm } from "@/components/recipe-add/CategoriesSectionForm";
import { ImageSectionForm } from "@/components/recipe-add/ImageSectionForm";
import { IngredientsSectionForm } from "@/components/recipe-add/IngredientsSectionForm";
import { InstructionsSectionForm } from "@/components/recipe-add/IntructionsSectionForm";
import { GroupInput } from "@/components/shared/GroupInput";
import { Loading } from "@/components/shared/Loading";
import { TextInput } from "@/components/shared/TextInput";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { useAddRecipe } from "@/hooks/recipes/useAddRecipe";
import { useAuth } from "@/hooks/useAuth";
import type { RecipeFormData } from "@/schemas/recipeForm.schemas";
import { recipeSchema } from "@/schemas/recipeForm.schemas";
import type { ApiError } from "@/types/error.types";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function RecipeAddContent() {
  const navigate = useNavigate();
  const { addRecipe, isPending } = useAddRecipe();
  const { isAdmin } = useAuth();
  const {
    register,
    handleSubmit,
    control,
    trigger,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      ingredients: [{ ingredient: "", quantity: "" }],
      instructions: [{ content: "" }],
      visible: true,
      // name: "Pain",
      // timePrep: 30,
      // personsNumber: 4,
      // ingredients: [
      //   { ingredient: "Poulet", quantity: "1" },
      //   // { ingredient: "Sel", quantity: "1 pincée" },
      //   // { ingredient: "Eau", quantity: "500 ml" },
      //   // { ingredient: "Pâte", quantity: "500 ml" },
      //   // { ingredient: "Pate", quantity: "500 ml" },
      //   // { ingredient: "Pâte brisée", quantity: "500 ml" },
      // ],
      // instructions: [{ content: "1" }],
      // categories: ["Italienne", "Rapide"],
    },
  });

  const isPublic = watch("visible");

  const onSubmit = async (formData: RecipeFormData) => {
    try {
      const res = await addRecipe({
        ...formData,
        ingredients: formData.ingredients?.map((item) => ({
          ingredient: item.ingredient
            ? item.ingredient.charAt(0).toUpperCase() + item.ingredient.slice(1)
            : "",
          quantity: item.quantity,
        })),
        personsNumber: formData.personsNumber ?? 0,
        timePrep: formData.timePrep ?? 0,
        timeCook: formData.timeCook ?? 0,
      });
      navigate("/recipe/" + res.data.slug);
      toast.success(res.message);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      toast.error(apiError.message);
    }
  };

  if (isPending) {
    return <Loading />;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-lg"
      style={{
        paddingBottom: `calc(${
          isAdmin ? "16px" : "0"
        } + env(safe-area-inset-bottom))`,
      }}
    >
      <FieldGroup className="relative">
        <div className="pb-20 flex flex-col gap-8">
          <div className="flex flex-col gap-4 px-4">
            <TextInput
              capitalize
              label="Nom *"
              type="text"
              placeholder="Ex. Gâteau au chocolat"
              error={errors.name?.message}
              {...register("name")}
            />
            <div className="grid grid-cols-2 gap-4">
              <GroupInput
                label="Temps de prépa."
                type="number"
                inputGroupAddon="min."
                placeholder="Ex. 30"
                error={errors.timePrep?.message}
                {...register("timePrep", {
                  setValueAs: (v) =>
                    v === "" || v === null || v === undefined
                      ? undefined
                      : Number(v),
                })}
              />
              <GroupInput
                label="Temps de cuisson"
                type="number"
                inputGroupAddon="min."
                placeholder="Ex. 30"
                error={errors.timeCook?.message}
                {...register("timeCook", {
                  setValueAs: (v) =>
                    v === "" || v === null || v === undefined
                      ? undefined
                      : Number(v),
                })}
              />
              <GroupInput
                label="Nombre de personnes"
                type="number"
                inputGroupAddon="pers."
                placeholder="Ex. 4"
                error={errors.personsNumber?.message}
                {...register("personsNumber", {
                  setValueAs: (v) =>
                    v === "" || v === null || v === undefined
                      ? undefined
                      : Number(v),
                })}
              />
              <div className="flex flex-col gap-2 items-center">
                <label className="text-sm font-medium" htmlFor="visible">
                  Visibilité
                </label>
                <div className="flex items-center space-x-2">
                  <EyeOff size={16} />
                  <Switch
                    id="visible"
                    checked={isPublic}
                    onCheckedChange={(checked) => setValue("visible", checked)}
                    className={isPublic ? "bg-primary" : "bg-input"}
                  />
                  <Eye size={16} />
                </div>
                <span className="text-muted-foreground/80 text-xs leading-3">
                  Recette {isPublic ? "publique" : "privée"}
                </span>
              </div>
            </div>
          </div>

          <IngredientsSectionForm
            control={control}
            register={register}
            setValue={setValue}
            errors={errors}
          />

          <InstructionsSectionForm
            control={control}
            register={register}
            errors={errors}
          />

          <CategoriesSectionForm
            trigger={trigger}
            control={control}
            setValue={setValue}
            errors={errors}
          />

          <ImageSectionForm
            register={register}
            setValue={setValue}
            error={
              typeof errors.image?.message === "string"
                ? errors.image.message
                : undefined
            }
          />
        </div>

        <Field
          className="fixed inset-x-0 px-4 py-2 bg-background border-t max-w-lg m-auto flex-row gap-4 z-10"
          style={{
            bottom: `calc(${
              isAdmin ? "108px" : "58px"
            } + env(safe-area-inset-bottom))`,
          }}
        >
          <Button
            size="lg"
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => navigate(-1)}
          >
            Retour
          </Button>
          <Button type="submit" className="flex-1" size="lg">
            Ajouter
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
