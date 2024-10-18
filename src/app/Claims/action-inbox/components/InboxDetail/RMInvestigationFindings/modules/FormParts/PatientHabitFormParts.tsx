import React, { Fragment } from "react";
import { Grid, MultiSelect, TextInput } from "@mantine/core";
import {
  IHospitalVerification,
  IInsuredVerification,
} from "@/lib/utils/types/rmDataTypes";
import { TPatientHabit } from "@/lib/utils/types/fniDataTypes";
import { personalHabitOptions } from "@/lib/utils/constants/options";

interface PropTypes {
  values: IHospitalVerification | IInsuredVerification;
  onChange: (values: IHospitalVerification | IInsuredVerification) => void;
  handleBlur: ({}: { key: "personalOrSocialHabits"; value: any }) => void;
}

const PatientHabitFormParts = ({ values, onChange, handleBlur }: PropTypes) => {
  const handleChange = ({
    key,
    ind,
    value,
  }: {
    key: keyof TPatientHabit;
    ind: number;
    value: string;
  }) => {
    let personalOrSocialHabits: TPatientHabit[] =
      values?.personalOrSocialHabits || [];

    personalOrSocialHabits = personalOrSocialHabits?.map((el, i) =>
      i === ind ? { ...el, [key]: value } : el
    );
    onChange({ ...values, personalOrSocialHabits });
  };

  const onBlur = () =>
    handleBlur({
      key: "personalOrSocialHabits",
      value: values?.personalOrSocialHabits,
    });

  return (
    <Fragment>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <MultiSelect
          label="Personal/Social Habits"
          placeholder="Personal/Social Habits"
          required
          withAsterisk
          clearable
          searchable
          hidePickedOptions
          data={personalHabitOptions}
          value={values?.personalOrSocialHabits?.map((el) => el?.habit) || []}
          onChange={(val) =>
            onChange({
              ...values,
              personalOrSocialHabits: val?.map((el) => ({
                habit: el,
                duration: "",
                quantity: "",
                frequency: "",
              })),
            })
          }
          onBlur={onBlur}
        />
      </Grid.Col>
      {!!values?.personalOrSocialHabits &&
        values?.personalOrSocialHabits?.length > 0 &&
        !values?.personalOrSocialHabits
          ?.map((el) => el?.habit)
          ?.includes("NA") &&
        values?.personalOrSocialHabits?.map((el, ind) => (
          <Fragment key={ind}>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label={`Frequency of ${el?.habit}`}
                placeholder={`Frequency of ${el?.habit}`}
                required
                withAsterisk
                value={el?.frequency}
                onChange={(e) =>
                  handleChange({ key: "frequency", ind, value: e.target.value })
                }
                onBlur={onBlur}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label={`Quantity of ${el?.habit}`}
                placeholder={`Quantity of ${el?.habit}`}
                required
                withAsterisk
                value={el?.quantity}
                onChange={(e) =>
                  handleChange({ key: "quantity", ind, value: e.target.value })
                }
                onBlur={onBlur}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label={`Duration of ${el?.habit}`}
                placeholder={`Duration of ${el?.habit}`}
                required
                withAsterisk
                value={el?.duration}
                onChange={(e) =>
                  handleChange({ key: "duration", ind, value: e.target.value })
                }
                onBlur={onBlur}
              />
            </Grid.Col>
          </Fragment>
        ))}
    </Fragment>
  );
};

export default PatientHabitFormParts;
