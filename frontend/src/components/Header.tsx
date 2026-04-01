import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
export const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Déconnexion réussie");
    navigate("/login");
  };
  return (
    <header className="w-full flex gap-4 justify-between items-center p-8 justify-between">
      <Link to="/">Accueil</Link>
      <Button onClick={handleLogout} variant={"secondary"}>
        Déconnexion
      </Button>
    </header>
  );
};
