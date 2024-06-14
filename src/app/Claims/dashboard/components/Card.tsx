import { IUserFromSession } from "@/lib/utils/types/authTypes";
import { Role } from "@/lib/utils/types/fniDataTypes";
import { Tooltip } from "@mantine/core";

type CardPropTypes = {
  number: number;
  color: "Amber" | "Green" | "Red";
  claimType: "PreAuth" | "Reimbursement" | "PA/CI" | "Total";
  user: IUserFromSession | null;
};

const Card = ({ number, color, claimType, user }: CardPropTypes) => {
  const colorMap = {
    Amber: "#FFBF00",
    Green: "#008000",
    Red: "#ff0000",
  };

  let tooltipMsg = "";

  if (claimType === "PreAuth") {
    if (user?.activeRole === Role.ALLOCATION) {
      tooltipMsg =
        color === "Green"
          ? "Case age is 0-30 minutes since time of falling into allocation bucket"
          : color === "Amber"
          ? "Case age is between 30 and 45 minutes since time of falling into allocation bucket"
          : color === "Red"
          ? "Case age is more than 45 minutes since time of falling into allocation bucket"
          : "-";
    } else if (
      user?.role &&
      [Role.POST_QA, Role.POST_QA_LEAD].includes(user?.activeRole)
    ) {
      tooltipMsg =
        color === "Green"
          ? "Case age is 0-30 minutes since time of falling into Post-QA bucket"
          : color === "Amber"
          ? "Case age is between 30 and 45 minutes since time of falling into Post-QA bucket"
          : color === "Red"
          ? "Case age is more than 45 minutes since time of falling into Post-QA bucket"
          : "-";
    } else {
      tooltipMsg =
        color === "Green"
          ? "Case age is 0-2 hours since intimation date"
          : color === "Amber"
          ? "Case age is between 2 and 4 hours since intimation date"
          : color === "Red"
          ? "Case age is more than 4 hours since intimation date"
          : "-";
    }
  } else if (["PA/CI", "Reimbursement"].includes(claimType)) {
    if (user?.activeRole === Role.ALLOCATION) {
      tooltipMsg =
        color === "Green"
          ? "Case age is 0-4 hours since time of falling into allocation bucket"
          : color === "Amber"
          ? "Case age is between 4 to 6 hours since time of falling into allocation bucket"
          : color === "Red"
          ? "Case age is more than 6 hours since time of falling into allocation bucket"
          : "-";
    } else if (
      user?.activeRole &&
      [Role.POST_QA, Role.POST_QA_LEAD].includes(user?.activeRole)
    ) {
      tooltipMsg =
        color === "Green"
          ? "Case age is 0-1 day since date of falling into Post QA bucket"
          : color === "Amber"
          ? "Case age is between 1 to 2 days since date of falling into Post QA bucket"
          : color === "Red"
          ? "Case age is more than 2 days since date of falling into Post QA bucket"
          : "-";
    } else {
      tooltipMsg =
        color === "Green"
          ? "Case age is 0-1 day since intimation date"
          : color === "Amber"
          ? "Case age is between 1 to 2 days since intimation date"
          : color === "Red"
          ? "Case age is more than 2 days since intimation date"
          : "-";
    }
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
