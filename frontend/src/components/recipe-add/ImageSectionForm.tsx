import imageCompression from "browser-image-compression";
import { Image, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { toast } from "sonner";
import { TextInput } from "../shared/TextInput";
import { Typography } from "../shared/Typography";
import { AspectRatio } from "../ui/aspect-ratio";
import { Button } from "../ui/button";

import type { FieldValues } from "react-hook-form";

type ImageSectionFormProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  setValue: UseFormSetValue<T>;
  existingImage?: string;
  error?: string;
};

export const ImageSectionForm = <T extends FieldValues>({
  register,
  setValue,
  existingImage,
  error,
}: ImageSectionFormProps<T>) => {
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(existingImage ?? null);
  const [inputKey, setInputKey] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleRemoveImage = () => {
    setPreview(null);
    setFileSize(null);
    setValue("image" as Parameters<typeof setValue>[0], undefined as never);
    setInputKey((k) => k + 1);
    if (inputRef.current) inputRef.current.value = "";
  };

  useEffect(() => {
    register("image" as Parameters<typeof register>[0]);
  }, [register]);

  return (
    <div className="">
      <div className="border-b border-primary mb-4 py-1 flex gap-2 items-center justify-center bg-primary/10 rounded-t-xl">
        <Image size={20} />
        <Typography className="text-lg" weight="semibold">
          Photo
        </Typography>
      </div>
      <div className="flex flex-col gap-2">
        {preview && (
          <div className="relative">
            <AspectRatio ratio={21 / 9} className="bg-muted mb-2 rounded-xl">
              <img
                src={preview}
                alt="Aperçu"
                className="w-full h-full object-cover rounded-xl"
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
          name="image"
          type="file"
          className="hidden"
          accept="image/jpeg,image/png,image/webp"
          error={error}
          description={`Formats acceptés : jpg, png, webp \n ${
            fileSize ? `Taille : ${fileSize}` : "Taille : 5Mo max"
          }`}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            try {
              const compressed = await imageCompression(file, {
                maxSizeMB: 1,
                maxWidthOrHeight: 1024,
                useWebWorker: true,
              });

              setFileSize((compressed.size / 1024).toFixed(1) + " Ko");
              setPreview(URL.createObjectURL(compressed));
              setValue(
                "image" as Parameters<typeof setValue>[0],
                compressed as never,
              );
            } catch {
              toast.error("Erreur lors de la compression de l'image");
            }
          }}
        >
          <Button
            type="button"
            size="lg"
            variant="outline"
            onClick={() => document.getElementById("image")?.click()}
          >
            {preview ? (
              "Changer la photo"
            ) : (
              <>
                Ajouter une photo{" "}
                <span className="text-muted-foreground/50 text-xs">
                  (Optionnel)
                </span>
              </>
            )}
          </Button>
        </TextInput>
      </div>
    </div>
  );
};
