import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

export default function App() {
  const [globalStyles, setGlobalStyles] = useState(
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
      },
    })
  );

  return (
    <View style={globalStyles.container}>
      <StatusBar style="auto" />
    </View>
  );
}
