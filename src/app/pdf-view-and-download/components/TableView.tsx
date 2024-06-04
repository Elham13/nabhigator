import React from "react";
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { TYesNo } from "@/lib/utils/types/fniDataTypes";

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
  tableData: {
    column: string[];
    data?:
      | {
          Ailment?: string;
          Diagnosis?: string;
          Duration?: string;
          "On Medication"?: TYesNo;
        }[]
      | {
          Habit?: string;
          Frequency?: string;
          Quantity?: string;
          Duration?: string;
        }[];
  };
};

const TableView = ({ tableData }: PropTypes) => {
  return (
    <>
      <View style={styles.rowView}>
        {tableData["column"].map((c, index) => (
          <Text
            key={index} // Add a key to each mapped element
            style={{
              width: `${100 / tableData["column"].length}%`,
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
              key={colIndex} // Add a key to each mapped element
              style={{
                width: `${100 / tableData["column"].length}%`,
                fontSize: 16,
                marginHorizontal: 10,
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

export default TableView;
