import { Loading } from "@/components/shared/Loading";
import { Typography } from "@/components/shared/Typography";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Layout } from "../components/shared/Layout";
import { TextInput } from "../components/shared/TextInput";
import { Button } from "../components/ui/button";
import { useResetPassword } from "../hooks/users/useResetPassword";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "../schemas/resetPasswordForm.schemas";

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resetPasswordMutation = useResetPassword();

  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    if (!token) {
      toast.error("Token manquant");
      navigate("/login");
    }
  }, [token, navigate]);

  const onSubmit = async (formData: ResetPasswordFormData) => {
    if (!token) return;

    resetPasswordMutation.mutate({
      token,
      newPassword: formData.newPassword,
    });
  };

  if (!token) {
    return <Loading />;
  }

  return (
    <Layout className="p-4 items-center justify-center" header>
      <Typography variant="h1" weight="bold" size="xl">
        Réinitialisation du mot de passe
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg">
        <FieldGroup>
          <TextInput
            label="Nouveau mot de passe"
            type="password"
            {...register("newPassword")}
            error={errors.newPassword?.message}
          />

          <TextInput
            label="Confirmer le mot de passe"
            type="password"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />

          <Button
            type="submit"
            size="lg"
            disabled={resetPasswordMutation.isPending}
            className="w-full"
          >
            {resetPasswordMutation.isPending ? <Spinner /> : "Réinitialiser"}
          </Button>
        </FieldGroup>
      </form>
    </Layout>
  );
};
