import { Box, Divider, Text } from "@mantine/core";

type PropTypes = { label: string; value: any; wrapLabel?: boolean };

const KeyValueContainer = ({ label, value, wrapLabel = false }: PropTypes) => {
  return (
    <Box mt={4} className="hover:bg-slate-200 h-full">
      <Box className="flex items-center justify-between gap-x-2 h-full">
        <Text className={`${!wrapLabel ? "whitespace-nowrap" : ""}`}>
          {label}
        </Text>
        <Text
          fw={500}
          c={`${
            ["Not Found", "Not Found!"].includes(value) ? "grape" : "green"
          }`}
        >
          {value}
        </Text>
      </Box>
      <Divider />
    </Box>
  );
};

export default KeyValueContainer;
