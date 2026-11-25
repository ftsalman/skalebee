import { Button } from "@turtle-ui/components";

export const ButtonExample = () => {
  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="tertiary">Tertiary</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="success">Success</Button>
    </div>
  );
};
