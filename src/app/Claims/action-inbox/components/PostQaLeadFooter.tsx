import React, { Dispatch, SetStateAction } from "react";
import { IShowElement } from "@/lib/utils/types/fniDataTypes";
import { Box, Button } from "@mantine/core";
import dynamic from "next/dynamic";
import Loading from "@/components/Loading";
const PostQaList = dynamic(() => import("./PostQaList"), {
  ssr: false,
  loading: () => <Loading />,
});

type PropTypes = {
  claimId: number;
  showElement: IShowElement;
  setShowElement: Dispatch<SetStateAction<IShowElement>>;
};

const PostQaLeadFooter = ({
  claimId,
  showElement,
  setShowElement,
}: PropTypes) => {
  return (
    <Box mt={10}>
      <Button
        onClick={() =>
          setShowElement((prev) => ({
            ...prev,
            assignToPostQA: !prev?.assignToPostQA,
          }))
        }
      >
        {showElement.assignToPostQA ? "Cancel" : "Assign to Post QA"}
      </Button>
      {showElement.assignToPostQA ? <PostQaList claimId={claimId} /> : null}
    </Box>
  );
};

export default PostQaLeadFooter;
