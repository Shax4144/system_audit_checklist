import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const SuppliersDropdown = ({
  data = [],
  value,
  onChange,
  isLoading,
  triggerClassName,
}) => {
  const [open, setOpen] = useState(false);

  const selectedSupplier = data.find(
    (supplier) => String(supplier.name) === String(value),
  );

  const handleChange = (name) => {
    const selected = data.find(
      (supplier) => String(supplier.name) === String(name),
    );

    onChange(name, selected);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={isLoading}
          className={cn(
            "w-full justify-between font-normal",
            !value && "text-muted-foreground",
            triggerClassName,
          )}
        >
          {isLoading
            ? "Loading..."
            : selectedSupplier?.name || "Select a supplier"}

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-(--radix-popover-trigger-width) p-0"
      >
        <Command>
          <CommandInput placeholder="Search supplier..." />

          <CommandList className="custom-scrollbar mt-1">
            <CommandEmpty>No supplier found.</CommandEmpty>

            <CommandGroup>
              {data.map((supplier) => {
                const supplierValue = String(supplier.name);
                const isSelected = String(value) === supplierValue;

                return (
                  <CommandItem
                    key={supplier.id}
                    value={supplierValue}
                    onSelect={() => handleChange(supplierValue)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0",
                      )}
                    />

                    {supplier.name}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SuppliersDropdown;
