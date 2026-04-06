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
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useUpdateUserName } from "@/hooks/users/useUpdateUserName";
import { cn } from "@/lib/utils";
import {
  updateUserNameSchema,
  type UpdateUserNameFormData,
} from "@/schemas/updateUserNameForm.schemas";
import type { ApiError } from "@/types/error.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { TextInput } from "../shared/TextInput";
import { FieldGroup } from "../ui/field";

type ProfileUpdateNameDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
export function ProfileUpdateNameDialog({
  open,
  onOpenChange,
}: ProfileUpdateNameDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Changer de nom</DialogTitle>
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
          <DrawerTitle>Changer de nom</DrawerTitle>
        </DrawerHeader>
        <ProfileForm className="px-4" onOpenChange={onOpenChange} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Annuler</Button>
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
  const { updateUserName } = useUpdateUserName();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserNameFormData>({
    resolver: zodResolver(updateUserNameSchema),
  });

  const onSubmit = async (formData: UpdateUserNameFormData) => {
    try {
      const res = await updateUserName(
        formData.name.charAt(0).toUpperCase() + formData.name.slice(1),
      );
      toast.success(res.message);
      onOpenChange(false);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      toast.error(apiError.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("grid items-start gap-6", className)}
    >
      <FieldGroup>
        <TextInput
          label="Nouveau nom"
          type="text"
          error={errors.name?.message}
          {...register("name")}
        />

        <Button type="submit">Modifier</Button>
      </FieldGroup>
    </form>
  );
}
