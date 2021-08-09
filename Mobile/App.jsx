import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, SafeAreaView, View } from "react-native";
import Title from "./Components/Title";
import NoteList from "./Components/NotesList";
import NavBar from "./Components/NavBar";
import AddNoteButton from "./Components/AddNoteButton";

export default function App() {
  let styles = StyleSheet.create({
    view: {
      backgroundColor: "#171717",
      flex: 1,
      color: "white",
      paddingLeft: 20,
      paddingRight: 20,
    },
  });

  let [notesData, setNotesData] = useState({
    list1: ["heyoo", "its me"],
    List2: ["Its me again", "part 2"],
    List3: ["Its me again", "part 3"],
    List4: ["Its me again", "part 4"],
    List5: ["Its me again", "part 5"],
  });

  let [currentList, setCurrentList] = useState(Object.keys(notesData)[0]);

  function appendInput() {
    let copy = Object.assign({}, notesData);
    copy[currentList].push("Input");
    setNotesData(copy);
  }

  return (
    <SafeAreaView style={styles.view}>
      <View style={styles.view}>
        <StatusBar style="light" />
        <Title text={currentList} />
        <NoteList data={notesData[currentList]} />
      </View>
      <AddNoteButton appendInput={appendInput} />
      <NavBar data={Object.keys(notesData)} setCurrentList={setCurrentList} />
    </SafeAreaView>
  );
}
