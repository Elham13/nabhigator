import React from "react";
import SectionHeading from "./SectionHeading";
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import KeyValueView from "./KeyValueView";

const styles = StyleSheet.create({
  detailContainer: {
    marginBottom: 20,
    border: "1px solid gray",
    padding: 16,
    borderRadius: 12,
  },
  longKeyText: {
    fontWeight: 700,
    paddingBottom: 1,
    fontSize: 16,
  },
  longValueText: {
    fontWeight: 400,
    paddingBottom: 1,
    fontSize: 16,
    color: "green",
  },
  Separator: {
    display: "flex",
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 20,
    flexWrap: "wrap",
  },
});

type KeyValue = {
  key: string;
  value: any;
  title?: string;
  isLongText?: boolean;
  shouldWrap?: boolean;
};

type PropTypes = {
  data: KeyValue[];
  topic: string;
  customStyle?: Record<string, string | number>;
};

const ThreeSectionView = ({ data, topic, customStyle }: PropTypes) => {
  const normalData = data?.filter((el) => !el?.isLongText);

  const longData = data.filter((el) => !!el?.isLongText);

  return (
    <View style={customStyle}>
      {!!topic && <SectionHeading>{topic}</SectionHeading>}
      <View style={styles.Separator}>
        {normalData?.map((el, ind) => (
          <KeyValueView
            key={ind}
            left={el?.key}
            right={el?.value}
            title={el?.title}
            shouldWrap={el?.shouldWrap}
          />
        ))}
      </View>
      {longData && longData?.length > 0
        ? longData?.map((data, ind) => (
            <View key={ind} style={styles.detailContainer}>
              <Text style={styles.longKeyText}>{data?.key}</Text>
              <Text style={styles.longValueText}>{data?.value}</Text>
            </View>
          ))
        : null}
    </View>
  );
};

export default ThreeSectionView;
