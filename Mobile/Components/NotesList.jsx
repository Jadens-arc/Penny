import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import Note from "./Note";

export default function NoteList(props) {
  return (
    <ScrollView>
      {props.data.map((item) => {
        return <Note text={item} />;
      })}
    </ScrollView>
  );
}
