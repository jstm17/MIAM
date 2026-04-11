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
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    control,
    trigger,
    setValue,
    reset,
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
        time: recipe.time,
        personsNumber: recipe.personsNumber,
        categories: recipe.categories.map((c) => c.name),
        ingredients: recipe.ingredients.map((i) => ({
          ingredient: i.ingredient.name,
          quantity: i.quantity,
        })),
        instructions: recipe.instructions.map((i) => ({
          content: i.content,
        })),
        image: recipe.image,
      });
    }
  }, [recipe, reset]);

  const queryClient = useQueryClient();

  const onSubmit = async (formData: UpdateRecipeFormData) => {
    try {
      const res = await updateRecipe(id!, formData);
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
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg">
        <FieldGroup className="relative">
          <div className="pb-20 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <TextInput
                capitalize
                label="Nom *"
                type="text"
                error={errors.name?.message}
                {...register("name")}
              />
              <div className="grid grid-cols-2 gap-4">
                <GroupInput
                  label="Durée *"
                  type="number"
                  inputGroupAddon="min."
                  error={errors.time?.message}
                  {...register("time", { valueAsNumber: true })}
                />
                <GroupInput
                  label="Nombre de personnes *"
                  type="number"
                  inputGroupAddon="pers."
                  error={errors.personsNumber?.message}
                  {...register("personsNumber", { valueAsNumber: true })}
                />
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
            />
          </div>

          <Field className="fixed bottom-[calc(58px+env(safe-area-inset-bottom))] inset-x-0 px-4 py-2 bg-background border-t max-w-lg m-auto flex-row gap-4">
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
