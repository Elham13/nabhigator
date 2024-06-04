import React from "react";
import { StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  headingSection: {
    display: "flex",
    font: "bold",
    marginTop: 5,
  },
  subheadText: {
    fontWeight: "ultrabold",
    padding: 3,
    fontSize: 20,
    backgroundColor: "#5996f7",
    color: "white",
    width: "100%",
  },
});

const SectionHeading = ({ children }: { children: React.ReactNode }) => {
  return (
    <View style={styles.headingSection}>
      <Text style={styles.subheadText}>{children}</Text>
    </View>
  );
};

export default SectionHeading;
