// import Tag from "./Tag";

import { Tag } from "@turtle-ui/components";

export const TagExample = () => {
  return (
    <div className="flex items-center justify-center gap-2 flex-wrap w-full">
      <Tag size="sm">small</Tag>
      <Tag size="md">medium</Tag>
      <Tag size="lg">large</Tag>
      <br />
      <Tag size="md" variant="blue">
        Blue
      </Tag>
      <Tag size="md" variant="green">
        Green
      </Tag>
      <Tag size="md" variant="yellow">
        Yellow
      </Tag>
      <Tag size="md" variant="red">
        Red
      </Tag>
    </div>
  );
};
