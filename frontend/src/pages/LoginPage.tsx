import { CheckboxInput } from "@/components/shared/CheckboxInput";
import { Typography } from "@/components/shared/Typography";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Layout } from "../components/shared/Layout";
import { TextInput } from "../components/shared/TextInput";
import { Button } from "../components/ui/button";
import { useAuth } from "../hooks/useAuth";
import { loginSchema, type LoginFormData } from "../schemas/loginForm.schemas";
import type { ApiError } from "../types/error.types";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error, isLoginPending } = useAuth();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: true,
    },
  });

  const sessionExpired =
    new URLSearchParams(location.search).get("session") === "expired";

  useEffect(() => {
    if (sessionExpired) {
      toast.info("Veuillez vous connecter pour accéder à vos recettes");
    }
    if (error) toast.error(error);
  }, [sessionExpired, error]);

  const onSubmit = async (formData: LoginFormData) => {
    try {
      await login(
        formData.name.charAt(0).toUpperCase() + formData.name.slice(1),
        formData.password,
        formData.rememberMe ?? false,
      );
      navigate("/");
    } catch (err: unknown) {
      const apiError = err as ApiError;
      toast.error(apiError.message);
    }
  };

  return (
    <Layout className="p-4 items-center justify-center" header>
      <Typography variant="h1" weight="bold" size="xl">
        Connexion
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg">
        <FieldGroup>
          <TextInput
            label="Nom"
            type="text"
            error={errors.name?.message}
            {...register("name")}
          />
          <TextInput
            label="Mot de passe"
            type="password"
            error={errors.password?.message}
            {...register("password")}
          />
          <Controller
            name="rememberMe"
            control={control}
            defaultValue={true}
            render={({ field }) => (
              <CheckboxInput
                label="Se souvenir de moi"
                name={field.name}
                onChange={field.onChange}
                checked={field.value}
              />
            )}
          />
          <Button type="submit" size="lg" disabled={isLoginPending}>
            {isLoginPending ? <Spinner /> : "Se connecter"}
          </Button>
          <Button
            type="button"
            variant="link"
            onClick={() => navigate("/register")}
            size="lg"
          >
            S'inscrire
          </Button>
        </FieldGroup>
      </form>
    </Layout>
  );
};
