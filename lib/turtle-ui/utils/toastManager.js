// toastManager.js
import { Toast } from "@base-ui/react/toast";

export const toastManager = Toast.createToastManager();

export const showToast = ({ head, descp, type }) => {
  toastManager.add({
    title: head,
    description: descp,
    data: {
      type: type || "default", // success | danger | info | warning
    },
  });
};
