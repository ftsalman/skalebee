import { ComboBox } from "@turtle-ui/components";
import { useState } from "react";

const COUNTRIES = [
  { code: "af", value: "afghanistan", label: "Afghanistan", continent: "Asia" },
  { code: "al", value: "albania", label: "Albania", continent: "Europe" },
  { code: "dz", value: "algeria", label: "Algeria", continent: "Africa" },
  { code: "ad", value: "andorra", label: "Andorra", continent: "Europe" },
  { code: "ao", value: "angola", label: "Angola", continent: "Africa" },
];

export const ComboBoxExample = () => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="flex flex-col items-start gap-1 p-5">
      <div className="shrink-0 w-[400px] p-4">
        <ComboBox
          options={COUNTRIES}
          labelKey="label"
          valueKey="value"
          optionKey="code"
          label="Country"
          placeholder="Select country"
          triggerClassName="w-full "
          //
          onSelect={setSelected}
          selectedOption={selected}
          onSelectOpen={() => {
            console.log("select opeend");
          }}
          onSearchChange={(val) => {
            console.log("value", val);
          }}
          renderOption={(value) => {
            // render your option componenet here
          }}
        />
      </div>

    </div>
  );
};