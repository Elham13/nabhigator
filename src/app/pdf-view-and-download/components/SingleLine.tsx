import React from "react";
import { StyleSheet, Text } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  singleLineTxt: {
    fontSize: 22,
    backgroundColor: "#bbb",
    padding: 8,
    marginVertical: 6,
  },
});

const SingleLine = ({ children }: { children: React.ReactNode }) => {
  return <Text style={styles.singleLineTxt}>{children}</Text>;
};

export default SingleLine;
