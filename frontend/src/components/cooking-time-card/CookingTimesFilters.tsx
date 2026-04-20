import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Field } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CookingTime } from "@/types/cookingTime.types";
import { ListFilter } from "lucide-react";
import { Typography } from "../shared/Typography";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { CookingTimeFiltersCategory } from "./CookingTimeFiltersCategory";
import { CookingTimeFiltersUser } from "./CookingTimeFiltersUser";
import { CookingTimeFiltersVisibility } from "./CookingTimeFiltersVisibility";

type CookingTimesFiltersProps = {
  title: string;
  originalCookingTimes: CookingTime[];
  totalElement: number;
  sort: string;
  setSort: React.Dispatch<React.SetStateAction<string>>;
  selectedCategories?: string[];
  setSelectedCategories?: React.Dispatch<React.SetStateAction<string[]>>;
  selectedUsers?: string[];
  setSelectedUsers?: React.Dispatch<React.SetStateAction<string[]>>;
  selectedVisibility?: string[];
  setSelectedVisibility?: React.Dispatch<React.SetStateAction<string[]>>;
};

export const CookingTimesFilters = ({
  title,
  originalCookingTimes,
  totalElement,
  sort,
  setSort,
  selectedCategories,
  setSelectedCategories,
  selectedUsers,
  setSelectedUsers,
  selectedVisibility,
  setSelectedVisibility,
}: CookingTimesFiltersProps) => {
  return (
    <Drawer direction="right">
      <div className="flex justify-between items-center">
        <Typography variant="body" className="text-muted-foreground">
          {totalElement} {title}
        </Typography>
        <DrawerTrigger asChild>
          <Button variant="outline" size="icon-lg">
            <ListFilter />
          </Button>
        </DrawerTrigger>
      </div>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Trier</DrawerTitle>
        </DrawerHeader>
        <Field className="px-4">
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="recent">
                  Du plus récent au plus ancien
                </SelectItem>
                <SelectItem value="oldest">
                  Du plus ancien au plus récent
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
        <Separator className="mx-4 mt-4 h-px" />
        <DrawerHeader>
          <DrawerTitle className="">Filtrer</DrawerTitle>
        </DrawerHeader>
        <div className="no-scrollbar overflow-y-auto px-4 gap-4 flex flex-col">
          {selectedCategories && setSelectedCategories && (
            <CookingTimeFiltersCategory
              selectedCategories={selectedCategories}
              originalCookingTimes={originalCookingTimes}
              setSelectedCategories={setSelectedCategories}
            />
          )}

          {selectedUsers && setSelectedUsers && (
            <CookingTimeFiltersUser
              selectedUsers={selectedUsers}
              originalCookingTimes={originalCookingTimes}
              setSelectedUsers={setSelectedUsers}
            />
          )}
          {selectedVisibility && setSelectedVisibility && (
            <CookingTimeFiltersVisibility
              selectedVisibility={selectedVisibility}
              originalCookingTimes={originalCookingTimes}
              setSelectedVisibility={setSelectedVisibility}
            />
          )}
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" size="lg">
              Fermer
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
