import React, { useState } from "react";
import {
  ActionIcon,
  Checkbox,
  Modal,
  SimpleGrid,
  Title,
  Tooltip,
} from "@mantine/core";
import { CiSettings } from "react-icons/ci";
import { useLocalStorage } from "@mantine/hooks";
import { IVisibleColumn } from "@/lib/utils/types/fniDataTypes";
import { StorageKeys } from "@/lib/utils/types/enums";
import { visibleColumnsOptions } from "@/lib/utils/constants";

const TableAdjustment = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [cols, setCols] = useLocalStorage<IVisibleColumn[]>({
    key: StorageKeys.VISIBLE_COLUMNS,
    defaultValue: visibleColumnsOptions,
  });

  return (
    <>
      {open ? (
        <Modal opened={open} onClose={() => setOpen(false)} size="xl">
          <Title order={4} ta="center">
            Select which columns you want to be visible?
          </Title>

          <SimpleGrid cols={3} m={50}>
            <Checkbox
              label="All"
              checked={cols?.every((col) => col.visible)}
              indeterminate={cols?.some((col) => !col.visible)}
              onChange={(e) => {
                const checked = e.target.checked;
                setCols((prev) =>
                  prev?.map((el, ind) => ({ ...el, visible: checked }))
                );
              }}
            />

            {cols?.map((option, index) => (
              <Checkbox
                key={index}
                label={option?.label}
                checked={option?.visible}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setCols((prev) =>
                    prev?.map((el, ind) =>
                      ind === index ? { ...el, visible: checked } : el
                    )
                  );
                }}
              />
            ))}
          </SimpleGrid>
        </Modal>
      ) : null}
      <Tooltip label="Make adjustments on table" color="blue" withArrow>
        <ActionIcon onClick={() => setOpen(true)}>
          <CiSettings />
        </ActionIcon>
      </Tooltip>
    </>
  );
};

export default TableAdjustment;
