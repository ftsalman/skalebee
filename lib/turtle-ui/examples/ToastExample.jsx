import { Button } from "@turtle-ui/components";
import { showToast } from "@turtle-ui/utils";

export const ToastExample = () => {
  return (
    <Button
      onClick={() => {
        showToast({
          type: "success",
          head: "Success! User Created",
          descp: "User created successfully",
        });
      }}
    >
      Trigger Toast
    </Button>
  );
};
