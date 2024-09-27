import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { AcceptedValues } from "../utils/types/fniDataTypes";
import { changeTaskInitialValues } from "../utils/constants";

type ContextType = {
  values: AcceptedValues;
  setValues: Dispatch<SetStateAction<AcceptedValues>>;
};

const TasksAndDocsContext = createContext<ContextType>({
  values: changeTaskInitialValues,
  setValues: () => {},
});

type PropTypes = {
  children: React.ReactElement;
};

const TasksAndDocsProvider = ({ children }: PropTypes) => {
  const [values, setValues] = useState<AcceptedValues>(changeTaskInitialValues);

  return (
    <TasksAndDocsContext.Provider value={{ values, setValues }}>
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
