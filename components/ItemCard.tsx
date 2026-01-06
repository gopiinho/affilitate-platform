"use client";

import { Id } from "@/convex/_generated/dataModel";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, ExternalLink } from "lucide-react";
import Image from "next/image";

interface ItemCardProps {
  item: {
    _id: Id<"items">;
    affiliateLink: string;
    price?: string;
    platform: string;
    itemTitle?: string;
    imageUrl?: string;
  };
  onEdit: () => void;
  onDelete: () => void;
}

const platformColors: Record<string, string> = {
  amazon: "bg-orange-100 text-orange-700",
  flipkart: "bg-blue-100 text-blue-700",
  nykaa: "bg-pink-100 text-pink-700",
  meesho: "bg-purple-100 text-purple-700",
  other: "bg-gray-100 text-gray-700",
};

export default function ItemCard({ item, onEdit, onDelete }: ItemCardProps) {
  const capitalizedPlatform =
    item.platform.charAt(0).toUpperCase() + item.platform.slice(1);

  return (
    <Card className="hover:shadow-lg overflow-hidden pt-0 transition-shadow flex flex-col h-full">
      {item.imageUrl && (
        <div className="relative w-full h-48 bg-gray-100">
          <Image
            src={item.imageUrl}
            alt={item.itemTitle || "Product"}
            fill
            className="object-cover"
          />
        </div>
      )}

      <CardHeader className="space-y-2 pb-3">
        {item.itemTitle && (
          <h3 className="font-semibold text-lg line-clamp-2 min-h-[3.5rem]">
            {item.itemTitle}
          </h3>
        )}

        <div className="flex items-center justify-between gap-2">
          <Badge
            className={platformColors[item.platform] || platformColors.other}
          >
            {capitalizedPlatform}
          </Badge>

          {item.price && (
            <span className="text-sm font-semibold text-pink-600">
              ₹{item.price}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-3 grow">
        <a
          href={item.affiliateLink}
          target="_blank"
          rel="nofollow noopener"
          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
        >
          View Product <ExternalLink className="h-3 w-3" />
        </a>
      </CardContent>

      <CardFooter className="flex gap-2 pt-3">
        <Button onClick={onEdit} variant="outline" size="sm" className="flex-1">
          <Pencil className="h-3 w-3 mr-1" />
          Edit
        </Button>

        <Button onClick={onDelete} variant="destructive" size="sm">
          <Trash2 className="h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );
}
