import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Note(props) {
  const styles = StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: "grey",
      borderRadius: 10,
      padding: 10,
      marginBottom: 15,
    },
    text: {
      color: "white",
      fontSize: 23,
    },
  });
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{props.text}</Text>
    </View>
  );
}
