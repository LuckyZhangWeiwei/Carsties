"use client";

import { Button, TextInput } from "flowbite-react";
import React from "react";
import { FieldValues, useForm } from "react-hook-form";
import Input from "../components/Input";

export default function AuctionForm() {
  const {
    register,
    control,
    handleSubmit,
    setFocus,
    formState: { isSubmitting, isValid, isDirty, errors },
  } = useForm();

  function onSubmit(data: FieldValues) {
    console.log(data);
  }

  return (
    <form className="flex flex-col mt-3" onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Make"
        name="make"
        showLabel={false}
        control={control}
        rules={{ required: "Make is required" }}
      />
      <Input
        label="Model"
        name="model"
        showLabel={false}
        control={control}
        rules={{ required: "Model is required" }}
      />
      {/* <div className="mb-3 block">
        <TextInput
          {...register("make", { required: "Make is required" })}
          placeholder="Make"
          color={errors?.make && "failure"}
          helperText={errors.make?.message as string}
        />
      </div>
      <div className="mb-3 block">
        <TextInput
          {...register("model", { required: "Model is required" })}
          placeholder="Model"
          color={errors?.model && "failure"}
          helperText={errors.model?.message as string}
        />
      </div> */}
      <div className="flex justify-between">
        <Button outline color="gray" children="Cancel" />
        <Button
          outline
          color="success"
          children="Submit"
          type="submit"
          isProcessing={isSubmitting}
          disabled={!isValid}
        />
      </div>
    </form>
  );
}
