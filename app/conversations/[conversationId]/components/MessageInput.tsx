"use client";

import React from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

type Props = {
  placeholder?: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
};

const MessageInput = ({
  placeholder,
  id,
  type,
  required,
  register,
  errors,
}: Props) => {
  return (
    <div className="relative w-full">
      <input
        placeholder={placeholder}
        id={id}
        type={type}
        autoComplete={id}
        {...register(id, { required })}
        className="text-black font-light px-2 py-2 bg-neutral-100 w-full rounded-full focus:outline-none"
      />
    </div>
  );
};

export default MessageInput;
