import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../hooks/useAuth";
import { TextInput } from "../components/shared/TextInput";
import { toast } from "sonner";
import { Layout } from "../components/shared/Layout";
import { Button } from "../components/ui/button";
import { loginSchema, type LoginFormData } from "../schemas/loginForm.schemas";
import type { ApiError } from "../types/error.types";
import { FieldGroup } from "@/components/ui/field";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
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
      );
      navigate("/");
    } catch (err: unknown) {
      const apiError = err as ApiError;
      toast.error(apiError.message);
    }
  };

  return (
    <Layout title="Connexion" className="items-center justify-center p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">
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
          <Button type="submit">Se connecter</Button>
          <Button
            type="button"
            variant="link"
            onClick={() => navigate("/register")}
          >
            S'inscrire
          </Button>
        </FieldGroup>
      </form>
    </Layout>
  );
};
