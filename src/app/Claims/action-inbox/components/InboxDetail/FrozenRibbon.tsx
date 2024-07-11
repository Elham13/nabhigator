import React from "react";
import { IDashboardData } from "@/lib/utils/types/fniDataTypes";
import dayjs from "dayjs";

type PropTypes = {
  data: IDashboardData | null;
};

const FrozenRibbon = ({ data }: PropTypes) => {
  return (
    <div className="flex items-center justify-between gap-2 bg-green-700 text-white px-2">
      <p>
        Intimation Date:&nbsp;
        <strong>
          {data?.intimationDate
            ? dayjs(data?.intimationDate).format("DD-MMM-YYYY")
            : "-"}
        </strong>
      </p>
      <p>
        Outsourcing Date:&nbsp;
        <strong>
          {data?.dateOfOS ? dayjs(data?.dateOfOS).format("DD-MMM-YYYY") : "-"}
        </strong>
      </p>
      <p>
        TAT:&nbsp;
        <strong>{data?.openTAT || "0"} days</strong>
      </p>
    </div>
  );
};

export default FrozenRibbon;
