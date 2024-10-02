import React, { createContext, Dispatch, useContext, useReducer } from "react";
import { AcceptedValues } from "../utils/types/fniDataTypes";
import { changeTaskInitialValues } from "../utils/constants";

type ActionType = {
  type: "change_state";
  value: any;
};

type ContextType = {
  tasksState: AcceptedValues;
  dispatch: Dispatch<ActionType>;
};

const TasksAndDocsContext = createContext<ContextType>({
  tasksState: changeTaskInitialValues,
  dispatch: () => {},
});

const reducer = (state: AcceptedValues, action: ActionType) => {
  switch (action.type) {
    case "change_state": {
      return { ...state, ...action?.value };
    }
  }
  return changeTaskInitialValues;
};

type PropTypes = {
  children: React.ReactElement;
};

const TasksAndDocsProvider = ({ children }: PropTypes) => {
  const [tasksState, dispatch] = useReducer(reducer, changeTaskInitialValues);

  return (
    <TasksAndDocsContext.Provider
      value={{
        tasksState,
        dispatch,
      }}
    >
      {children}
    </TasksAndDocsContext.Provider>
  );
};

export default TasksAndDocsProvider;

export const useTasks = () => {
  const context = useContext(TasksAndDocsContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TasksAndDocsProvider");
  }
  return context;
};
