import React from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  triggerStyle?: string;
  disabled?: boolean;
  data: { label: string; options: string[] }[]; // ovde dodati object strukturu npr: {[label: Make, options: [Audi, Mercedes, BMW, Opel]]...}
};

const CustomSelect = ({ data, disabled, triggerStyle }: Props) => {
  return (
    <Select>
      <SelectTrigger disabled={disabled && disabled} className={`w-full border-[#949494] ${triggerStyle}`}>
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent>
        {data.map((select, idx) => (
          <SelectGroup key={idx}>
            <SelectLabel>{select.label}</SelectLabel>
            {select.options.map((option, idx) => (
              <SelectItem key={idx + 100} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CustomSelect;
