"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import SectionCard from "@/components/SectionCard";
import CreateSectionModal from "@/components/CreateSectionModal";
import EditSectionModal from "@/components/EditSectionModal";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, Package } from "lucide-react";

export default function DashboardPage() {
  const sections = useQuery(api.sections.list);
  const deleteSection = useMutation(api.sections.remove);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingSection, setEditingSection] = useState<{
    id: Id<"sections">;
    title: string;
    description?: string;
  } | null>(null);

  const handleDelete = async (id: Id<"sections">) => {
    if (
      confirm("Are you sure? This will delete the section and all its items.")
    ) {
      await deleteSection({ id });
    }
  };

  if (sections === undefined) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            Your Sections
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage your affiliate product collections
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          size="lg"
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Section
        </Button>
      </div>

      {sections.length === 0 ? (
        <div className="border-2 border-dashed rounded-lg p-12 text-center">
          <div className="flex justify-center mb-4">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No sections yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first section to start adding affiliate products.
          </p>
          <Button onClick={() => setShowCreateModal(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Section
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <SectionCard
              key={section._id}
              section={section}
              onEdit={() =>
                setEditingSection({
                  id: section._id,
                  title: section.title,
                  description: section.description,
                })
              }
              onDelete={() => handleDelete(section._id)}
            />
          ))}
        </div>
      )}

      <CreateSectionModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      {editingSection && (
        <EditSectionModal
          section={editingSection}
          open={!!editingSection}
          onClose={() => setEditingSection(null)}
        />
      )}
    </div>
  );
}
