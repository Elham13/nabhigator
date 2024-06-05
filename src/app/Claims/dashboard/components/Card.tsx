import { Tooltip } from "@mantine/core";

type CardPropTypes = {
  number: number;
  color: "Amber" | "Green" | "Red";
  claimType: "PreAuth" | "Reimbursement" | "PA/CI" | "Total";
};

const Card = ({ number, color, claimType }: CardPropTypes) => {
  const colorMap = {
    Amber: "#FFBF00",
    Green: "#008000",
    Red: "#ff0000",
  };

  // TODO: Make the message, role specific

  let tooltipMsg = "";

  if (claimType === "PreAuth") {
    tooltipMsg =
      color === "Green"
        ? "Case age is 0-2 hour"
        : color === "Amber"
        ? "Case age is between 2 and 4 hours"
        : color === "Red"
        ? "Case age is more than 4 hours"
        : "";
  } else if (["PA/CI", "Reimbursement"].includes(claimType)) {
    tooltipMsg =
      color === "Green"
        ? "Case age is 0-1 day"
        : color === "Amber"
        ? "Case age is 2 days"
        : color === "Red"
        ? "Case age is more than 2 days"
        : "";
  }

  return (
    <div
      className={`text-white rounded-lg overflow-hidden`}
      style={{ backgroundColor: colorMap[color] }}
    >
      <Tooltip label={tooltipMsg}>
        <p className="text-xl p-4 text-center">{number}</p>
      </Tooltip>
    </div>
  );
};

export default Card;
