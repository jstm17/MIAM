"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminCookingTime } from "@/types/cookingTime.types";
import { formatDateShort } from "@/utils/formatDate";
import { Pencil, Trash2, UserRound } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type CookingTimesTableProps = {
  cookingTimes: AdminCookingTime[];
  onDelete: (id: string) => void;
  onDeleteMany: (ids: string[]) => void;
  onEdit: (slug: string) => void;
};

export const CookingTimesTable = ({
  cookingTimes,
  onDelete,
  onDeleteMany,
  onEdit,
}: CookingTimesTableProps) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleAll = () => {
    if (selected.length === cookingTimes.length) setSelected([]);
    else setSelected(cookingTimes.map((r) => r._id));
  };

  const toggleOne = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  return (
    <div className="rounded-2xl border bg-card shadow-sm mb-4">
      {selected.length > 0 && (
        <div className="flex items-center gap-2 p-3 border-b bg-muted/50 rounded-t-2xl">
          <span className="text-sm text-muted-foreground flex-1">
            {selected.length} sélectionné(s)
          </span>
          <Button
            size="icon-lg"
            variant="destructive"
            onClick={() => {
              onDeleteMany(selected);
              setSelected([]);
            }}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8">
              <Checkbox
                checked={
                  selected.length === cookingTimes.length &&
                  cookingTimes.length > 0
                }
                onCheckedChange={toggleAll}
              />
            </TableHead>

            <TableHead>Nom</TableHead>
            <TableHead>
              <UserRound size={16} />
            </TableHead>
            <TableHead>Créé le</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {cookingTimes.map((cookingTime) => {
            const isChecked = selected.includes(cookingTime._id);

            return (
              <TableRow key={cookingTime._id}>
                {/* Checkbox */}
                <TableCell>
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => toggleOne(cookingTime._id)}
                  />
                </TableCell>

                {/* Nom */}
                <TableCell
                  className="font-medium cursor-pointer w-1/2 whitespace-normal break-words"
                  onClick={() => navigate(`/recipe/${cookingTime.slug}`)}
                >
                  {cookingTime.name}
                </TableCell>

                {/* Nb recettes */}
                <TableCell>{cookingTime.addedBy.name}</TableCell>

                {/* Date création */}
                <TableCell>{formatDateShort(cookingTime.createdAt)}</TableCell>

                {/* Actions */}
                <TableCell className="text-right space-x-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => onEdit(cookingTime.slug)}
                  >
                    <Pencil className="size-4" />
                  </Button>

                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => onDelete(cookingTime._id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
