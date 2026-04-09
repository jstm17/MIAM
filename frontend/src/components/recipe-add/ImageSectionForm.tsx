import type { AddRecipeFormData } from "@/schemas/addRecipeForm.schemas";
import type { UpdateRecipeFormData } from "@/schemas/updateRecipeForm.schemas";
import { Image, X } from "lucide-react";
import { useRef, useState } from "react";
import type { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { toast } from "sonner";
import { TextInput } from "../shared/TextInput";
import { Typography } from "../shared/Typography";
import { AspectRatio } from "../ui/aspect-ratio";
import { Button } from "../ui/button";

type ImageSectionFormProps = {
  register: UseFormRegister<AddRecipeFormData | UpdateRecipeFormData>;
  setValue: UseFormSetValue<AddRecipeFormData | UpdateRecipeFormData>;
  existingImage?: string;
};
export const ImageSectionForm = ({
  setValue,
  existingImage,
}: ImageSectionFormProps) => {
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(existingImage ?? null);
  const [inputKey, setInputKey] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleRemoveImage = () => {
    setPreview(null);
    setFileSize(null);
    setValue("image", undefined);
    setInputKey((k) => k + 1);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="">
      <div className="border-b border-primary mb-4 py-1 flex gap-2 items-center justify-center bg-primary/10 rounded-t-xl">
        <Image />
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
                className="w-full h-full object-cover dark:brightness-20 rounded-xl"
              />
            </AspectRatio>
            <Button
              type="button"
              onClick={handleRemoveImage}
              variant={"outline"}
              size={"icon"}
              className="absolute top-2 right-2"
              aria-label="Supprimer l'image"
            >
              <X size={16} />
            </Button>
          </div>
        )}
        <TextInput
          key={inputKey}
          label={preview ? "Changer la photo" : "Photo"}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          description={`Formats acceptés : jpg, png, webp \n ${
            fileSize ? `Taille : ${fileSize}` : "Taille : 5Mo max"
          }`}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              if (file.size > 5 * 1024 * 1024) {
                e.target.value = "";
                setFileSize(null);
                toast.error("L'image ne doit pas dépasser 5Mo");
                setValue("image", undefined);
              } else {
                setFileSize((file.size / 1024).toFixed(1) + " Ko");
                setPreview(URL.createObjectURL(file));
                setValue("image", file);
              }
            }
          }}
        />
      </div>
    </div>
  );
};
