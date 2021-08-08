import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function NavItem(props) {
  let styles = StyleSheet.create({
    tab: {
      color: "white",
      padding: 20,
      fontSize: 25,
      borderColor: "grey",
    },
  });
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Text style={styles.tab}>{props.text}</Text>
    </TouchableOpacity>
  );
}
