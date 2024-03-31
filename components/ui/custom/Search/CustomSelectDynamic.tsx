import React from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { customSelectData } from "@/types/Home";

type Props = {
  triggerStyle?: string;
  disabled?: boolean;
  data: any;
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
};

const CustomSelect = ({ data, disabled, triggerStyle, setSelectedOption }: Props) => {
  console.log(data);

  return (
    <Select onValueChange={(value) => setSelectedOption(value)}>
      <SelectTrigger disabled={disabled && disabled} className={`w-full border-[#949494] ${triggerStyle}`}>
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent>
          <SelectGroup>
            {data.options.map((option) => (
                <SelectLabel>{select.label}</SelectLabel>
              <SelectItem key={idx + 100} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default CustomSelect;
