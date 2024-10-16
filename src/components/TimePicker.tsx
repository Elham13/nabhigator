import React, { useRef } from "react";
import { TimeInput } from "@mantine/dates";
import { ActionIcon } from "@mantine/core";
import { BsClock } from "react-icons/bs";

type PropTypes = {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  onBlur?: () => void;
};
const TimePicker = ({
  label,
  required,
  disabled,
  value,
  onChange,
  onBlur,
}: PropTypes) => {
  const ref = useRef<HTMLInputElement>(null);

  const pickerControl = (
    <ActionIcon
      variant="subtle"
      color="gray"
      onClick={() => ref.current?.showPicker()}
      onBlur={onBlur}
    >
      <BsClock />
    </ActionIcon>
  );
  return (
    <TimeInput
      label={label}
      ref={ref}
      rightSection={pickerControl}
      required={required}
      disabled={disabled}
      value={value}
      onChange={(e) => !!onChange && onChange(e.currentTarget.value)}
      withSeconds
      onBlur={onBlur}
    />
  );
};

export default TimePicker;
