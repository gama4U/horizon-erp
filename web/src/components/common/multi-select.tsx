import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

type Option = Record<"value" | "label", string>;

interface MultiSelectProps {
  options: Option[];
  selectedOptions: string[];
  onSelect: (selected: string[]) => void;
  setOptions: (options: Option[]) => void;
  placeholder?: string;
}

export function MultiSelect({
  options,
  selectedOptions,
  onSelect,
  setOptions,
  placeholder = "Select items...",
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const selected = options.filter((option) =>
    selectedOptions.includes(option.value)
  );

  const handleUnselect = React.useCallback(
    (option: Option) => {
      onSelect(selectedOptions.filter((s) => s !== option.value));
    },
    [selectedOptions, onSelect]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            onSelect(selectedOptions.slice(0, -1));
          }
        }
        if (e.key === "Escape") {
          input.blur();
        }
        if (e.key === "Enter" && inputValue.trim()) {
          const newOption: Option = {
            value: inputValue.trim(),
            label: inputValue.trim(),
          };
          if (!options.find((option) => option.value === newOption.value)) {
            setOptions([...options, newOption]);
          }
          onSelect([...selectedOptions, newOption.value]);
          setInputValue("");
          setOpen(false);
        }
      }
    },
    [inputValue, options, selectedOptions, onSelect, setOptions]
  );

  const selectables = options.filter(
    (option) => !selectedOptions.includes(option.value)
  );

  return (
    <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
      <div className="group rounded-md border border-input p-4 text-xs ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-2">
          {selected.map((option) => (
            <Badge key={option.value} variant="default">
              {option.label}
              <button
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={() => handleUnselect(option)}
              >
                <X className="h-3 w-3 text-white hover:text-foreground" />
              </button>
            </Badge>
          ))}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative mt-2">
        <CommandList>
          {open && selectables.length > 0 ? (
            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="h-full overflow-auto">
                {selectables.map((option) => (
                  <CommandItem
                    key={option.value}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={() => {
                      setInputValue("");
                      onSelect([...selectedOptions, option.value]);
                    }}
                    className="cursor-pointer"
                  >
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          ) : null}
        </CommandList>
      </div>
    </Command>
  );
}
