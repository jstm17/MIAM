import { Layout } from "@/components/shared/Layout";
import { TextInput } from "@/components/shared/TextInput";
import { Typography } from "@/components/shared/Typography";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import {
  registerSchema,
  type RegisterFormData,
} from "../schemas/registerForm.schemas";
import type { ApiError } from "../types/error.types";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser, error } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const onSubmit = async (formData: RegisterFormData) => {
    try {
      const res = (await registerUser(
        formData.name.charAt(0).toUpperCase() + formData.name.slice(1),
        formData.password,
      )) as { message: string };
      toast.success(res.message);
      navigate("/login");
    } catch (err: unknown) {
      const apiError = err as ApiError;
      toast.error(apiError.message);
    }
  };

  return (
    <Layout className="p-4 items-center justify-center" header>
      <Typography variant="h1" weight="bold" size="xl">
        Inscription
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg">
        <FieldGroup>
          <TextInput
            label="Nom"
            error={errors.name?.message}
            {...register("name")}
          />
          <TextInput
            label="Mot de passe"
            type="password"
            error={errors.password?.message}
            {...register("password")}
          />
          <Button type="submit" size="lg">
            S'inscrire
          </Button>
          <Button
            type="button"
            onClick={() => navigate("/login")}
            variant={"link"}
          >
            Se connecter
          </Button>
        </FieldGroup>
      </form>
    </Layout>
  );
};
