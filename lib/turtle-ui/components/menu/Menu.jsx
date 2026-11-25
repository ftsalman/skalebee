import { Menu as MenuPrmitives } from "@base-ui/react";

import PropTypes from "prop-types";

// Styles

import "./menu.css";

// Utils

import { Button } from "@turtle-ui/components";
import { DotsThreeVerticalIcon } from "@phosphor-icons/react";
import { cn } from "@turtle-ui/utils";

export const Menu = ({ menuItems = [], trigger = undefined }) => {
  return (
    <MenuPrmitives.Root>
      <MenuPrmitives.Trigger
        render={
          trigger || (
            <Button className="size-10 p-1" variant="secondary">
              <DotsThreeVerticalIcon size={16} weight="bold" />
            </Button>
          )
        }
      />

      <MenuPrmitives.Portal>
        <MenuPrmitives.Positioner
          className="tui-menu-positioner"
          sideOffset={8}
          align="start"
        >
          <MenuPrmitives.Popup className="tui-menu-popup">
            {menuItems?.map((menuItem) => {
              if (menuItem?.type === "seprator") {
                return (
                  <MenuPrmitives.Separator
                    key={menuItem?.id}
                    className={cn("tui-menu-seprator", menuItem?.className)}
                  />
                );
              }

              return (
                <MenuPrmitives.Item
                  key={menuItem?.id}
                  disabled={menuItem?.disabled}
                  className={cn("tui-menu-item", menuItem?.className)}
                  onClick={menuItem?.onClick}
                >
                  {menuItem?.label}
                </MenuPrmitives.Item>
              );
            })}
          </MenuPrmitives.Popup>
        </MenuPrmitives.Positioner>
      </MenuPrmitives.Portal>
    </MenuPrmitives.Root>
  );
};

Menu.propTypes = {
  menuItems: PropTypes.array,
  trigger: PropTypes.node,
};

// 📚 Example :

// import { useAnimation } from "@turtle-ui/hooks";
// import { Menu } from "@turtle-ui/components";

// export const MenuExample = () => {
//   const MENU_ITEMS = [
//     {
//       id: "1",
//       type: "item",
//       onClick: () => {
//         console.log("hellow");
//       },
//       label: "Add to Library",
//       className: "",
//       disabled: true,
//     },
//     {
//       id: "2",
//       type: "item",
//       onClick: () => {
//         console.log("hellow");
//       },
//       label: "Add to Playlist",
//       className: "",
//       disabled: false,
//     },
//     {
//       id: "3",
//       type: "seprator",
//       className: "",
//     },
//     {
//       id: "4",
//       type: "item",
//       onClick: () => {
//         console.log("hellow");
//       },
//       label: "Play Next",
//       className: "",
//       disabled: false,
//     },
//     {
//       id: "5",
//       type: "item",
//       onClick: () => {
//         console.log("hellow");
//       },
//       label: "Play Last",
//       className: "",
//       disabled: false,
//     },
//   ];

//   return (
//     <>
//       <Menu menuItems={MENU_ITEMS} />
//     </>
//   );
// };
