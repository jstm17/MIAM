import miamLogo from "@/assets/miam-logo.svg";

export const HomeHeader = () => {
  return (
    <div className="flex justify-center mb-4">
      <img src={miamLogo} alt="Miam logo" className="h-6" />
    </div>
  );
};
