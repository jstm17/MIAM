import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";
import { Loading } from "@/components/Loading";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  registerSchema,
  type RegisterFormData,
} from "../schemas/registerForm.schemas";
import type { ApiError } from "../types/error.types";
import { TextInput } from "@/components/TextInput";
import { FieldGroup } from "@/components/ui/field";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser, error, loading } = useAuth();

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
      const res = await registerUser(formData.name, formData.password);
      toast.success(res.message);
      navigate("/login");
    } catch (err: unknown) {
      const apiError = err as ApiError;
      toast.error(apiError.message);
    }
  };

  if (loading) return <Loading />;

  return (
    <Layout title="Inscription" noHeader className="min-h-screen">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">
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
          <Button type="submit">S'inscrire</Button>
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
