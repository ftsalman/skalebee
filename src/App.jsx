import { RouterProvider } from "react-router-dom";
import { Toast } from "@turtle-ui/components";
import { toastManager } from "@turtle-ui/utils";
import { router } from "./router/router";

export const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      {/* Global toast container - call showToast() from anywhere */}
      <Toast toastManager={toastManager} />
    </>
  );
};
