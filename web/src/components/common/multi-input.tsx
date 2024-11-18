import { Badge } from "@/components/ui/badge";
import { Input, InputProps } from "@/components/ui/input";
import { XIcon } from "lucide-react";
import { Dispatch, SetStateAction, forwardRef, useState } from "react";

type MultiInputProps = InputProps & {
  value: string[];
  onChange: Dispatch<SetStateAction<string[]>>;
};

export const MultiInput = forwardRef<HTMLInputElement, MultiInputProps>(
  ({ value, onChange, ...props }, ref) => {
    const [pendingDataPoint, setPendingDataPoint] = useState("");

    const addPendingDataPoint = () => {
      if (pendingDataPoint) {
        const newDataPoints = new Set([...value, pendingDataPoint]);
        onChange(Array.from(newDataPoints));
        setPendingDataPoint("");
      }
    };

    return (
      <div className="flex items-center flex-wrap gap-2 px-4 p-2 rounded-lg bg-slate-100">
        {value.map((item, idx) => (
          <Badge key={idx} variant="default" className="font-medium">
            {item}
            <button
              type="button"
              className="w-3 ml-2"
              onClick={() => {
                onChange(value.filter((i) => i !== item));
              }}
            >
              <XIcon className="w-3" />
            </button>
          </Badge>
        ))}
        <Input
          value={pendingDataPoint}
          onChange={(e) => setPendingDataPoint(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addPendingDataPoint();
            }
          }}
          className="text-[12px] h-[26px] focus-visible:ring-0 border-none shadow-none flex-1 min-w-[200px] p-0"
          {...props}
          ref={ref}
        />
      </div>
    );
  }
);