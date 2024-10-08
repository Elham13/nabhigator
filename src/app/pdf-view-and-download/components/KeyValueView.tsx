import React from "react";
import { StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  detailSection: {
    paddingBottom: 10,
    marginRight: 4,
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
  headingSection: {
    display: "flex",
    font: "bold",
    marginTop: 15,
  },
  subheadText: {
    fontWeight: "ultrabold",
    padding: 3,
    fontSize: 20,
    backgroundColor: "#ba9607",
    color: "white",
    width: "100%",
  },
});

type PropTypes = {
  left: string;
  right: string;
  title?: string;
  shouldWrap?: boolean;
};

const KeyValueView = ({ left, right, title, shouldWrap }: PropTypes) => {
  const dynamicStyle = shouldWrap ? { flexBasis: "100%" } : { width: "30%" };
  return (
    <View style={{ ...styles.detailSection, ...dynamicStyle }}>
      {!!title && (
        <View style={styles.headingSection}>
          <Text style={styles.subheadText}>{title}</Text>
        </View>
      )}
      <Text style={styles.keyText}>{left} :</Text>
      <Text style={styles.valueText}>{right}</Text>
    </View>
  );
};

export default KeyValueView;
