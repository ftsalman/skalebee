import { Menu } from "@turtle-ui/components";

export const MenuExample = () => {
  const MENU_ITEMS = [
    {
      id: "1",
      type: "item",
      onClick: () => {
        console.log("hellow");
      },
      label: "Add to Library",
      className: "",
      disabled: true,
    },
    {
      id: "2",
      type: "item",
      onClick: () => {
        console.log("hellow");
      },
      label: "Add to Playlist",
      className: "",
      disabled: false,
    },
    {
      id: "3",
      type: "seprator",
      className: "",
    },
    {
      id: "4",
      type: "item",
      onClick: () => {
        console.log("hellow");
      },
      label: "Play Next",
      className: "",
      disabled: false,
    },
    {
      id: "5",
      type: "item",
      onClick: () => {
        console.log("hellow");
      },
      label: "Play Last",
      className: "",
      disabled: false,
    },
  ];

  return (
    <>
      <Menu menuItems={MENU_ITEMS} />
    </>
  );
};