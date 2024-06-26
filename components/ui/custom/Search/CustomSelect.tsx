import React from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { customSelectData } from "@/types/Home";

type Props = {
  disabled?: boolean;
  data: customSelectData;
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
  placeholder: string;
};

const CustomSelect = ({ data, disabled, setSelectedOption, placeholder }: Props) => {
  return (
    <Select onValueChange={(value) => setSelectedOption(value)}>
      <SelectTrigger disabled={disabled && disabled} className="w-full border-[#949494]">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {data &&
          data.map((select, idx) => (
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
