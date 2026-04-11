import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ListFilter } from "lucide-react";
import { Typography } from "../shared/Typography";
import { Button } from "../ui/button";
import { Field } from "../ui/field";
type CategoryFiltersProps = {
  title: string;
  totalElement: number;
  sort: string;
  setSort: React.Dispatch<React.SetStateAction<string>>;
};
export const CategoryFilters = ({
  title,
  totalElement,
  sort,
  setSort,
}: CategoryFiltersProps) => {
  return (
    <div className="flex justify-between items-center">
      <Typography variant="body" className="text-muted-foreground">
        {totalElement} {title}
      </Typography>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon-lg">
            <ListFilter />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64" align="end">
          <PopoverHeader>
            <PopoverTitle className="text-base font-semibold">
              Trier
            </PopoverTitle>
          </PopoverHeader>
          <Field>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="name">
                    Par ordre alphabétique (A-Z)
                  </SelectItem>
                  <SelectItem value="recipes">
                    Ayant le plus de recettes
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </PopoverContent>
      </Popover>
    </div>
  );
};
