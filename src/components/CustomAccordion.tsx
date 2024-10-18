import { Box, Flex, Text } from "@mantine/core";
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
    <Box className="border rounded-lg">
      <Flex
        justify="space-between"
        align="center"
        onClick={toggleAccordion}
        className="py-2 px-4 cursor-pointer"
      >
        <Text className="text-sm">{title}</Text>
        <IoChevronDown
          className={`transition-all ${isOpen ? "rotate-180" : "rotate-0"}`}
        />
      </Flex>
      {isOpen && <Box className="p-4">{children}</Box>}
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
