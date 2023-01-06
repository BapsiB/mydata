import React, { useState, useEffect } from 'react';
import { Text, Image, TextInput, StyleSheet, View, TouchableOpacity, Button } from 'react-native';
import SharedConstants from '../sharedConstants.js';
import DataManager from '../dataManager.js';
import Draggable from 'react-native-draggable';

const NotesScreen = ({}) => {

  const [arrayQuestions, setArrayQuestions] = React.useState([]);

  const updateQuestions = () => {
    const arrayQuestionsOrigin = DataManager.getQuestions();
    // we remove the questions that are the notes (they will be displayed in another screen)
    const filtered = arrayQuestionsOrigin.filter((question) => {return question.type == SharedConstants.questionTypes.QUESTION_TYPE_NOTE});
    setArrayQuestions(filtered);
    forceUpdate();
  }

  const forceUpdate = React.useReducer(() => ({}))[1]

  useEffect(() => {
    updateQuestions();
}, []);

  return (
    <View style={{flex:2, flexDirection: "row", backgroundColor:"#7e4"}}>
        <Draggable x={75} y={100} renderSize={56} renderColor='black' renderText='A' isCircle shouldReverse onShortPressRelease={()=>alert('touched!!')}/> 
        <Draggable x={200} y={300} renderColor='red' renderText='B'/>
        <Draggable/>
        <Draggable x={50} y={50}>
          <View style={styles.noteContainer}>
            <Text>tense</Text>
          </View>
        </Draggable>
    </View>
  )
}

const styles = StyleSheet.create({
  noteContainer: {
    backgroundColor:"#fff",
    height:"60%"
  },
});

export default NotesScreen;