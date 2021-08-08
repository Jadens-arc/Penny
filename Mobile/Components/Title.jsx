import React from "react";
import { Text, StyleSheet } from "react-native";

export default function Title(props) {
  const styles = StyleSheet.create({
    title: {
      color: "white",
      fontSize: 50,
      fontWeight: "700",
      marginBottom: 30,
    },
  });
  return <Text style={styles.title}>{props.text}</Text>;
}
