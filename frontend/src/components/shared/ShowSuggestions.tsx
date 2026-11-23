type ShowSuggestionsProps = {
  inputValue: string;
  items: { _id: string; name: string }[];
  onSelect: (value: string) => void;
  show: boolean;
  setShow: (show: boolean) => void;
  children: React.ReactNode;
};

const normalizeSearch = (str: string) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .trim();

export const ShowSuggestions = ({
  inputValue,
  items,
  onSelect,
  show,
  setShow,
  children,
}: ShowSuggestionsProps) => {
  const cleanInput = normalizeSearch(inputValue);

  const filtered = items.filter((item) => {
    if (!cleanInput) return true;
    const cleanItem = normalizeSearch(item.name);
    if (cleanItem.includes(cleanInput)) return true;

    // Si l'utilisateur tape un pluriel (ex: "pommes") mais que l'élément est au singulier ("pomme")
    if (cleanInput.endsWith("s") || cleanInput.endsWith("x")) {
      const singularInput = cleanInput.slice(0, -1);
      if (singularInput && cleanItem.includes(singularInput)) return true;
    }
    return false;
  });

  return (
    <div className="relative w-full">
      {children}
      {show && filtered.length > 0 && (
        <ul className="absolute z-50 w-full bg-popover border border-input rounded-lg shadow-md max-h-40 overflow-y-auto">
          {filtered.map((item) => (
            <li
              key={item._id}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-accent"
              onMouseDown={() => {
                onSelect(item.name);
                setShow(false);
              }}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
