import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Modal, Table } from "@mantine/core";
import ViewBtn from "./ViewBtn";
import CommonTablePlaceholder from "../commonTable/CommonTablePlaceholder";
import { IGetDocumentDetailsDoc } from "@/lib/utils/types/maximusResponseTypes";

type PropTypes = {
  open: boolean;
  docs: IGetDocumentDetailsDoc[];
  claimId?: number;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const DocumentsTable = ({ open, docs, claimId, setOpen }: PropTypes) => {
  const [base64, setBase64] = useState<string>("");

  useEffect(() => {
    if (!open) setBase64("");
  }, [open]);

  return open ? (
    <Modal opened={open} onClose={() => setOpen(false)} size="xl">
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Document Class</Table.Th>
            <Table.Th>Document Name</Table.Th>
            <Table.Th>Click To View</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {docs?.length > 0 ? (
            docs?.map((doc) => (
              <Table.Tr key={doc?.Document_Index}>
                <Table.Td>{doc?.Document_Class}</Table.Td>
                <Table.Td>{doc?.Document_Name}</Table.Td>
                <Table.Td>
                  <ViewBtn
                    Document_Index={doc?.Document_Index}
                    docName={doc?.Document_Name}
                    claimId={claimId}
                    setBase64={setBase64}
                  />
                </Table.Td>
              </Table.Tr>
            ))
          ) : (
            <CommonTablePlaceholder colSpan={3} type="empty" />
          )}
        </Table.Tbody>
      </Table>
      {!!base64 ? (
        <object data={base64} className="w-full min-h-screen mt-8" />
      ) : null}
    </Modal>
  ) : null;
};

export default DocumentsTable;
