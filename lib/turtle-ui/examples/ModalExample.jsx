import { Button, Menu, Modal } from "@turtle-ui/components";
import { useAnimation } from "@turtle-ui/hooks";

export const ModalExample = () => {
  const [render, isOpen, handleOpen, handleClose] = useAnimation();

  return (
    <>
      <Button onClick={() => handleOpen()}>Open Modal</Button>

      {render && (
        <Modal
          isOpen={isOpen}
          onToggle={(isOpen, e) => {
            handleClose();
          }}
        >
          <Modal.Header
            head="Modal Header"
            descp="Modal Description"
            onClose={() => {}}
          />

          <Modal.Body className="break-all">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Incidunt
            animi nihil tempora quia ullam amet sapiente facere! Provident magni
            porro, est quas repellendus sapiente at modi ullam pariatur aliquid
            eum?
           
          </Modal.Body>

          <Modal.Footer className="flex items-center justify-end gap-2">
            <Button className="" variant="secondary">
              Cancel
            </Button>
            <Button className="w-[120px]">Save</Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};
