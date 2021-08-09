import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function AddNoteButton(props) {
  const styles = StyleSheet.create({
    container: {
      position: "absolute",
      right: 20,
      bottom: 150,
      width: 50,
      height: 50,
      borderWidth: 1,
      borderColor: "grey",
      borderRadius: 50,
      display: "flex",
      justifyContent: "center",
      alignContent: "center",
    },
    text: {
      color: "white",
      fontSize: 50,
      textAlign: "center",
    },
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => props.appendInput()}
    >
      <Text style={styles.text}>+</Text>
    </TouchableOpacity>
  );
}
