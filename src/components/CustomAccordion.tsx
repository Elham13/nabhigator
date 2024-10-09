import { Box } from "@mantine/core";
import { useState, ReactNode } from "react";
import { IoChevronDown } from "react-icons/io5";

interface AccordionItemProps {
  title: string;
  children: ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Box className="border-b dark:border-slate-700">
      <Box
        onClick={toggleAccordion}
        className="flex justify-between items-center py-2 px-4 cursor-pointer bg-slate-50 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-950"
      >
        <span className="text-sm">{title}</span>
        <span>
          <IoChevronDown
            className={`transition-all ${isOpen ? "rotate-180" : "rotate-0"}`}
          />
        </span>
      </Box>
      {isOpen && (
        <div className="p-4 bg-gray-50 dark:bg-slate-800">{children}</div>
      )}
    </Box>
  );
};

interface AccordionProps {
  children: ReactNode;
}

const CustomAccordion: React.FC<AccordionProps> = ({ children }) => {
  return <Box className="shadow-md rounded-md">{children}</Box>;
};

export { CustomAccordion, AccordionItem };
