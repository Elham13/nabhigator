import React from "react";
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import SectionHeading from "./SectionHeading";

const styles = StyleSheet.create({
  detailSection: {
    paddingBottom: 20,
  },
  keyText: {
    fontWeight: 700,
    paddingBottom: 1,
    fontSize: 16,
  },
  valueText: {
    fontWeight: 400,
    paddingBottom: 1,
    fontSize: 16,
    maxWidth: "600px",
    color: "green",
  },
  Separator: {
    display: "flex",
    flexDirection: "row",
    gap: "80px",
    marginTop: 5,
    marginBottom: 20,
    width: "100%",
  },
  subSeparator: {
    flexGrow: 1,
    gap: "3px",
  },
});

type KeyValue = { key: string; value: any };

type PropTypes = {
  data: KeyValue[];
  topic: string;
  customStyle?: Record<string, string | number>;
};

const TwoSectionView = ({ data, topic, customStyle }: PropTypes) => {
  // Function to generate JSX for a detail section
  const detailSectionJsx = (entry: KeyValue) => (
    <View style={styles.detailSection}>
      <Text style={styles.keyText}>{entry.key} :</Text>
      <Text style={styles.valueText}>{entry.value}</Text>
    </View>
  );

  // Calculate the split size for the array to split into two sections
  const splitSize = Math.ceil(data.length / 2);

  // Split the data into two sections
  const firstSection = data.slice(0, splitSize);
  const secondSection = data.slice(splitSize);

  return (
    <View style={customStyle}>
      <SectionHeading>{topic}</SectionHeading>
      <View style={styles.Separator}>
        <View style={styles.subSeparator}>
          {firstSection.map((entry) => detailSectionJsx(entry))}
        </View>
        <View style={styles.subSeparator}>
          {secondSection.map((entry) => detailSectionJsx(entry))}
        </View>
      </View>
    </View>
  );
};

export default TwoSectionView;
