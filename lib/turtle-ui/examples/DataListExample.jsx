import { Avatar, Card, DataList } from "@turtle-ui/components";

const data = [
  { name: "John Doe", domain: "Software Developer" },
  { name: "Jane Smith", domain: "UI Designer" },
];

export const DataListExample = () => (
  <DataList
    className="gap-2"
    data={data}
    render={(item) => (
      <Card
        key={item.name}
        className="flex flex-col items-center justify-center gap-2"
      >
        <Avatar
          isLoading={false}
          imgProps={{
            src: "https://miro.medium.com/v2/resize:fit:2400/1*G3SqV4hICZkUCb19j5KpFg.jpeg",
          }}
        />

        <p className="">{item.name}</p>
        <p className="-mt-2 text-sm text-gray-400">{item.domain}</p>
      </Card>
    )}
  />
);
