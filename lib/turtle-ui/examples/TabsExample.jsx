import { Tabs } from "@turtle-ui/components";
import { useState } from "react";
 
const tabs = [
  { label: "Profile", id: 1 },
  { label: "Account", id: 2 },
  { label: "Notifications", id: 3 },
];

export const TabsExample = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div>
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};
