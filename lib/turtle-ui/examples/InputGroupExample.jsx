import { InputGroup } from "@turtle-ui/components";
import React from "react";

export const InputGroupExample = () => {
  return (
    <InputGroup
      placeholder="Enter Your Name"
      label="Full name"
      errorMsg="Name is required"
      id="fullName"
      name="fullName"
    />
  );
};
