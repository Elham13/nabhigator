import { ITasksAndDocuments } from "@/lib/utils/types/fniDataTypes";
import React from "react";
import KeyValueContainer from "./KeyValueContainer";
import { Title } from "@mantine/core";

interface IProps {
  tasksAndDocs?: ITasksAndDocuments[];
  allocationType?: "Single" | "Dual";
}

const TasksViewKeyValue = ({ tasksAndDocs, allocationType }: IProps) => {
  if (tasksAndDocs) {
    if (allocationType === "Single") {
      return (
        <>
          {tasksAndDocs[0]?.tasks?.map((task, ind) => {
            const flag = task.completed === true ? "completed" : "pending";
            <KeyValueContainer
              key={ind}
              label={`Task - ${ind + 1}`}
              value={`${task.name} (${flag})`}
            />;
          })}
        </>
      );
    } else if (allocationType === "Dual") {
      return (
        <>
          <Title order={4}>Insured part tasks</Title>
          {tasksAndDocs[0]?.tasks?.map((task, ind) => {
            const flag = task.completed === true ? "completed" : "pending";
            <KeyValueContainer
              key={ind}
              label={`Task - ${ind + 1}`}
              value={`${task.name} (${flag})`}
            />;
          })}
          <Title order={4}>Hospital part tasks</Title>
          {tasksAndDocs[1]?.tasks?.map((task, ind) => {
            const flag = task.completed === true ? "completed" : "pending";
            <KeyValueContainer
              key={ind}
              label={`Task - ${ind + 1}`}
              value={`${task.name} (${flag})`}
            />;
          })}
        </>
      );
    }
  }

  return null;
};

export default TasksViewKeyValue;
