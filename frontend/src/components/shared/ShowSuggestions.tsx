type ShowSuggestionsProps = {
  inputValue: string;
  items: { _id: string; name: string }[];
  onSelect: (value: string) => void;
  show: boolean;
  setShow: (show: boolean) => void;
  children: React.ReactNode;
};

export const ShowSuggestions = ({
  inputValue,
  items,
  onSelect,
  show,
  setShow,
  children,
}: ShowSuggestionsProps) => {
  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(inputValue.toLowerCase()),
  );

  return (
    <div className="relative w-full">
      {children}
      {show && filtered.length > 0 && (
        <ul className="absolute z-10 w-full bg-popover border border-input rounded-lg shadow-md max-h-40 overflow-y-auto">
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
