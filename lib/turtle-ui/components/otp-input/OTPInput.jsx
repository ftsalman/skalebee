import * as React from "react";
import { OTPField } from "@base-ui/react/otp-field";
import { cn, inputboxVariants } from "@turtle-ui/utils";

import "./otp-input.css";

export const OTPInput = ({
  length = 6,
  value,
  onValueChange,
  placeholder = "-",
  disabled = false,
  className,
  inputClassName,
}) => {
  const id = React.useId();

  return (
    <>
      <label htmlFor={id} className="text-lg text-gray-800">
        Verification code
      </label>
      <OTPField.Root
        id={id}
        length={length}
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        className={cn("tui-otp-input", className)}
      >
        {Array.from({ length }, (_, index) => (
          <OTPField.Input
            key={index}
            placeholder={placeholder}
            className={cn(
              inputboxVariants({
                size: "sm",
                variant: "primary",
                className: "tui-otp-input-box",
              }),
              inputClassName,
            )}
            aria-label={
              index === 0 ? undefined : `Character ${index + 1} of ${length}`
            }
          />
        ))}
      </OTPField.Root>{" "}
    </>
  );
};

// 📚 Example:

// import { OTPInput } from "@turtle-ui/components";
// import React from "react";

// const OTPFieldExample = () => {
//   const [otp, setOtp] = React.useState("");

//   console.log("otp", otp);

//   return <OTPInput length={6} value={otp} onValueChange={setOtp} />;
// };
