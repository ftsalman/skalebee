import { SegmentControl } from "@turtle-ui/components";
import { useState } from "react";

const TABS = [
  {
    id: 1,
    label: "Yearly",
  },
  {
    id: 2,
    label: "Monthly",
  },
  {
    id: 3,
    label: "Daily",
  },
];

export const SegmentControllerExample = () => {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  return (
    <SegmentControl
      items={TABS}
      onSelect={setActiveTab}
      selectedItem={activeTab}
    />
  );
};
