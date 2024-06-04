import React from "react";
import { StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  txt: {
    fontSize: 80,
  },
  txt1: {
    fontSize: 22,
  },
});

const NoData = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.txt}>Invalid Address</Text>
      <Text style={styles.txt1}>Please Check the url you have provided</Text>
    </View>
  );
};

export default NoData;
