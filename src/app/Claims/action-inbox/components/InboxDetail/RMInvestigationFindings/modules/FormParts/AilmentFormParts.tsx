import React, { Fragment } from "react";
import { Grid, MultiSelect, Select, TextInput } from "@mantine/core";
import {
  IHospitalVerification,
  IInsuredVerification,
} from "@/lib/utils/types/rmDataTypes";
import { TAilment } from "@/lib/utils/types/fniDataTypes";
import { ailmentOptions, yesNoOptions } from "@/lib/utils/constants/options";

interface PropTypes {
  values: IHospitalVerification | IInsuredVerification;
  onChange: (values: IHospitalVerification | IInsuredVerification) => void;
  handleBlur: ({}: { key: "pedOrNonDisclosure"; value: any }) => void;
}

const AilmentFormParts = ({ values, onChange, handleBlur }: PropTypes) => {
  const handleChange = ({
    key,
    ind,
    value,
  }: {
    key: keyof TAilment;
    ind: number;
    value: string;
  }) => {
    let ailmentDetail: TAilment[] =
      values?.pedOrNonDisclosure?.ailmentDetail || [];

    ailmentDetail = ailmentDetail?.map((el, i) =>
      i === ind ? { ...el, [key]: value } : el
    );
    onChange({
      ...values,
      pedOrNonDisclosure: { ...values?.pedOrNonDisclosure!, ailmentDetail },
    });
  };

  const onBlur = () =>
    handleBlur({
      key: "pedOrNonDisclosure",
      value: values?.pedOrNonDisclosure,
    });

  return (
    <Fragment>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <MultiSelect
          label="Ailments"
          placeholder="Ailments"
          required
          withAsterisk
          clearable
          searchable
          hidePickedOptions
          data={ailmentOptions}
          value={
            values?.pedOrNonDisclosure?.ailmentDetail?.map(
              (el) => el?.ailment
            ) || []
          }
          onChange={(val) => {
            onChange({
              ...values,
              pedOrNonDisclosure: {
                ...values?.pedOrNonDisclosure!,
                ailmentDetail: val?.map((el) => ({
                  ailment: el,
                  diagnosis: "",
                  duration: "",
                  onMedication: "No",
                })),
              },
            });
          }}
          onBlur={onBlur}
        />
      </Grid.Col>
      {!!values?.pedOrNonDisclosure?.ailmentDetail &&
        values?.pedOrNonDisclosure?.ailmentDetail?.length > 0 &&
        values?.pedOrNonDisclosure?.ailmentDetail?.map((el, ind) => (
          <Fragment key={ind}>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label={`Diagnosis of ${el?.ailment}`}
                placeholder={`Diagnosis of ${el?.ailment}`}
                required
                withAsterisk
                value={el?.diagnosis}
                onChange={(e) =>
                  handleChange({
                    key: "diagnosis",
                    ind,
                    value: e.target.value,
                  })
                }
                onBlur={onBlur}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <TextInput
                label={`Duration of ${el?.ailment}`}
                placeholder={`Duration of ${el?.ailment}`}
                required
                withAsterisk
                value={el?.duration}
                onChange={(e) =>
                  handleChange({
                    key: "duration",
                    ind,
                    value: e.target.value,
                  })
                }
                onBlur={onBlur}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Select
                label={`On Medication of ${el?.ailment}`}
                placeholder={`On Medication of ${el?.ailment}`}
                required
                withAsterisk
                data={yesNoOptions}
                value={el?.onMedication}
                onChange={(val) =>
                  handleChange({
                    key: "onMedication",
                    ind,
                    value: val || "",
                  })
                }
                onBlur={onBlur}
              />
            </Grid.Col>
          </Fragment>
        ))}
    </Fragment>
  );
};

export default AilmentFormParts;
