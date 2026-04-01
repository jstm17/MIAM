import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../hooks/useAuth";
import { TextInput } from "../components/TextInput";
import { toast } from "sonner";
import { Loading } from "../components/Loading";
import { Layout } from "../components/Layout";
import { Button } from "../components/ui/button";
import { loginSchema, type LoginFormData } from "../schemas/loginForm.schemas";
import type { ApiError } from "../types/error.types";
import { FieldGroup } from "@/components/ui/field";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error, loading } = useAuth();

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
      const res = await login(formData.name, formData.password);
      toast.success(res.message);
      navigate("/");
    } catch (err: unknown) {
      const apiError = err as ApiError;
      toast.error(apiError.message);
    }
  };

  if (loading) return <Loading />;

  return (
    <Layout title="Connexion" noHeader className="min-h-screen">
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
