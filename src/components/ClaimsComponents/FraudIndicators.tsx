import React from "react";
import { IFraudIndicator } from "@/lib/utils/types/fniDataTypes";

interface FraudIndicatorTableProps {
  data?: IFraudIndicator[];
  comments?: string;
}

const FraudIndicatorTable: React.FC<FraudIndicatorTableProps> = ({
  data,
  comments,
}) => {
  // Filter out rows where both CL_Selected and FI_Selected are false
  const filteredData = data?.filter(
    (indicator) =>
      indicator.Values.CL_Selected === "TRUE" ||
      indicator.Values.FI_Selected === "TRUE"
  );

  return (
    <>
      <div className="flex flex-col gap-4">
        <table className="w-full border border-dotted border-gray-300">
          <thead>
            <tr>
              <th className="p-2 border-b border-dotted border-gray-300 text-xs">
                FRAUD INDICATOR DESC
              </th>
              <th className="p-2 border-b border-dotted border-gray-300 text-xs">
                CL_Selected
              </th>
              <th className="p-2 border-b border-dotted border-gray-300 text-xs">
                FI_Selected
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData?.map((indicator) => (
              <tr
                key={indicator._id}
                className="border-b border-dotted border-gray-300 text-xs"
              >
                <td className="p-2">{indicator.FRAUD_INDICATOR_DESC}</td>
                <td className="p-2 text-center text-xs">
                  {indicator.Values.CL_Selected === "TRUE" ? "✔️" : "❌"}
                </td>
                <td className="p-2 text-center text-xs">
                  {indicator.Values.FI_Selected === "TRUE" ? "✔️" : "❌"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>Other Comments</p>
        <p>{comments}</p>
      </div>
    </>
  );
};

export default FraudIndicatorTable;
