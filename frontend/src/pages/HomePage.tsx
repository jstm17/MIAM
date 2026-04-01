import { Layout } from "../components/Layout";
import { useAuth } from "../hooks/useAuth";

export const HomePage = () => {
  const { user } = useAuth();
  return <Layout>{user?.name}</Layout>;
};
