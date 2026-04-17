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
import type { AdminUser } from "@/types/user.types";
import { formatDateShort } from "@/utils/formatDate";
import { Mail, Trash2 } from "lucide-react";
import { useState } from "react";

type Props = {
  users: AdminUser[];
  onDelete: (id: string) => void;
  onResetPassword: (id: string) => void;
};

export const UsersTable = ({ users, onDelete, onResetPassword }: Props) => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleAll = () => {
    if (selected.length === users.length) setSelected([]);
    else setSelected(users.map((u) => u._id));
  };

  const toggleOne = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  console.log(users);

  return (
    <div className="rounded-2xl border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8">
              <Checkbox
                checked={selected.length === users.length && users.length > 0}
                onCheckedChange={toggleAll}
              />
            </TableHead>

            <TableHead>Nom</TableHead>
            <TableHead>Recettes</TableHead>
            <TableHead>Créé le</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((user) => {
            const isChecked = selected.includes(user._id);

            return (
              <TableRow key={user._id}>
                {/* Checkbox */}
                <TableCell>
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => toggleOne(user._id)}
                  />
                </TableCell>

                {/* Nom */}
                <TableCell className="font-medium">
                  {user.name}
                  <div className="text-xs text-muted-foreground">
                    {user.email}
                  </div>
                </TableCell>

                {/* Nb recettes */}
                <TableCell>{user.recipesCount}</TableCell>

                {/* Date création */}
                <TableCell>{formatDateShort(user.createdAt)}</TableCell>

                {/* Actions */}
                <TableCell className="text-right space-x-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => onResetPassword(user._id)}
                  >
                    <Mail className="size-4" />
                  </Button>

                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => onDelete(user._id)}
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
