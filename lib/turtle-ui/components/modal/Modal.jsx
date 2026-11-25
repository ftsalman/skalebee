import PropTypes from "prop-types";

// Utils
import { cn } from "../../utils/utils";

// Components
import { Button } from "../button/Button";
import { IconCross } from "../../assets/icons/InterfaceIcons";

// Styles
import "./modal.css";
import { Dialog } from "@base-ui/react";

export const Modal = ({
  isOpen = false,
  onToggle = () => {},
  disableBackdropClose = true,
  className = "",
  children,
}) => (
  <Dialog.Root
    open={isOpen}
    onOpenChange={onToggle}
    swipeDirection="right"
    disablePointerDismissal={disableBackdropClose}
  >
    <Dialog.Portal>
      <Dialog.Backdrop forceRender className="tui-modal-backdrop" />
      <Dialog.Popup className={cn("tui-modal-popup", className)}>
        {children}
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
);

Modal.propTypes = {
  isOpen: PropTypes.bool,
  onToggle: PropTypes.func,
  disableBackdropClose: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};

Modal.displayName = "Modal";

const Header = ({
  head = "",
  descp = "",
  onClose = undefined,
  children = null,
  className = "",
  ...props
}) => {
  return (
    <div className={cn("tui-modal-header", className)} {...props}>
      {children ? (
        children
      ) : (
        <div className="tui-modal-header--content">
          <h5>{head}</h5>
          <p>{descp}</p>
        </div>
      )}

      {onClose && (
        <Button
          variant="tertiary"
          onClick={(e) => onClose(e, "close-btn")}
          className="tui-modal-header--close-btn"
        >
          <IconCross size={24} />
        </Button>
      )}
    </div>
  );
};

Header.propTypes = {
  head: PropTypes.string,
  descp: PropTypes.string,
  onClose: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
};

Header.displayName = "Header";

Modal.Header = Header;

const Body = ({ children = null, className, ...props }) => (
  <div className={cn("tui-modal-body", className)} {...props}>
    {children}
  </div>
);

Body.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

Body.displayName = "Body";

Modal.Body = Body;

const Footer = ({ children = null, className = "", ...props }) => (
  <div className={cn("tui-modal-footer", className)} {...props}>
    {children}
  </div>
);

Footer.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

Footer.displayName = "Footer";

Modal.Footer = Footer;

// 📚 Example:

// import { Button, Modal } from "@turtle-ui/components";
// import { useAnimation } from "@turtle-ui/hooks";

// export const ModalExample = () => {
//   const [render, isOpen, handleOpen, handleClose] = useAnimation();

//   return (
//     <>
//       <Button onClick={() => handleOpen()}>Open Drawer</Button>

//       {render && (
//         <Modal
//           isOpen={isOpen}
//           onToggle={(isOpen, e) => {
//             handleClose();
//           }}
//         >
//           <Modal.Header
//             head="Modal Header"
//             descp="Modal Description"
//             onClose={() => {}}
//           />

//           <Modal.Body className="break-all">
//             Lorem, ipsum dolor sit amet consectetur adipisicing elit. Incidunt
//             animi nihil tempora quia ullam amet sapiente facere! Provident magni
//             porro, est quas repellendus sapiente at modi ullam pariatur aliquid
//             eum?
//           </Modal.Body>

//           <Modal.Footer className="flex items-center justify-end gap-2">
//             <Button className="" variant="secondary">
//               Cancel
//             </Button>
//             <Button className="w-[120px]">Save</Button>
//           </Modal.Footer>
//         </Modal>
//       )}
//     </>
//   );
// };
