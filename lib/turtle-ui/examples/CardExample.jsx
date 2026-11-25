import { Avatar, Button, Card } from "@turtle-ui/components";

export const CardExample = () => {
  return (
    <Card>
      <div className="flex flex-col gap-4 max-w-[400px] w-full">
        <div className="flex items-center gap-2">
          <Avatar
            isLoading={false}
            imgProps={{
              src: "https://miro.medium.com/v2/resize:fit:2400/1*G3SqV4hICZkUCb19j5KpFg.jpeg",
            }}
          />
          <div className="flex-grow">
            <p className="">Muhammed Sahad</p>
            <p className="text-sm text-gray-400">
              Software Developer | UI Designer
            </p>
          </div>
        </div>
        <div className="text-sm">
          I'm a passionate software developer and UI designer based on India. I
          write blogs, solve problems and create beautiful User interfaces. I'm
          self-taught enjoy studying new technologies and constantly expanding
          my skills.
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button
            size="sm"
            variant="tertiary"
            className="focus:ring-gray-100 focus:border-gray-300"
          >
            View Github
          </Button>
          <Button size="sm">Contact</Button>
        </div>
      </div>
    </Card>
  );
};
