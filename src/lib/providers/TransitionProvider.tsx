"use client";

import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

type ContextType = {
  routeChanging: boolean;
  setRouteChanging: Dispatch<SetStateAction<boolean>>;
};

const TransitionContext = createContext<ContextType>({
  routeChanging: false,
  setRouteChanging: () => {},
});

type PropTypes = {
  children: ReactNode;
};

const TransitionProvider = ({ children }: PropTypes) => {
  const [routeChanging, setRouteChanging] = useState<boolean>(false);

  return (
    <TransitionContext.Provider value={{ routeChanging, setRouteChanging }}>
      {children}
    </TransitionContext.Provider>
  );
};

export default TransitionProvider;

export const useTransition = () => {
  const context = useContext(TransitionContext);
  if (context === undefined) {
    throw new Error("useTransition must be used within a TransitionProvider");
  }
  return context;
};
