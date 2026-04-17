import { CategoriesSectionForm } from "@/components/recipe-add/CategoriesSectionForm";
import { ImageSectionForm } from "@/components/recipe-add/ImageSectionForm";
import { IngredientsSectionForm } from "@/components/recipe-add/IngredientsSectionForm";
import { InstructionsSectionForm } from "@/components/recipe-add/IntructionsSectionForm";
import { GroupInput } from "@/components/shared/GroupInput";
import { Layout } from "@/components/shared/Layout";
import { Loading } from "@/components/shared/Loading";
import { TextInput } from "@/components/shared/TextInput";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { useGetRecipeById } from "@/hooks/recipes/useGetRecipeById";
import { useUpdateRecipe } from "@/hooks/recipes/useUpdateRecipe";
import { useAuth } from "@/hooks/useAuth";
import {
  updateRecipeSchema,
  type UpdateRecipeFormData,
} from "@/schemas/updateRecipeForm.schemas";
import type { ApiError } from "@/types/error.types";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { NotFoundPage } from "./NotFoundPage";

export function RecipeUpdatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { recipe, isLoading } = useGetRecipeById(id!);
  const { updateRecipe, isPending } = useUpdateRecipe();
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    trigger,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<UpdateRecipeFormData>({
    resolver: zodResolver(updateRecipeSchema),
    defaultValues: {
      ingredients: [{ ingredient: "", quantity: "" }],
      instructions: [{ content: "" }],
    },
  });

  useEffect(() => {
    if (recipe) {
      reset({
        name: recipe.name,
        timePrep: recipe.timePrep === 0 ? null : recipe.timePrep,
        timeCook: recipe.timeCook === 0 ? null : recipe.timeCook,
        personsNumber: recipe.personsNumber === 0 ? null : recipe.personsNumber,
        categories: recipe.categories.map((c) => c.name),
        ingredients: recipe.ingredients.map((i) => ({
          ingredient: i.ingredient.name,
          quantity: i.quantity,
        })),
        instructions: recipe.instructions.map((i) => ({
          content: i.content,
        })),
        image: recipe.image,
        visible: recipe.visible,
      });
    }
  }, [recipe, reset]);

  const isPublic = watch("visible");

  const onSubmit = async (formData: UpdateRecipeFormData) => {
    try {
      const res = await updateRecipe(id!, {
        ...formData,
        personsNumber: formData.personsNumber ?? 0,
        timePrep: formData.timePrep ?? 0,
        timeCook: formData.timeCook ?? 0,
      });
      await queryClient.refetchQueries({ queryKey: ["recipe"] });
      // navigate(`/recipe/${res.data.slug}`);
      navigate(-1);
      toast.success(res.message);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      toast.error(apiError.message);
    }
  };

  if (isLoading || isPending) {
    return <Loading />;
  }

  console.log(recipe);
  console.log(isPublic);

  if (user!._id !== recipe?.addedBy._id) {
    return (
      <NotFoundPage
        title="Accès refusé"
        description="Vous n'êtes pas l'auteur de cette recette."
        buttonText="Retour"
        buttonLink={-1}
      />
    );
  }

  if (!recipe) {
    return (
      <NotFoundPage
        title="Recette non trouvée"
        description="Désolé, la recette que vous voulez modifier n'existe pas"
        buttonText="Retour"
        buttonLink={-1}
      />
    );
  }

  return (
    <Layout
      title="Modifier une recette"
      titleSize="md"
      className="items-center p-4 pb-[calc(env(safe-area-inset-bottom)+48px)]"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-lg"
        style={{
          paddingBottom: `calc(${isAdmin ? "16px" : "0"} + env(safe-area-inset-bottom))`,
        }}
      >
        <FieldGroup className="relative">
          <div className="pb-20 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
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
                  <label className="text-sm font-medium">Visibilité</label>
                  <div className="flex items-center space-x-2">
                    <EyeOff size={16} />
                    <Switch
                      id="visible"
                      checked={isPublic}
                      onCheckedChange={(checked) =>
                        setValue("visible", checked)
                      }
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
              existingImage={recipe.image}
              error={
                typeof errors.image?.message === "string"
                  ? errors.image.message
                  : undefined
              }
            />
          </div>

          <Field
            className="fixed inset-x-0 px-4 py-2 bg-background border-t max-w-lg m-auto flex-row gap-4"
            style={{
              bottom: `calc(${isAdmin ? "108px" : "58px"} + env(safe-area-inset-bottom))`,
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
              Modifier
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </Layout>
  );
}
