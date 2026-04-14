import { CommandItem } from "../ui/command";

type SearchCommandItemProps = {
  id: string;
  label: string;
  icon: React.ReactNode;
  meta?: { icon: React.ReactNode; value: string | number };
  onSelect: () => void;
};

export const SearchCommandItem = ({
  id,
  label,
  icon,
  meta,
  onSelect,
}: SearchCommandItemProps) => (
  <CommandItem key={id} onSelect={onSelect}>
    {icon}
    <span className="flex-1">{label}</span>
    {meta && (
      <span className="text-xs text-muted-foreground -mr-6 flex items-center gap-1">
        {meta.icon}
        {meta.value}
      </span>
    )}
  </CommandItem>
);
