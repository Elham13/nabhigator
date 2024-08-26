import React from "react";
import { StyleSheet, Text, View } from "@react-pdf/renderer";

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
    maxWidth: "300px",
    color: "green",
  },
});

type PropTypes = {
  left: string;
  right: string;
};

const KeyValueView = ({ left, right }: PropTypes) => {
  return (
    <View style={styles.detailSection}>
      <Text style={styles.keyText}>{left} :</Text>
      <Text style={styles.valueText}>{right}</Text>
    </View>
  );
};

export default KeyValueView;
