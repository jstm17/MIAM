import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useAuth } from "@/hooks/useAuth";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useUpdateUserProfile } from "@/hooks/users/useUpdateUserProfile";
import { cn } from "@/lib/utils";
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
import { TextInput } from "../shared/TextInput";
import { AspectRatio } from "../ui/aspect-ratio";
import { FieldGroup } from "../ui/field";
import { Separator } from "../ui/separator";
import { Spinner } from "../ui/spinner";

type ProfileUpdateProfileDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
export function ProfileUpdateProfileDialog({
  open,
  onOpenChange,
}: ProfileUpdateProfileDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Modifier mon profil</DialogTitle>
          </DialogHeader>
          <ProfileForm onOpenChange={onOpenChange} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Modifier mon profil</DrawerTitle>
        </DrawerHeader>
        <ProfileForm className="px-4" onOpenChange={onOpenChange} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline" size="lg">
              Annuler
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

type ProfileFormProps = {
  className?: string;
  onOpenChange: (open: boolean) => void;
};

function ProfileForm({ className, onOpenChange }: ProfileFormProps) {
  const { updateUserProfile, isPending } = useUpdateUserProfile();
  const { user, isLoading } = useAuth();
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
      });
      toast.success(res.message);
      onOpenChange(false);
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
    <form
      onSubmit={handleSubmit(onSubmit, (errors) => {
        console.log(errors);
      })}
      className={cn("grid items-center gap-4", className)}
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
            error={typeof errors.avatar?.message === "string" ? errors.avatar.message : undefined}
            description={`Formats acceptés : jpg, png, webp \n ${
              fileSize ? `Taille : ${fileSize}` : "Taille : 5Mo max"
            }`}
            onChange={async (e) => {
              const file = e.target.files?.[0];

              console.log(file);
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
        <Button type="submit" disabled={isPending} size="lg">
          {isPending ? <Spinner /> : "Modifier"}
        </Button>
      </FieldGroup>
    </form>
  );
}
