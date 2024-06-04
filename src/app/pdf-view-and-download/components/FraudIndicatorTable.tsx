import React from "react";
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { IFraudIndicator } from "@/lib/utils/types/fniDataTypes";

const styles = StyleSheet.create({
  rowView: {
    display: "flex",
    flexDirection: "row",
    borderTop: "1px solid #EEE",
    paddingTop: 8,
    paddingBottom: 8,
    textAlign: "center",
  },
});

type PropTypes = {
  indicatorsList: IFraudIndicator[];
};

const FraudIndicatorTable = ({ indicatorsList }: PropTypes) => {
  const fraudIndicatorArray: IFraudIndicator[] = [];
  for (const key in indicatorsList) {
    if (Object.hasOwnProperty.call(indicatorsList, key)) {
      fraudIndicatorArray.push(indicatorsList[key]);
    }
  }

  const filteredData = fraudIndicatorArray.filter(
    (indicator) =>
      indicator?.Values?.CL_Selected === "TRUE" ||
      indicator?.Values?.FI_Selected === "TRUE"
  );

  const mappedData = filteredData.map((element) => {
    return {
      FRAUD_INDICATOR_DESC: element.FRAUD_INDICATOR_DESC,
    };
  });

  const tableData = {
    column: ["FRAUD_INDICATOR_DESC"],
    data: mappedData,
  };

  return (
    <>
      <View style={styles.rowView}>
        {tableData["column"].map((c, index) => (
          <Text
            key={index}
            style={{
              width: `${100 / tableData["column"].length}%`,
              backgroundColor: "#aaa",
              padding: 10,
              fontSize: 16,
            }}
          >
            {c}
          </Text>
        ))}
      </View>

      {tableData["data"]?.map((rowData, rowIndex) => (
        <View key={rowIndex} style={styles.rowView}>
          {tableData["column"]?.map((c, colIndex) => (
            <Text
              key={colIndex}
              style={{
                width: `${100 / tableData["column"].length}%`,
                fontSize: 16,
              }}
            >
              {rowData[c as keyof typeof rowData]}
            </Text>
          ))}
        </View>
      ))}
    </>
  );
};

export default FraudIndicatorTable;
