// 📚 Example :

import { Button, Drawer } from "@turtle-ui/components";
import { useAnimation } from "@turtle-ui/hooks";

export const DrawerExample = () => {
  const [render, isOpen, handleOpen, handleClose] = useAnimation();

  return (
    <>
      <Button onClick={() => handleOpen()}>Open Drawer</Button>

      {render && (
        <Drawer
          isOpen={isOpen}
          onToggle={(isOpen, e) => {
            handleClose();
          }}
        >
          <Drawer.Header
            head="Drawer Header"
            descp="Drawer Description"
            onClose={() => {}}
          />

          <Drawer.Body className="break-all">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Incidunt
            animi nihil tempora quia ullam amet sapiente facere! Provident magni
            porro, est quas repellendus sapiente at modi ullam pariatur aliquid
            eum?
          </Drawer.Body>

          <Drawer.Footer>
            <Button className="" variant="secondary">
              Cancel
            </Button>
            <Button className="w-[120px]">Save</Button>
          </Drawer.Footer>
        </Drawer>
      )}
    </>
  );
};
