import { ProfileUpdateHeader } from "@/components/profile-edit/ProfileUpdateHeader";
import { Layout } from "@/components/shared/Layout";
import { TextInput } from "@/components/shared/TextInput";
import { Typography } from "@/components/shared/Typography";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/useAuth";
import { useUpdateUserProfile } from "@/hooks/users/useUpdateUserProfile";
import {
  updateUserProfileSchema,
  type UpdateUserProfileFormData,
} from "@/schemas/updateUserProfileForm.schemas";
import type { ApiError } from "@/types/error.types";
import { zodResolver } from "@hookform/resolvers/zod";
import imageCompression from "browser-image-compression";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const ProfileUpdatePage = () => {
  const { updateUserProfile, isPending } = useUpdateUserProfile();
  const { user, isAdmin, isLoading } = useAuth();
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(user?.avatar ?? null);
  const [inputKey, setInputKey] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateUserProfileFormData>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      name: user?.name,
    },
  });

  const onSubmit = async (formData: UpdateUserProfileFormData) => {
    try {
      const res = await updateUserProfile({
        name: formData.name
          ? formData.name.charAt(0).toUpperCase() + formData.name.slice(1)
          : undefined,
        avatar: formData.avatar,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      toast.success(res.message);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      toast.error(apiError.message);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setFileSize(null);
    setValue("avatar", "remove");
    setInputKey((k) => k + 1);
    if (inputRef.current) inputRef.current.value = "";
  };

  useEffect(() => {
    register("avatar");
  }, [register]);

  if (isLoading) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <Layout>
      <ProfileUpdateHeader />
      <form
        onSubmit={handleSubmit(onSubmit, (errors) => {
          console.log(errors);
        })}
        className="flex flex-col gap-4 mt-6"
        style={{
          paddingBottom: `calc(${isAdmin ? "80px" : "60px"} + env(safe-area-inset-bottom))`,
        }}
      >
        <FieldGroup>
          <div className="w-full flex flex-col  gap-2">
            {preview && (
              <div className="w-1/2 relative self-center">
                <AspectRatio ratio={1} className="bg-muted mb-2 rounded-2xl ">
                  <img
                    src={preview}
                    alt="Aperçu"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </AspectRatio>
                <Button
                  type="button"
                  onClick={handleRemoveImage}
                  variant={"outline"}
                  size="icon-lg"
                  className="absolute top-2 right-2 backdrop-blur-xs bg-black/10 dark:bg-black/10 hover:bg-muted/10 active:bg-muted/10 aria-expanded:bg-muted/10"
                  aria-label="Supprimer l'image"
                >
                  <X size={16} color="white" />
                </Button>
              </div>
            )}
            <TextInput
              key={inputKey}
              ref={inputRef}
              name="avatar"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              error={
                typeof errors.avatar?.message === "string"
                  ? errors.avatar.message
                  : undefined
              }
              description={`Formats acceptés : jpg, png, webp \n ${
                fileSize ? `Taille : ${fileSize}` : "Taille : 5Mo max"
              }`}
              onChange={async (e) => {
                const file = e.target.files?.[0];

                if (!file) return;

                try {
                  const compressed = await imageCompression(file, {
                    maxSizeMB: 1, // cible 1Mo max
                    maxWidthOrHeight: 1024, // redimensionne si trop grand
                    useWebWorker: true, // ne bloque pas le thread UI
                  });

                  setFileSize((compressed.size / 1024).toFixed(1) + " Ko");
                  setPreview(URL.createObjectURL(compressed));
                  setValue("avatar", compressed);
                } catch {
                  toast.error("Erreur lors de la compression de l'image");
                }
              }}
            >
              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={() => document.getElementById("avatar")?.click()}
              >
                {preview
                  ? "Changer la photo de profil"
                  : "Ajouter une photo de profil"}
              </Button>
            </TextInput>
          </div>
          <Separator className="h-px" />
          <TextInput
            label="Modifier le nom"
            type="text"
            error={errors.name?.message}
            {...register("name")}
          />

          <Separator className="h-px" />
          <div>
            <Typography className="mb-2">Modifier le mot de passe</Typography>
            <TextInput
              label="Mot de passe actuel"
              type="password"
              error={errors.currentPassword?.message}
              {...register("currentPassword")}
            />
          </div>
          <TextInput
            label="Nouveau mot de passe"
            type="password"
            error={errors.newPassword?.message}
            {...register("newPassword")}
          />
          <Field
            className="fixed inset-x-0 px-4 py-2 bg-background border-t max-w-lg m-auto flex-row gap-4"
            style={{
              bottom: `calc(${isAdmin ? "108px" : "58px"} + env(safe-area-inset-bottom))`,
            }}
          >
            <Button type="submit" disabled={isPending} size="lg">
              {isPending ? <Spinner /> : "Modifier"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </Layout>
  );
};
