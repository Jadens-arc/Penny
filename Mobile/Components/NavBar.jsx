import React from "react";
import { ScrollView, Text, StyleSheet, View } from "react-native";
import NavItem from "./NavItem";

export default function NavBar(props) {
  const styles = StyleSheet.create({
    container: {
      display: "flex",
      borderColor: "grey",
      borderWidth: 1,
      borderRadius: 20,
      padding: 5,
      overflow: "hidden",
      flexDirection: "row",
      marginLeft: 20,
      marginRight: 20,
    },
    scrollview: {
      flex: 1,
    },
  });
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollview}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
      >
        {props.data.map((item) => {
          return (
            <NavItem text={item} onPress={() => props.setCurrentList(item)} />
          );
        })}

        <NavItem text="+" />
      </ScrollView>
    </View>
  );
}
