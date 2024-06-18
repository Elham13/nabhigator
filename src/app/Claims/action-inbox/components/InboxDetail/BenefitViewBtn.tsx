import React, { useState } from "react";
import { Button, Modal, Table } from "@mantine/core";
import { IBenefitsCovered } from "@/lib/utils/types/fniDataTypes";

type PropType = {
  benefitsCovered: IBenefitsCovered[];
};

const BenefitViewBtn = ({ benefitsCovered }: PropType) => {
  const [visible, setVisible] = useState<boolean>(false);

  const handleClose = () => {
    setVisible(false);
  };

  return (
    <>
      <Button
        disabled={!benefitsCovered || benefitsCovered?.length === 0}
        size="compact-xs"
        onClick={() => setVisible(true)}
      >
        View
      </Button>
      {visible ? (
        <Modal
          opened={visible}
          onClose={handleClose}
          title="List of Benefits Covered"
          centered
          size="lg"
        >
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Benefit Type</Table.Th>
                <Table.Th>Benefit Type Indicator</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {benefitsCovered?.map((el, ind) => (
                <Table.Tr key={ind}>
                  <Table.Td>{el?.benefitType}</Table.Td>
                  <Table.Td>{el?.benefitTypeIndicator}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Modal>
      ) : null}
    </>
  );
};

export default BenefitViewBtn;
