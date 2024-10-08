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
    <div className="border-b">
      <div
        onClick={toggleAccordion}
        className="flex justify-between items-center py-2 px-4 cursor-pointer bg-slate-50 hover:bg-slate-200"
      >
        <span className="text-sm">{title}</span>
        <span>
          <IoChevronDown
            className={`transition-all ${isOpen ? "rotate-180" : "rotate-0"}`}
          />
        </span>
      </div>
      {isOpen && <div className="p-4 bg-gray-50">{children}</div>}
    </div>
  );
};

interface AccordionProps {
  children: ReactNode;
}

const CustomAccordion: React.FC<AccordionProps> = ({ children }) => {
  return <div className="shadow-md rounded-md">{children}</div>;
};

export { CustomAccordion, AccordionItem };
