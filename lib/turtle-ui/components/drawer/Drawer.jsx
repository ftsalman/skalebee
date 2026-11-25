import { Drawer as DrawerPrimitives } from "@base-ui/react/drawer";

import PropTypes from "prop-types";

// Utils
import { cn } from "../../utils/utils";

// Components
import { Button } from "../button/Button";

// Styles
import { XIcon } from "@phosphor-icons/react";

import "./drawer.css";

export const Drawer = ({
  isOpen = false,
  onToggle = () => {},
  disableBackdropClose = false,
  className = "",
  children,
}) => (
  <DrawerPrimitives.Root
    open={isOpen}
    onOpenChange={onToggle}
    swipeDirection="right"
    disablePointerDismissal={disableBackdropClose}
  >
    <DrawerPrimitives.VirtualKeyboardProvider>
      <DrawerPrimitives.Portal>
        {/* <DrawerPrimitives.Backdrop className="[--backdrop-opacity:0.2] [--bleed:3rem] dark:[--backdrop-opacity:0.7] fixed inset-0 min-h-dvh bg-black opacity-[calc(var(--backdrop-opacity)*(1-var(--drawer-swipe-progress)))] transition-opacity duration-450 ease-[cubic-bezier(0.32,0.72,0,1)] data-swiping:duration-0 data-ending-style:opacity-0 data-starting-style:opacity-0 data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] supports-[-webkit-touch-callout:none]:absolute" /> */}
        <DrawerPrimitives.Backdrop className="tui-drawer-backdrop" />
        <DrawerPrimitives.Viewport className="tui-drawer-viewport">
          {/* <DrawerPrimitives.Popup className="flex flex-col [--bleed:0rem] supports-[-webkit-touch-callout:none]:[--bleed:0px] h-full w-[calc(100%-16px)] sm:w-2/3 md:w-2/3 lg:w-2/3 xl:w-1/3 max-w-[calc(100vw-3rem+3rem)] touch-auto border-l border-neutral-950 bg-white text-neutral-950 outline-none shadow-[0.25rem_0.25rem_0] shadow-black/12 transform-[translateX(var(--drawer-swipe-movement-x))] transition-transform duration-450 ease-[cubic-bezier(0.32,0.72,0,1)] data-swiping:select-none data-ending-style:transform-[translateX(calc(100%-var(--bleed)+var(--viewport-padding)+2px))] data-starting-style:transform-[translateX(calc(100%-var(--bleed)+var(--viewport-padding)+2px))] data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] supports-[-webkit-touch-callout:none]:mr-0 supports-[-webkit-touch-callout:none]:w-[20rem] supports-[-webkit-touch-callout:none]:max-w-[calc(100vw-3rem)] supports-[-webkit-touch-callout:none]:border supports-[-webkit-touch-callout:none]:pr-6 dark:border-white dark:bg-neutral-950 dark:text-white dark:shadow-none "> */}
          <DrawerPrimitives.Popup className={cn("tui-drawer-popup", className)}>
            {children}
          </DrawerPrimitives.Popup>
        </DrawerPrimitives.Viewport>
      </DrawerPrimitives.Portal>
    </DrawerPrimitives.VirtualKeyboardProvider>
  </DrawerPrimitives.Root>
);

Drawer.propTypes = {
  isOpen: PropTypes.bool,
  onToggle: PropTypes.func,
  disableBackdropClose: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};

const Header = ({
  head = "",
  descp = "",
  onClose = undefined,
  children = null,
  className = "",
  ...props
}) => (
  <div className={cn("tui-drawer-header", className)} {...props}>
    {children ? (
      children
    ) : (
      <div className="tui-drawer-header--content">
        <h5>{head}</h5>
        <p>{descp}</p>
      </div>
    )}

    {onClose && (
      <Button
        variant="tertiary"
        onClick={(e) => onClose(e, "close-btn")}
        className="tui-drawer-header--close-btn"
      >
        <XIcon size={20} />
      </Button>
    )}
  </div>
);

Header.propTypes = {
  head: PropTypes.string,
  descp: PropTypes.string,
  onClose: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
};

const Body = ({ children = null, className }) => (
  <DrawerPrimitives.Content className={cn("tui-drawer-body", className)}>
    {children}
  </DrawerPrimitives.Content>
);

Body.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

const Footer = ({ children = null, className = "", ...props }) => (
  <div className={cn("tui-drawer-footer", className)} {...props}>
    {children}
  </div>
);

Footer.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

Drawer.Header = Header;
Drawer.Body = Body;
Drawer.Footer = Footer;
// Drawer.useDrawer = DrawerPrimitives.createHandle;


// 📚 Example :

// import { Button, Drawer } from "@turtle-ui/components";
// import { useAnimation } from "@turtle-ui/hooks";

// export const DrawerExample = () => {
//   const [render, isOpen, handleOpen, handleClose] = useAnimation();

//   return (
//     <>
//       <Button onClick={() => handleOpen()}>Open Drawer</Button>

//       {render && (
//         <Drawer
//           isOpen={isOpen}
//           onToggle={(isOpen, e) => {
//             handleClose();
//           }}
//         >
//           <Drawer.Header
//             head="Drawer Header"
//             descp="Drawer Description"
//             onClose={() => {}}
//           />

//           <Drawer.Body className="break-all">
//             Lorem, ipsum dolor sit amet consectetur adipisicing elit. Incidunt
//             animi nihil tempora quia ullam amet sapiente facere! Provident magni
//             porro, est quas repellendus sapiente at modi ullam pariatur aliquid
//             eum?
//           </Drawer.Body>

//           <Drawer.Footer>
//             <Button className="" variant="secondary">
//               Cancel
//             </Button>
//             <Button className="w-[120px]">Save</Button>
//           </Drawer.Footer>

//           {/* <Drawer.Header
//             head="Drawer Header"
//             descp="Drawer Description"
//             onClose={() => {}}
//           />

//           <Drawer.Body>asdfasdf</Drawer.Body>

//           <Drawer.Footer>asdfasdfasdf</Drawer.Footer> */}
//         </Drawer>
//       )}
//     </>
//   );
// };