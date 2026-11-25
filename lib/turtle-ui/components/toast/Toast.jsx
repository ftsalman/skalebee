import { Toast as ToastPrimitives } from "@base-ui/react";
import { XIcon } from "@phosphor-icons/react";
import { Button } from "@turtle-ui/components";

export const Toast = ({ toastManager }) => (
  <ToastPrimitives.Provider toastManager={toastManager}>
    <ToastPrimitives.Portal>
      <ToastPrimitives.Viewport className="fixed z-50 top-[1rem] right-0 bottom-auto left-0 mx-auto w-[calc(100vw-2rem)] max-w-[22.5rem]">
        <ToastList />
      </ToastPrimitives.Viewport>
    </ToastPrimitives.Portal>
  </ToastPrimitives.Provider>
);

const ToastList = () => {
  const { toasts } = ToastPrimitives.useToastManager();

  return toasts.map((toast) => (
    <ToastPrimitives.Root
      key={toast.id}
      toast={toast}
      className="
  [--gap:0.75rem]
  [--peek:0.75rem]
  [--scale:calc(max(0,1-(var(--toast-index)*0.1)))]
  [--shrink:calc(1-var(--scale))]
  [--height:var(--toast-frontmost-height,var(--toast-height))]
  [--offset-y:calc(var(--toast-offset-y)+(var(--toast-index)*var(--gap))+var(--toast-swipe-movement-y))]

  absolute
  top-0
  right-0
  left-0
  z-[calc(1000-var(--toast-index))]
  mx-auto
  w-full
  origin-top

  transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)+(var(--toast-index)*var(--peek))+(var(--shrink)*var(--height))))_scale(var(--scale))]

  rounded-xl
  border
  border-gray-200
  bg-white
  text-neutral-950
  shadow-[0.25rem_0.25rem_0]
  shadow-black/12
  select-none
  shadow-md 

  after:absolute
  after:bottom-full
  after:left-0
  after:h-[calc(var(--gap)+1px)]
  after:w-full
  after:content-['']

  data-ending-style:opacity-0

  data-expanded:transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--offset-y)))]

  data-limited:opacity-0

  data-starting-style:transform-[translateY(-150%)]

  [&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:transform-[translateY(-150%)]

  data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+150%))]

  data-expanded:data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+150%))]

  data-ending-style:data-[swipe-direction=left]:transform-[translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]

  data-expanded:data-ending-style:data-[swipe-direction=left]:transform-[translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]

  data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]

  data-expanded:data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]

  data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-150%))]

  data-expanded:data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-150%))]

  h-[var(--height)]
  data-expanded:h-[var(--toast-height)]

  [transition:transform_0.5s_cubic-bezier(0.22,1,0.36,1),opacity_0.5s,height_0.15s]
"
      // className="[--gap:0.75rem] [--peek:0.75rem]
      // [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))]
      // absolute right-0 bottom-0 left-auto z-[calc(1000-var(--toast-index))] mr-0 w-full origin-bottom transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))]
      // rounded-xl shadow-md  border border-gray-200 bg-white text-neutral-950 shadow-[0.25rem_0.25rem_0] shadow-black/12 select-none  after:absolute after:top-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']
      // data-ending-style:opacity-0 data-expanded:transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--offset-y)))] data-limited:opacity-0 data-starting-style:transform-[translateY(150%)]
      // [&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:transform-[translateY(150%)] data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+150%))]
      // data-expanded:data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+150%))]
      // data-ending-style:data-[swipe-direction=left]:transform-[translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]
      // data-expanded:data-ending-style:data-[swipe-direction=left]:transform-[translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]
      // data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))] data-expanded:data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]
      // data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-150%))] data-expanded:data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-150%))]
      // h-(--height) data-expanded:h-(--toast-height) [transition:transform_0.5s_cubic-bezier(0.22,1,0.36,1),opacity_0.5s,height_0.15s]"
    >
      <ToastPrimitives.Content className="flex items-center gap-4 p-3 overflow-hidden transition-opacity duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] data-behind:opacity-0 data-expanded:opacity-100">
        <div className="flex min-w-0 flex-1 flex-col gap-0;5">
          <ToastPrimitives.Title className="text-sm font-bold" />
          <ToastPrimitives.Description className="text-sm" />
        </div>
        <ToastPrimitives.Close
          render={
            <Button className="p-1 size-8" variant="tertiary">
              <XIcon size="18" />
            </Button>
          }
        />
      </ToastPrimitives.Content>
    </ToastPrimitives.Root>
  ));
};

// 📚 Example:

// import { Button } from "@turtle-ui/components";
// import { showToast } from "@turtle-ui/utils";

// const ToastExample = () => {
//   return (
//     <Button
//       onClick={() => {
//         showToast({
//           type: "success",
//           head: "Success! User Created",
//           descp: "User created successfully",
//         });
//       }}
//     >
//       Trigger Toast
//     </Button>
//   );
// };
