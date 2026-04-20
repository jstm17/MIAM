import { CommandItem } from "../ui/command";

type SearchCommandItemProps = {
  id: string;
  label: string;
  icon: React.ReactNode;
  metaRecipe?: { icon: React.ReactNode; value: string | number };
  metaCookingTime?: { icon: React.ReactNode; value: string | number };
  onSelect: () => void;
};

export const SearchCommandItem = ({
  id,
  label,
  icon,
  metaRecipe,
  metaCookingTime,
  onSelect,
}: SearchCommandItemProps) => (
  <CommandItem key={id} onSelect={onSelect}>
    {icon}
    <span className="flex-1">{label}</span>
    <div className="flex gap-2  -mr-6">
      {metaRecipe && (
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          {metaRecipe.icon}
          {metaRecipe.value}
        </span>
      )}
      {metaCookingTime && (
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          {metaCookingTime.icon}
          {metaCookingTime.value}
        </span>
      )}
    </div>
  </CommandItem>
);
