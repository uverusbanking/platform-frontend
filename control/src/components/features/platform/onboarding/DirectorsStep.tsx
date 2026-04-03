"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DirectorCard } from "./DirectorCard";

export function DirectorsStep() {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "directors",
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">
          Organisation Directors
        </h4>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-lg h-9 font-bold"
          onClick={() =>
            append({
              firstName: "",
              lastName: "",
              middleName: "",
              bvn: "",
              nin: "",
              idType: "NIN",
              idDocument: null,
              streetAddress: "",
              city: "",
              state: "",
              zipCode: "",
              country: "nigeria",
              ownershipPercentage: 0,
              isBeneficialOwner: false,
            })
          }
        >
          <Plus className="w-4 h-4 mr-2" /> Add Director
        </Button>
      </div>

      {fields.map((field, index) => (
        <DirectorCard
          key={field.id}
          index={index}
          remove={remove}
          fieldsCount={fields.length}
        />
      ))}
    </div>
  );
}
