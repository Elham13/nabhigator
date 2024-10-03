import React, { Fragment } from "react";
import { ITasksAndDocuments } from "@/lib/utils/types/fniDataTypes";
import KeyValueContainer from "./KeyValueContainer";
import { Title } from "@mantine/core";

interface IProps {
  tasksAndDocs?: ITasksAndDocuments | null;
  part?: "Insured" | "Hospital";
}

const TasksViewKeyValue = ({ tasksAndDocs, part }: IProps) => {
  if (
    tasksAndDocs &&
    !!tasksAndDocs?.tasks &&
    tasksAndDocs?.tasks?.length > 0
  ) {
    return (
      <Fragment>
        {!!part && <Title order={4}>{part} part tasks</Title>}
        {tasksAndDocs?.tasks?.map((task, ind) => {
          const flag = task.completed === true ? "completed" : "pending";
          return (
            <KeyValueContainer
              key={ind}
              label={`Task - ${ind + 1}`}
              value={`${task.name} (${flag})`}
            />
          );
        })}
      </Fragment>
    );
  }

  return null;
};

export default TasksViewKeyValue;
