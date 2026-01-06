"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Package } from "lucide-react";

interface SectionCardProps {
  section: {
    _id: Id<"sections">;
    title: string;
    description?: string;
    createdAt: number;
  };
  onEdit: () => void;
  onDelete: () => void;
}

export default function SectionCard({
  section,
  onEdit,
  onDelete,
}: SectionCardProps) {
  const router = useRouter();
  const items = useQuery(api.items.listBySection, { sectionId: section._id });

  const itemCount = items?.length ?? 0;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl">{section.title}</CardTitle>
        {section.description && (
          <CardDescription>{section.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <Badge variant="secondary" className="gap-1">
          <Package className="h-3 w-3" />
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </Badge>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          onClick={() => router.push(`/dashboard/sections/${section._id}`)}
          className="flex-1"
        >
          Manage Items
        </Button>
        <Button onClick={onEdit} variant="outline" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
        <Button onClick={onDelete} variant="destructive" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
