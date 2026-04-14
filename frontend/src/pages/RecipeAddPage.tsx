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
import { useAddRecipe } from "@/hooks/recipes/useAddRecipe";
import {
  addRecipeSchema,
  type AddRecipeFormData,
} from "@/schemas/addRecipeForm.schemas";
import type { ApiError } from "@/types/error.types";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function RecipeAddPage() {
  const navigate = useNavigate();
  const { addRecipe, isPending } = useAddRecipe();

  const {
    register,
    handleSubmit,
    control,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<AddRecipeFormData>({
    resolver: zodResolver(addRecipeSchema),
    defaultValues: {
      // ingredients: [{ ingredient: "", quantity: "" }],
      // instructions: [{ content: "" }],
      name: "Pain",
      time: 30,
      personsNumber: 4,
      ingredients: [
        { ingredient: "Poulet", quantity: "1" },
        // { ingredient: "Sel", quantity: "1 pincée" },
        // { ingredient: "Eau", quantity: "500 ml" },
        // { ingredient: "Pâte", quantity: "500 ml" },
        // { ingredient: "Pate", quantity: "500 ml" },
        // { ingredient: "Pâte brisée", quantity: "500 ml" },
      ],
      instructions: [{ content: "1" }],
      categories: ["Italienne", "Rapide"],
    },
  });

  const onSubmit = async (formData: AddRecipeFormData) => {
    console.log("RecipeAddPage - onSubmit", formData);
    try {
      const res = await addRecipe(formData);
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
    <Layout
      title="Ajouter une recette"
      titleSize="lg"
      className="items-center p-4 pb-[calc(env(safe-area-inset-bottom)+48px)]"
    >
      <form
        onSubmit={handleSubmit(onSubmit, (errors) => {
          console.log("RecipeAddPage - submission errors", errors);
          toast.error("Le formulaire contient des erreurs");
        })}
        className="w-full max-w-lg"
      >
        <FieldGroup className="relative">
          <div className="pb-20 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <TextInput
                capitalize
                label="Nom *"
                type="text"
                placeholder="Ex. Pâtes carbonara"
                error={errors.name?.message}
                {...register("name")}
              />
              <div className="grid grid-cols-2 gap-4">
                <GroupInput
                  label="Durée *"
                  type="number"
                  inputGroupAddon="min."
                  placeholder="Ex. 30"
                  error={errors.time?.message}
                  {...register("time", { valueAsNumber: true })}
                />
                <GroupInput
                  label="Nombre de personnes *"
                  type="number"
                  inputGroupAddon="pers."
                  placeholder="Ex. 4"
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

            <ImageSectionForm register={register} setValue={setValue} />
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
              Ajouter
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </Layout>
  );
}
