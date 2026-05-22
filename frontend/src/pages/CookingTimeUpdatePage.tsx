import { DeviceSectionForm } from "@/components/cooking-time-add/DeviceSectionForm";
import { CategoriesSectionForm } from "@/components/recipe-add/CategoriesSectionForm";
import { ImageSectionForm } from "@/components/recipe-add/ImageSectionForm";
import { GroupInput } from "@/components/shared/GroupInput";
import { Layout } from "@/components/shared/Layout";
import { Loading } from "@/components/shared/Loading";
import { TextAreaInput } from "@/components/shared/TextAreaInput";
import { TextInput } from "@/components/shared/TextInput";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { useGetCookingTimeBySlug } from "@/hooks/cooking-times/useGetCookingTimeBySlug";
import { useUpdateCookingTime } from "@/hooks/cooking-times/useUpdateCookingTime";
import { useAuth } from "@/hooks/useAuth";
import {
  cookingTimeSchema,
  type CookingTimeFormData,
} from "@/schemas/cookingTimeForm.schemas";
import type { ApiError } from "@/types/error.types";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { NotFoundPage } from "./NotFoundPage";

export function CookingTimeUpdatePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { cookingTime, isLoading } = useGetCookingTimeBySlug(slug!);
  const { updateCookingTime, isPending } = useUpdateCookingTime();
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
  } = useForm<CookingTimeFormData>({
    resolver: zodResolver(cookingTimeSchema),
  });

  useEffect(() => {
    if (cookingTime) {
      reset({
        name: cookingTime.name,
        device: cookingTime.device ?? null,
        degreeCook:
          cookingTime.degreeCook === 0 ? null : cookingTime.degreeCook,
        timeCook: cookingTime.timeCook === 0 ? null : cookingTime.timeCook,
        methodCook: cookingTime.methodCook ?? null,
        notes: cookingTime.notes ?? null,
        categories: cookingTime.categories.map((c) => c.name),
        image: cookingTime.image,
        visible: cookingTime.visible,
      });
    }
  }, [cookingTime, reset]);

  const isPublic = watch("visible");

  const onSubmit = async (formData: CookingTimeFormData) => {
    try {
      const res = await updateCookingTime(slug!, formData);
      await queryClient.refetchQueries({ queryKey: ["cooking-time"] });
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

  console.log(cookingTime);
  console.log(isPublic);

  if (user!._id !== cookingTime?.addedBy._id && !isAdmin) {
    return (
      <NotFoundPage
        title="Accès refusé"
        description="Vous n'êtes pas l'auteur de ce temps de cuisson."
        buttonText="Retour"
        buttonLink={-1}
      />
    );
  }

  if (!cookingTime) {
    return (
      <NotFoundPage
        title="Temps de cuisson non trouvé"
        description="Désolé, le temps de cuisson que vous voulez modifier n'existe pas"
        buttonText="Retour"
        buttonLink={-1}
      />
    );
  }

  return (
    <Layout
      title="Modifier un temps de cuisson"
      titleSize="md"
      className="items-center pt-4 pb-[calc(env(safe-area-inset-bottom)+48px)]"
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
            <div className="flex flex-col gap-4 mx-4">
              <DeviceSectionForm
                defaultValue={cookingTime.device ?? undefined}
                setValue={setValue}
                errors={errors}
              />

              <TextInput
                capitalize
                label="Nom *"
                type="text"
                placeholder="Ex. Lasagne"
                error={errors.name?.message}
                {...register("name")}
              />
              <div className="grid grid-cols-2 gap-4">
                <GroupInput
                  label="Température"
                  type="number"
                  inputGroupAddon="°C"
                  placeholder="Ex. 180"
                  error={errors.degreeCook?.message}
                  {...register("degreeCook", {
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
                <TextInput
                  label="Mode de cuisson"
                  type="text"
                  placeholder="Ex. Airfryer"
                  error={errors.methodCook?.message}
                  {...register("methodCook", {
                    setValueAs: (v) => (v === "" ? undefined : v),
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
                    Temps de cuisson {isPublic ? "publique" : "privée"}
                  </span>
                </div>
              </div>
              <TextAreaInput
                label="Notes"
                placeholder="Ex. Retourner au bout de 6 minutes"
                error={errors.notes?.message}
                {...register("notes", {
                  setValueAs: (v) => (v === "" ? undefined : v),
                })}
              />
            </div>

            <CategoriesSectionForm
              trigger={trigger}
              control={control}
              setValue={setValue}
              errors={errors}
            />

            <ImageSectionForm
              register={register}
              setValue={setValue}
              existingImage={cookingTime.image}
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
