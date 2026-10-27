import miamLogo from "@/assets/miam-logo.svg";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export const HomeHeader = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between items-center mb-3 w-full gap-2 px-4">
      <span className="w-[38.88px] h-[38.88px]"></span>

      <img src={miamLogo} alt="Miam logo" className="h-6" />
      <div className="w-[38.88px]">
        <Button
          variant="ia"
          size="icon-lg"
          onClick={() => navigate("/chat")}
          className=""
        >
          <Sparkles />
        </Button>
      </div>
    </div>
  );
};
