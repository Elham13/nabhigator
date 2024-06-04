import React from "react";
import { StyleSheet, Text } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  heading: {
    backgroundColor: "red",
    padding: 10,
    textAlign: "center",
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
});

const Heading = ({ children }: { children: React.ReactNode }) => {
  return <Text style={styles.heading}>{children}</Text>;
};

export default Heading;
